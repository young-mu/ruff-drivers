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

You should supply **12V** power to the Ruff board (ruff-mbd-v1). If you can just supply 5V power, you should connect VM pin (vcc-3) on the tb6612fng chip to 5V pin (vdd-8/vdd-9/vdd-10/vdd-11) on the Ruff board (ruff-mbd-v1).
