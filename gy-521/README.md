# GY-521 Driver for Ruff

6-axis gyroscope module using MPU6050 with I2C interface

## Supported Engines

* Ruff MCU

## Supported Models

- [gy-521](https://rap.ruff.io/devices/gy-521)

## Installing

Execute following command and enter a **supported model** to install.

```sh
# Please replace `<device-id>` with a proper ID.
# And this will be what you are going to query while `$('#<device-id>')`.
rap device add <device-id>

# Then enter a supported model, for example:
# ? model: gy-521
# ? value (number) for argument "accelRange": 2
# ? value (number) for argument "gyroRange": 250
```

### Arguments

#### `accelRange`

A number indicates range of acceleration value. It can be 2, 4, 8 or 16 only. The default value is 2.

#### `gyroRange`

A number indicates range of acceleration value. It can be 250, 500, 1000 or 2000 only. The default value is 250.

## Usage

Here is the usage of this driver.

```js
$('#<device-id>').getAcceleration(function (error, accel)) {
	var accelX = accel[0];
	var accelY = accel[1];
	var accelZ = accel[2];
});
$('#<device-id>').getAccelerationX(function (error, accelX)) {
});
$('#<device-id>').getAccelerationY(function (error, accelY)) {
});
$('#<device-id>').getAccelerationZ(function (error, accelZ)) {
});

$('#<device-id>').getGyroscope(function (error, gyro)) {
	var gyroX = gyro[0];
	var gyroY = gyro[1];
	var gyroZ = gyro[2];
});
$('#<device-id>').getGyroscopeX(function (error, gyroX)) {
});
$('#<device-id>').getGyroscopeY(function (error, gyroY)) {
});
$('#<device-id>').getGyroscopeZ(function (error, gyroZ)) {
});

$('#<device-id>').getAngleX(function (error, angleX)) {
});
$('#<device-id>').getAngleY(function (error, angleY)) {
});

setInterval(function() {
	$('#<device-id>').getFusedMotionX(cycle, function (error, angle, gyro)) {
	});
}, cycle);

setInterval(function() {
	$('#<device-id>').getFusedMotionY(cycle, function (error, angle, gyro)) {
	});
}, cycle);

$('#<device-id>').getTemperature(function (error, temp)) {
});
```

## API References

### Properties

#### `accelRange`

A number indicates range of acceleration value, which can be 2, 4, 8 or 16.

#### `gyroRange`

A number indicates range of acceleration value, which can be 250, 500, 1000 or 2000.

### Methods

#### `getAcceleration(callback)`

Get 3-axis acceleration.

The parameters of callback are (error, value), in which value is a 3-element arary, holding X-axis, Y-axis and Z-axis acceleration value respectively.

#### `getAccelerationX(callback)`

Get X-axis acceleration.

The parameters of callback are (error, value), in which value is X-axis acceleration value.

#### `getAccelerationY(callback)`

Get Y-axis acceleration.

The parameters of callback are (error, value), in which value is Y-axis acceleration value.

#### `getAccelerationZ(callback)`

Get Z-axis acceleration.

The parameters of callback are (error, value), in which value is Z-axis acceleration value.

#### `getGyroscope(callback)`

Get 3-axis gyroscopes (angular speed).

The parameters of callback are (error, value), in which value is a 3-element arary, holding X-axis, Y-axis and Z-axis gyroscope value respectively.

#### `getGyroscopeX(callback)`

Get X-axis gyroscope.

The parameters of callback are (error, value), in which value is X-axis gyroscope value.

#### `getGyroscopeY(callback)`

Get Y-axis gyroscope.

The parameters of callback are (error, value), in which value is Y-axis gyroscope value.

#### `getGyroscopeZ(callback)`

Get Z-axis gyroscope.

The parameters of callback are (error, value), in which value is Z-axis gyroscope value.

#### `getAngleX(callback)`

Get X-axis angle. The angle is computed by Z-axis acceleration (gravitational acceleration).

The parameters of callback are (error, value), in which value is X-axis angle value.

#### `getAngleY(callback)`

Get Y-axis angle. The angle is computed by Z-axis acceleration (gravitational acceleration).

The parameters of callback are (error, value), in which value is Y-axis angle value.

#### `getFusedMotionX(cycle, callback)`

Get X-axis angle and gyroscope around X axis each cycle. The angle is computed by Z-axis acceleration (gravitational acceleration) and integration of gyroscope around X axis.

The parameters of callback are (error, value1, value2), in which value1 is X-axis angle value and value2 is gyroscope around X axis.

#### `getFusedMotionY(cycle, callback)`

Get Y-axis angle and gyroscope around Y axis each cycle. The angle is computed by Z-axis acceleration (gravitational acceleration) and integration of gyroscope around Y axis.

The parameters of callback are (error, value1, value2), in which value1 is Y-axis angle value and value2 is gyroscope around Y axis.

#### `getTemperature(callback)`

Get the inner temperature inside module.

The parameters of callback are (error, value), in which value is temperature value.

## License

MIT
