# Air Quaility Sensor Driver

## Device Model

- [SNL-AIRC-05THEPVF](https://rap.ruff.io/devices/SNL-AIRC-05THEPVF)

## Installation

```sh
> rap device add --model SNL-AIRC-05THEPVF --id <device-id>
```

## Demo

Supposed \<device-id\> is `air-sensor` in the following demos.

```js
$('#air-sensor').readData(function (error, temp, hum, pm1, pm25, pm10, hcho, tvoc, co2) {
    if (error) {
        console.log('error is', error);
        return;
    }

    console.log('温度:', temp, ', 湿度:', hum);
    console.log('PM1.0:', pm1, ', PM2.5:', pm25, ', PM10:', pm10);
    console.log('甲醛:', hcho, ', TVOC:', tvoc, ', CO2:', co2);
});
```

## API References

### Methods

#### `readData(error, temperature, humidity, pm1, pm2_5, pm10, hcho, tvoc, co2)`

| ID | 含义 | 精度 | 单位 |
| --- | --- | --- | --- |
| `temperature` | 温度 | 0.1 | ℃ |
| `humidity` | 湿度 | 0.1 | %RH |
| `pm1` | PM1.0 | 1 | ug/m3 |
| `pm2_5` | PM2.5 | 1 | ug/m3 |
| `pm10` | PM10 | 1 | ug/m3 |
| `hcho` | 甲醛 | 0.001 | mg/m3 |
| `tvoc` | 可挥发性有机物 | 0.001 | mg/m3 |
| `co2` | 二氧化碳 | 1 | ppm |

## Supported OS

Test passed on Ruff v1.11.13

## Note

1. You can buy this sensor device in [taobao](https://item.taobao.com/item.htm?_u=d5bdce6a197&id=575238278514)
2. This device supposes Modbus-RTU protocol via RS485 or TTL interfaces. This driver is only for UART TTL interface.
