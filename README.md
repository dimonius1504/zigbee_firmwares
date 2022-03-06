# zigbee_firmwares
Firmwares for CC2652P chip

Zigbee module: Ebyte E72-2G4M20S1E:

* DIO_5: 20dBm PA
* DIO_6: 2.4GHz
* DIO_7: LED action
* DIO_8: LED connected to net
* DIO_9: LED relay 0 ON/OFF (test)
* DIO_30: relay endpoint 2
* DIO_29: relay endpoint 3
* DIO_28: relay endpoint 4
* DIO_27: relay endpoint 5
* DIO_26: relay endpoint 6
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
