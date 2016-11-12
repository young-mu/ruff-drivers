# MG513-30 encoder Driver for Ruff

The MG513-30 DC motor encdoer with QEI interface.

## Supported Engines

* Ruff MCU

## Supported Models

- [mg513-30](https://rap.ruff.io/devices/mg513-30)

## Installing

Execute following command and enter a **supported model** to install.

```sh
# Please replace `<device-id>` with a proper ID.
# And this will be what you are going to query while `$('#<device-id>')`.
rap device add <device-id>

# Then enter a supported model, for example:
# ? model: mg513-30
```

## Usage

Here is the usage of this driver.

```js
$('#<device-id>').getRpm(function (error, rpm)) {
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

## License

MIT
