# DC motor controller Driver for Ruff

Two-way DC motor controller with PWM and GPIO interface

## Supported Engines

* Ruff MCU

## Supported Models

- [tb6612fng](https://rap.ruff.io/devices/tb6612fng)

## Installing

Execute following command and enter a **supported model** to install.

```sh
# Please replace `<device-id>` with a proper ID.
# And this will be what you are going to query while `$('#<device-id>')`.
rap device add <device-id>

# Then enter a supported model, for example:
# ? model: tb6612fng
```

## Usage

Here is the usage of this driver.

```js
$('#<device-id>').forwardRotateA(0.5);
$('#<device-id>').forwardRotateB(0.5);

$('#<device-id>').backwardRotateA(0.5);
$('#<device-id>').backwardRotateB(0.5);

$('#<device-id>').stopRotateA();
$('#<device-id>').stopRotateB();
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

## License

MIT