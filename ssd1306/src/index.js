'use strict';

var driver = require('ruff-driver');

var OLED_CMD = 0x00;
var OLED_DATA = 0x40;

function oled_init (obj) {
    // turn off oled panel
    obj._i2c.writeByte(OLED_CMD, 0xAE);

    // set display clock as 100 fps
    obj._i2c.writeByte(OLED_CMD, 0xD5);
    obj._i2c.writeByte(OLED_CMD, 0x80);

    // set multiplex lines as 64
    obj._i2c.writeByte(OLED_CMD, 0xA8);
    obj._i2c.writeByte(OLED_CMD, 0x3F);

    // set display no offset
    obj._i2c.writeByte(OLED_CMD, 0xD3);
    obj._i2c.writeByte(OLED_CMD, 0x00);

    // set display start line
    obj._i2c.writeByte(OLED_CMD, 0x40);

    // enable charge pump
    obj._i2c.writeByte(OLED_CMD, 0x8d);
    obj._i2c.writeByte(OLED_CMD, 0x14);

    // set page addressing mode
    obj._i2c.writeByte(OLED_CMD, 0x20);
    obj._i2c.writeByte(OLED_CMD, 0x02);

    // set normal segment/column mapping
    obj._i2c.writeByte(OLED_CMD, 0xA1);

    // set normal column/row direction
    obj._i2c.writeByte(OLED_CMD, 0xC8);

    // set column pins hw configuration
    obj._i2c.writeByte(OLED_CMD, 0xDA);
    obj._i2c.writeByte(OLED_CMD, 0x12);

    // set contrast brightness as 200
    obj._i2c.writeByte(OLED_CMD, 0x81);
    obj._i2c.writeByte(OLED_CMD, 0xC8);

    // set pre-charge period as 15 to 1
    obj._i2c.writeByte(OLED_CMD, 0xD9);
    obj._i2c.writeByte(OLED_CMD, 0xF1);

    // set VCOMH
    obj._i2c.writeByte(OLED_CMD, 0xDB);
    obj._i2c.writeByte(OLED_CMD, 0x40);

    // enable full display (disable 0xA5)
    obj._i2c.writeByte(OLED_CMD, 0xA4);

    // enable normal display (disable 0xA5)
    obj._i2c.writeByte(OLED_CMD, 0xA6);

    // turn on oled panel
    obj._i2c.writeByte(OLED_CMD, 0xAF);
}

function setXY (xPos, yPos) {
    var xPosH = (0xF0 & xPos) >> 4;
    var xPosL = (0x0F & xPos);

    // row address base 0xB0
    this._i2c.writeByte(OLED_CMD, 0xB0 | yPos);

    // high and low column address base 0x10 and 0x00
    this._i2c.writeByte(OLED_CMD, xPosH | 0x10);
    this._i2c.writeByte(OLED_CMD, xPosL);
}

function print (data) {
    this._i2c.writeByte(OLED_DATA, data);
}

function clear () {
    this.setXY(0, 0);
    for (var yPos = 0; yPos < 8; yPos++) {
        this.setXY(0, yPos);
        for (var xPos = 0; xPos < 128; xPos++) {
            this.print(0x0);
        }
    }
}

var prototype = {
    setXY: setXY,
    print: print,
    clear: clear
};

module.exports = driver({
    attach: function (inputs, context) {
        this._i2c = inputs['i2c'];
        oled_init(this);
        this.clear();
        this.setXY(0, 0);
    },
    exports: prototype
});
