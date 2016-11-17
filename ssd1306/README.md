# OLED Display Panel Ruff Driver

## Device

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
<img src="https://raw.githubusercontent.com/young-mu/ruff-drivers/master/ssd1306/res/demo_1.jpg" width = "500" height = "245" alt="DEMO_1" />
</div>

<div align="center">    
<img src="https://raw.githubusercontent.com/young-mu/ruff-drivers/master/ssd1306/res/demo_2.jpg" width = "500" height = "345" alt="DEMO_2" />
</div>

## API Reference

### Methods

#### `clear()`

Clear the OLED panel. After calling clear() function, the panel will be black.

#### `print(x, y, string[, isBigChar])`

Print a *string* on panel coordinate (*x*, *y*).

The xPosition range [0, 127], the yPosition range is [

If parameter *isBigChar* is true, the character is 8x16 size (8-dot width by 16-dot height). If it is false, the charactor is 6x8 size (6-dot width by 8-dot height). **It's false by default.**

#### `printZh(x, y, string)`

Print a Chinese *string* on panel coordinate (*x*, *y*). One Chinese character size is 32x32 (32-dot width by 32-dot height).

## Note

One 0.96-inch OLED display panel size is 128x64 (128-dot width by 64-dot height) as shown in figure below.

<div align="center">    
<img src="https://raw.githubusercontent.com/young-mu/ruff-drivers/master/ssd1306/res/note.png" width = "500" height = "274" alt="NOTE" />
</div>

The *x* range is [0, 127] and its interval is 1 dot. The *y* range is [0, 7] and its interval is 8 dots. For example, The upper-left coordinate is (0, 0) and the lower-right coordinate is (127, 7).

There are three types characters. Their names and sizes are listed by the following chart.

Type  | Size (width x height)
:-------------: | :-------------:
Big Character | 8 x 16
Little Character | 6 x 8
Chinese Character | 16 x 16

> Now Chinese Character is not fully supported due to lack of font library.
