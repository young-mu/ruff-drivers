# Motor Encoder Driver

The MG513-30 DC motor encdoer with QEI interface.

## Device Model

- [mg513-30](https://rap.ruff.io/devices/mg513-30)

## Install

```sh
> rap device add --model mg513-30 --id <device-id>
```

## Demo

Supposed \<device-id\> is `encoder` in the following demos.

```js
$('#encoder').getRpm(function (error, rpm) {
});
```

## API References

### Properties

#### `ppr`

A number indicates the pulse number generated per round of the DC motor. This value is read only.

### Methods

#### `getRpm(callback)`

Get rotate speed of DC motor. The unit is rpm (round per minute).

The parameters of callback are (error, value), in which value is rpm.
