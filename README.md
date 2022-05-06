# zigbee_firmwares
Firmwares for CC2652P chip

Zigbee module: Ebyte E72-2G4M20S1E:

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

Endpoints:

* 1: internal temperature, voltage AC, current AC, power AC, energy from PZEM-004Tv2.0
* 2: relay 0, switch 0
* 3: relay 1, switch 1
* 4: relay 2, switch 2
* 5: relay 3, switch 3
* 6: relay 4, switch 4

Issues:
* no switches support
* wrong energy consumption multiplier in z2m converter

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
![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/IMG_20220501_210825.jpg?raw=true)
![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/IMG_20220506_210419.jpg?raw=true)
![alt text](https://github.com/dimonius1504/zigbee_firmwares/blob/main/img/IMG_20220506_210812.jpg?raw=true)
