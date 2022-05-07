const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;

const {
    precisionRound, mapNumberRange, isLegacyEnabled, toLocalISOString, numberWithinRange, hasAlreadyProcessedMessage,
    calibrateAndPrecisionRoundOptions, addActionGroup, postfixWithEndpointName, getKey,
    batteryVoltageToPercentage, getMetaValue,
} = require('zigbee-herdsman-converters/lib/utils');


d1bdg_temperature = {
    cluster: 'msTemperatureMeasurement',
    type: ['attributeReport', 'readResponse'],
    options: [exposes.options.precision('temperature'), exposes.options.calibration('temperature')],
    convert: (model, msg, publish, options, meta) => {
        const temperature = parseFloat(msg.data['measuredValue']) / 100.0;
	const payload = {};
	//payload.temperature = calibrateAndPrecisionRoundOptions(temperature, options, 'temperature');
        //const property = postfixWithEndpointName('temperature', msg, model);
        //return {[property]: calibrateAndPrecisionRoundOptions(temperature, options, 'temperature')};
	payload.temperature = temperature;
	return payload;
    }
};

d1bdg_electrical_measurement = {
    cluster: 'haElectricalMeasurement',
    type: ['attributeReport', 'readResponse'],
    convert: (model, msg, publish, options, meta) => {
        const getFactor = (key) => {
            const multiplier = msg.endpoint.getClusterAttributeValue('haElectricalMeasurement', `${key}Multiplier`);
            const divisor = msg.endpoint.getClusterAttributeValue('haElectricalMeasurement', `${key}Divisor`);
            const factor = multiplier && divisor ? multiplier / divisor : 1;
            return factor;
        };
        const lookup = [
            {key: 'activePower', name: 'power', factor: 'acPower'},
            {key: 'activePowerPhB', name: 'power_phase_b', factor: 'acPower'},
            {key: 'activePowerPhC', name: 'power_phase_c', factor: 'acPower'},
            {key: 'rmsCurrent', name: 'current', factor: 'acCurrent'},
            {key: 'rmsCurrentPhB', name: 'current_phase_b', factor: 'acCurrent'},
            {key: 'rmsCurrentPhC', name: 'current_phase_c', factor: 'acCurrent'},
            {key: 'rmsVoltage', name: 'voltage', factor: 'acVoltage'},
            {key: 'rmsVoltagePhB', name: 'voltage_phase_b', factor: 'acVoltage'},
            {key: 'rmsVoltagePhC', name: 'voltage_phase_c', factor: 'acVoltage'},
        ];

        const payload = {};
        for (const entry of lookup) {
            if (msg.data.hasOwnProperty(entry.key)) {
		
		// const factor = getFactor(entry.factor);
		let factor = 1;
		if (entry.key === 'rmsCurrent')
            	    factor = 0.01;
		else if (entry.key === 'activePower')
		    factor = 1
		else if (entry.key === 'rmsVoltage')
		    factor = 0.1;

                const property = entry.name; //postfixWithEndpointName(entry.name, msg, model);
                payload[property] = precisionRound(msg.data[entry.key] * factor, 2);
	        // payload[property] = precisionRound(msg.data[entry.key] / 10, 1);
            }
        }
        return payload;
    }
};

d1bdg_metering = {
    cluster: 'seMetering',
    type: ['attributeReport', 'readResponse'],
    convert: (model, msg, publish, options, meta) => {
        const payload = {};
        const multiplier = msg.endpoint.getClusterAttributeValue('seMetering', 'multiplier');
        const divisor = msg.endpoint.getClusterAttributeValue('seMetering', 'divisor');
        const factor = 0.001; //multiplier && divisor ? multiplier / divisor : null;

        if (msg.data.hasOwnProperty('instantaneousDemand')) {
            let power = msg.data['instantaneousDemand'];
            if (factor != null) {
                power = (power * factor) * 1000; // kWh to Watt
            }
            payload.power = precisionRound(power, 2);
        }

        if (factor != null && (msg.data.hasOwnProperty('currentSummDelivered') ||
            msg.data.hasOwnProperty('currentSummReceived'))) {
            let energy = 0;
            if (msg.data.hasOwnProperty('currentSummDelivered')) {
                const data = msg.data['currentSummDelivered'];
                const value = (parseInt(data[0]) << 32) + parseInt(data[1]);
                energy += value * factor;
		//energy += value;
            }
            if (msg.data.hasOwnProperty('currentSummReceived')) {
                const data = msg.data['currentSummReceived'];
                const value = (parseInt(data[0]) << 32) + parseInt(data[1]);
                energy -= value * factor;
            }
            payload.energy = precisionRound(energy, 3);
        }

        return payload;
    },
};

//voltage_ac = () => new Numeric('voltage_ac', access.STATE).withUnit('V').withDescription('Measured electrical potential value');
//current_ac = () => new Numeric('current_ac', access.STATE).withUnit('A').withDescription('Instantaneous measured electrical current');
//power_ac = () => new Numeric('power_ac', access.STATE).withUnit('W').withDescription('Instantaneous measured power');

d1bdg_switch_config = {
    cluster: 'genOnOffSwitchCfg',
    type: ['readResponse'],
    convert: (model, msg, publish, options, meta) => {
        const button = getKey(model.endpoint(msg.device), msg.endpoint.ID);
        const {switchActions, switchType} = msg.data;
        const switchTypesLookup = ['toggle', 'momentary', 'multifunction'];
        const switchActionsLookup = ['on', 'off', 'toggle'];
        return {
            [`switch_type_${button}`]: switchTypesLookup[switchType],
            [`switch_actions_${button}`]: switchActionsLookup[switchActions],
        };
    },
}

d1bdg_inputs = {
    cluster: 'genMultistateInput',
    type: ['readResponse', 'attributeReport'],
    convert: (model, msg, publish, options, meta) => {
        const button = getKey(model.endpoint(msg.device), msg.endpoint.ID);
        const lookup = {0: 'hold', 1: 'single', 2: 'double', 3: 'triple', 4: 'quadruple', 255: 'release'};
        const clicks = msg.data['presentValue'];
        const action = lookup[clicks] ? lookup[clicks] : `many_${clicks}`;
        return {action: `${button}_${action}`};
    }
}

const def_d1zonof_v1 = 
{
    zigbeeModel: ['D1ZOnOff.v1'],
    model: 'D1ZOnOff.v1',
    vendor: 'D1BDG',
    description: 'Relay module',
    fromZigbee: [d1bdg_temperature, fz.on_off, fz.ignore_basic_report],
    toZigbee: [tz.ptvo_switch_trigger, tz.ptvo_switch_uart, tz.ptvo_switch_analog_input, tz.ptvo_switch_light_brightness, tz.on_off],
    exposes: [].concat(((enpoinsCount) => {
        const features = [e.temperature()];
        for (let i = 1; i <= enpoinsCount; i++) {
            const epName = `l${i}`;
            features.push(e.switch().withEndpoint(epName));
            features.push(exposes.text(epName, ea.ALL).withEndpoint(epName)
                .withProperty(epName).withDescription('Relay state'));
        }
        return features;
    })(5)),
    meta: {multiEndpoint: true},
    endpoint: (device) => {
        return {
	    system: 1,
            l1: 2, l2: 3, l3: 4, l4: 5, l5: 6
        };
    }
};

const def_d1zonof_v2 = 
{
    zigbeeModel: ['D1ZOnOff.v2'],
    model: 'D1ZOnOff.v2',
    vendor: 'D1BDG',
    description: 'Relay module',
    fromZigbee: [d1bdg_temperature, fz.on_off, fz.ignore_basic_report, d1bdg_electrical_measurement, d1bdg_metering, d1bdg_switch_config, d1bdg_inputs],
    toZigbee: [tz.on_off],
    exposes: [].concat(((enpoinsCount) => {
        const features = [e.temperature(), e.voltage(), e.current(), e.power(), e.energy()];
        for (let i = 1; i <= enpoinsCount; i++) {
            const epName = `l${i}`;
            features.push(e.switch().withEndpoint(epName));
            features.push(exposes.text(epName, ea.ALL).withEndpoint(epName)
                .withProperty(epName).withDescription('Relay state'));
        }
        return features;
    })(5)),
    meta: {multiEndpoint: true},
    endpoint: (device) => {
        return {
	    ac: 1,
            l1: 2, l2: 3, l3: 4, l4: 5, l5: 6
        };
    }
};

module.exports = [ def_d1zonof_v1, def_d1zonof_v2 ];

