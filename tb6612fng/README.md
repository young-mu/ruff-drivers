# DC motor controller Driver

Two-way DC motor controller with PWM and GPIO interface

## Device Model

- [tb6612fng](https://rap.ruff.io/devices/tb6612fng)

## Install

```sh
> rap device add --model tb6612fng --id <device-id>
```

## Usage

Supposed \<device-id\> is `motor` in the following demos.

```js
$('#motor').forwardRotateA(0.5);
$('#motor').forwardRotateB(0.5);

$('#motor').backwardRotateA(0.5);
$('#motor').backwardRotateB(0.5);

$('#motor').stopRotateA();
$('#motor').stopRotateB();
```

## API References

### Methods

#### `forwardRotateA(value[, callback])`

Control DC motor A to rotate forward, the value range is [0, 1], the more the value is, the faster the motor rotates.

#### `forwardRotateB(value[, callback])`

Control DC motor B to rotate forward, the value range is [0, 1], the more the value is, the faster the motor rotates.

#### `backwardRotateA(value[, callback])`

Control DC motor A to rotate backward, the value range is [0, 1], the more the value is, the faster the motor rotates.

#### `backwardRotateB(value[, callback])`

Control DC motor B to rotate backward, the value range is [0, 1], the more the value is, the faster the motor rotates.

#### `stopRotateA([callback])`

Control DC motor A to stop rotate.

#### `stopRotateB([callback])`

Control DC motor B to stop rotate.

## Note

### Power supply

The more the power supply to VM pin is, the faster the motor rotates, if the rotation parameter is set as the maximum value (1).

You'd better provide external **12V** power supplier to VM pin (vcc-3) and GND pin (gnd-3).
