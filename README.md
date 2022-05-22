# zigbee_firmwares
Firmwares for CC2652P chip

Zigbee router with endpoints:
* msTemperatureMeasurement (internal temperature), endpoint 1
* haElectricalMeasurement (AC voltage, AC current, AC power), endpoint 1
* seMetering (energy consumption), endpoint 1
* genOnOff (relays 0-4), endpoints 2-6
* genMultistateInput (buttons), endpoints 2-6

Modules:
* Zigbee: Ebyte E72-2G4M20S1E
* Electrical measurement: PZEM-004Tv2.0
* Relays: any with input signal 3.3V

E72-2G4M20S1E pins:
* DIO_5: 20dBm PA
* DIO_6: 2.4GHz
* DIO_7: LED blink while reporting
* DIO_8: LED connected to coordinator/router
* DIO_9: LED ON if any relay ON
* DIO_14: button 1, toggle relay 0
* DIO_15: button 2, rejoin to coordinator/router
* DIO_30: relay 0
* DIO_29: relay 1
* DIO_28: relay 2
* DIO_27: relay 3
* DIO_26: relay 4
* DIO_12 (RX), DIO_13 (TX): UART to PZEM-004Tv2.0

Timings:
* system temperature: 15 seconds after power on, every 30 seconds
* relay states: 15 seconds after power on, every 60 seconds
* AC voltage: 10 seconds after power on, every 10 seconds, if value changed >= 1V, else - every 60 seconds
* AC current: 10 seconds after power on, every 10 seconds, if value changed >= 0.01A, else - every 60 seconds
* AC power: 10 seconds after power on, every 10 seconds, if value changed >= 1W, else - every 60 seconds
* energy consumption: 10 seconds after power on, every 10 seconds, if value changed >= 0.01kWh, else - every 60 seconds

Issues:
* no switches support

## Usage in Zigbee2mqtt:

data/configuration.yaml
```c++
...
external_converters:
  - D1ZOnOff.converters.js
...
```

JSON message:
```
{
    "current": 0,
    "energy": 1,
    "linkquality": 94,
    "power": 0,
    "state_l1": "OFF",
    "state_l2": "OFF",
    "state_l3": "OFF",
    "state_l4": "OFF",
    "state_l5": "OFF",
    "temperature": 24.08,
    "voltage": 221.6
}
```

## My constraction

![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/IMG_20220429_140914.jpg?raw=true)
![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/IMG_20220429_141058.jpg?raw=true)
![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/IMG_20220429_143005.jpg?raw=true)
![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/IMG_20220429_144933.jpg?raw=true)
![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/IMG_20220429_144958.jpg?raw=true)
![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/IMG_20220506_210419.jpg?raw=true)
![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/IMG_20220506_210812.jpg?raw=true)

## My Zigbee network map

relays-bath2 router/endpoint:

![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/my-zigbee-map.png?raw=true)
