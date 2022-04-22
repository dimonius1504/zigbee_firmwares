# zigbee_firmwares
Firmwares for CC2652P chip

Zigbee module: Ebyte E72-2G4M20S1E:

* DIO_5: 20dBm PA
* DIO_6: 2.4GHz
* DIO_7: LED blink while reporting
* DIO_8: LED connected to coordinator/router
* DIO_9: LED ON if any relay ON
* DIO_30: relay 0
* DIO_29: relay 1
* DIO_28: relay 2
* DIO_27: relay 3
* DIO_26: relay 4
* DIO_12 (RX), DIO_13 (TX): UART to PZEM-004Tv2.0

Endpoints:

* 1: internal temperature, voltage AC, current AC, power AC, energy from PZEM-004Tv2.0
* 2: relay 0, switch 0
* 3: relay 1, switch 1
* 4: relay 2, switch 2
* 5: relay 3, switch 3
* 6: relay 4, switch 4

## Usage in Zigbee2mqtt:

data/configuration.yaml
```c++
...
external_converters:
  - D1ZOnOff.converters.js
...
```
