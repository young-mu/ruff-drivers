# AQI module Driver for Ruff

Air Quality Index (PM2.5 and PM10) Module with UART interface

## Model

- [sds011](https://rap.ruff.io/devices/sds011)

## Installation

```sh
> rap device add <device-id>
> ? model: (<device-id>) sds011
```

## Usage

```js
$('#<device-id>').on('aqi', function (error, pm25, pm10) {
    // your code
});
```

## API Reference

### Events

#### `on('aqi', callback)`

Get PM2.5 and PM10.

The parameters of callback are (error, pm25, pm10), in which pm25 and pm10 are PM2.5 and PM10 value respectively.

## License

MIT
