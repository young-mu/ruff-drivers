# Ultrasound Distance Sensor Ruff Driver

## Device

- [us-100](https://rap.ruff.io/devices/us-100)

## Installation

```sh
> rap device add <device-id>
> ? model: (<device-id>) us-100
```

## Demo

Supposed \<device-id\> is **dist** in the following demos.ß

```js
$('#dist').getDistance(function (error, distance) {
	console.log('distance: ' + distance);
});
```

<div align="center">
<img src="https://raw.githubusercontent.com/young-mu/ruff-drivers/master/us-100/res/demo.jpg" width = "100" height = "100" alt="DEMO_CHAR" />
</div>

## API Reference

### Methods

#### `getDistance(callback)`

Get the distance of obstacle and sensor. 

The callback parameters are `error` and `distance`. The `distance` unit is millimeter (mm.) and its effective range is from 20 to 4500.

If the sensor fails to transmit wave or fails to get the echo, the distance will be an invalid value, usually more than 10000. 

#### `getTemperature(callback)`

Get the temperature of sensor environment.

The callback parameters are `error` and `temperature`. The `temperature` unit is Celsius degree (°C).

The ultrasound distance sensor provides such function for temperature compensation in the cold or hot environment. You can easily ignore it if you are in a room temperature environment.