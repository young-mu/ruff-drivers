# OLED Display Panel Ruff Driver For MCU

> [ssd1306-lite](https://rap.ruff.io/raps/ssd1306-lite) is a small-version (or subset) of [ssd1306](https://rap.ruff.io/raps/ssd1306) driver due to **lack of memory on MCU embedded devices**.

## Device

- [ssd1306](https://rap.ruff.io/devices/ssd1306)

## Installation

```sh
> rap device add <device-id>
> ? model: (<device-id>) ssd1306-lite
```

## Usage

```js
$('#<device-id>').print(0, 0, 'Hello, Ruff');
```

## API Reference

### Methods

#### `clear()`

Clear the OLED panel. After calling clear() function, the panel will be black.

#### `print(x, y, string)`

Print a *string* on panel coordinate (*x*, *y*).

The xPosition range [0, 127], the yPosition range is [0, 7].

## Note

One 0.96-inch OLED display panel size is 128x64 (128-dot width by 64-dot height) as shown in figure below.

<div align="center">    
<img src="https://raw.githubusercontent.com/young-mu/ruff-drivers/master/ssd1306/res/note.png" width = "500" height = "274" alt="NOTE" />
</div>

The *x* range is [0, 127] and its interval is 1 dot. The *y* range is [0, 7] and its interval is 8 dots. For example, The upper-left coordinate is (0, 0) and the lower-right coordinate is (127, 7).

There is only one character supported on ssd1306-lite. Its name and size are listed by the following table.

Type  | Size (width x height)
:-------------: | :-------------:
Big Character | 8 x 16