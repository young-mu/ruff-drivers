# Rain Sensor Driver

## Device Model

- [ZH-RAIN-RS485](https://rap.ruff.io/devices/ZH-RAIN-RS485)

## Install

```sh
> rap device add --model ZH-RAIN-RS485 --id <device-id>
```

## Demo

Supposed \<device-id\> is `rain` in the following demos.

```js
$('#rain').readRain(function (error, hasRain) {
    if (error) {
        console.log('error is', error);
        return;
    }

    if (hasRain) {
        console.log('has rain');
    } else {
        console.log('no rain');
    }
});
```

## API References

### Methods

#### `readRain(callback(error, hasRain))`

Read if there is rain or not, `hasRain = 1` means rain, `hasRain = 0` means no rain.

#### `readHeat(callback(error, heatStart, heatEnd))`

Read the heat to start and heat to end, the range of them is [0, 40}.

#### `changeHeatStart(value, callback(error))`

Change the value of heat to start, it must be lower than heat to end.

#### `changeHeatEnd(value, callback(error))`

Change the value of heat to end, it must be higher than heat to start.

## Supported OS

Test passed on Ruff v1.11.3

## Note

Needs a TTL-RS485 conveter
