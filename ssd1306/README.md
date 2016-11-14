# OLED Display Panel Ruff Driver

- [ssd1306](https://rap.ruff.io/devices/ssd1306)

## Installation

```sh
> rap device add <device-id>
> ? model: (<device-id>) ssd1306
```

## Usage

```js
$('#<device-id>').print(0, 0, 'Hello, Ruff', true);
```

<div align="center">    
<img src="https://raw.githubusercontent.com/young-mu/ruff-drivers/master/ssd1306/demos//demo_1.jpg" width = "100" height = "45" alt="DEMO_1" />
</div>

<div align="center">    
<img src="https://raw.githubusercontent.com/young-mu/ruff-drivers/master/ssd1306/demos//demo_2.jpg" width = "100" height = "45" alt="DEMO_2" />
</div>

## API Reference

### Methods

#### `clear()`

#### `print(xPosition, yPosition, string, isBigChar)`

#### `printZh(xPosition, yPosition, string)`

## License

MIT
