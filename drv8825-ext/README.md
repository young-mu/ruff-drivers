# Step Motor Extension Board Driver

This driver is for two-way step motor driver extension board based on drv8825.

## Device Model

- [drv8825-ext](https://rap.ruff.io/devices/drv8825-ext)

## Install

```sh
> rap device add --model drv8825-ext --id <device-id> 
```

## Demo

Supposed \<device-id\> is `motor` in the following demo.

```js
// control step motor A to rotate forward at 60 rpm speed.
$('#motor').forwardRotateA(60);

// stop step motor rotation
$('#motor').stopRotateA();
```

## API References

### Methods

#### `forwardRotateA(rpm[, callback])`

Control Step Motor A to rotate forward, the rpm (Round Per Minute) range is [40, 300].

#### `forwardRotateB(rpm[, callback])`

Control Step Motor B to rotate forward, the rpm (Round Per Minute) range is [40, 300].

#### `backwardRotateA(rpm[, callback])`

Control Step Motor A to rotate backward, the rpm (Round Per Minute) range is [40, 300].

#### `backwardRotateB(rpm[, callback])`

Control Step Motor B to rotate backward, the rpm (Round Per Minute) range is [40, 300].

#### `stopRotateA([callback])`

Control Step Motor A to stop rotate.

#### `stopRotateB([callback])`

Control Step Motor B to stop rotate.

## Supported OS

Test passed on Ruff Lite v0.8.0

## Note

### About rpm value

If `rpm` is less than 40, the step motor will vibrate with much noise. If `rpm` is more than 300, the step motor driver chip will be very hot. If parameter `rpm` is out of such range, the function will fail to execute.

### About power supply

You should provide external **24V** power supplier to this board.