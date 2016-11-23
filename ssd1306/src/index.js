'use strict';

var driver = require('ruff-driver');
var bc = require('./bc.js');
var lc = require('./lc.js');
var zh = require('./zh.js');
var qrcode = require('./qrcode.js');

var OLED_CMD = 0x00;
var OLED_DATA = 0x40;

var OLED_WIDTH = 128;
var OLED_HEIGHT = 8;

function oledInit (obj) {
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

function clear (isReverse) {
    isReverse = (isReverse === undefined ? false : isReverse);
    this.setXY(0, 0);
    for (var yPos = 0; yPos < OLED_HEIGHT; yPos++) {
        this.setXY(0, yPos);
        for (var xPos = 0; xPos < OLED_WIDTH; xPos++) {
            this._i2c.writeByte(OLED_DATA, isReverse === true ? 0xFF : 0x00);
        }
    }
}

function printChar (that, xPos, yPos, char, isLittleChar) {
    if (isLittleChar) {
        that.setXY(xPos, yPos);
        lc.table[char].slice(0, lc.length).forEach(function (e) {
            that._i2c.writeByte(OLED_DATA, e);
        });
    } else {
        that.setXY(xPos, yPos);
        bc.table[char].slice(0, bc.length / 2).forEach(function (e) {
            that._i2c.writeByte(OLED_DATA, e);
        });
        that.setXY(xPos, yPos + 1);
        bc.table[char].slice(bc.length/ 2, bc.length).forEach(function (e) {
            that._i2c.writeByte(OLED_DATA, e);
        });
    }
}

function print (xPos, yPos, string, isLittleChar) {
    var that = this;
    isLittleChar = (isLittleChar === undefined ? false : isLittleChar);
    string.split('').forEach(function (e) {
        printChar(that, xPos, yPos, e, isLittleChar);
        xPos += (isLittleChar ? lc.width : bc.width);
    });
}

function printZhChar (that, xPos, yPos, char) {
    that.setXY(xPos, yPos);
    zh.table[char].slice(0, zh.length / 2).forEach(function (e) {
        that._i2c.writeByte(OLED_DATA, e);
    });
    that.setXY(xPos, yPos + 1);
    zh.table[char].slice(zh.length / 2, zh.length).forEach(function (e) {
        that._i2c.writeByte(OLED_DATA, e);
    });
}

function printZh (xPos, yPos, string) {
    var that = this;
    string.split('').forEach(function (e) {
        printZhChar(that, xPos, yPos, e);
        xPos += zh.width;
    });
}

function printQrcode (isReverse) {
    var that = this;
    var xPos, yPos;

    if (isReverse) {
        that.clear(true);
        that.setXY(qrcode.startX, qrcode.startY);
        for (yPos = 0; yPos < Math.ceil(qrcode.height / 8); yPos++) {
            that.setXY(qrcode.startX, qrcode.startY + yPos);
            for (xPos = 0; xPos < qrcode.width; xPos++) {
                that._i2c.writeByte(OLED_DATA, 0xFF - qrcode.qrcode[xPos + yPos * qrcode.width]);
            }
        }
    } else {
        that.clear();
        that.setXY(qrcode.startX, qrcode.startY);
        for (yPos = 0; yPos < Math.ceil(qrcode.height / 8); yPos++) {
            that.setXY(qrcode.startX, qrcode.startY + yPos);
            for (xPos = 0; xPos < qrcode.width; xPos++) {
                that._i2c.writeByte(OLED_DATA, qrcode.qrcode[xPos + yPos * qrcode.width]);
            }
        }
    }
}

var prototype = {
    setXY: setXY,
    clear: clear,
    print: print,
    printZh: printZh,
    printQrcode: printQrcode
};

module.exports = driver({

    attach: function (inputs, context) {
        this._i2c = inputs['i2c'];

        // When i2c writing is intensive, RT5350 will expose an i2c hardware bug,
        // this workaround is avoid it by writing again after first i2c write operation fails.
        var that = this;
        this._i2c._writeByte = this._i2c.writeByte;
        this._i2c.writeByte = function (command, value, callback) {
            try {
                that._i2c._writeByte(command, value, callback);
            } catch (error) {
                console.log('i2c write error occurs, retry ...');
                that._i2c._writeByte(command, value, callback);
            }
        };

        oledInit(this);
        this.clear();
        this.setXY(0, 0);
    },

    exports: prototype

});
