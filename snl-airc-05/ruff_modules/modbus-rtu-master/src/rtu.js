/*!
 * Copyright (c) 2017 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var EventEmitter = require('events');
var util = require('util');
var crc16 = require('./crc16');

function Rtu(timeout) {
    EventEmitter.call(this);

    this._buffer = new Buffer(0);
    this._timeout = timeout || 0;
    this._timer = null;
    this._stop = true;
    this._expectedLength = 0;
}

util.inherits(Rtu, EventEmitter);

Rtu.prototype._setupTimer = function () {
    clearTimeout(this._timer);
    this._timer = setTimeout(this._emit.bind(this), this._timeout);
};

Rtu.prototype._emit = function () {
    var data = this._decode(this._buffer);
    if (data === null) {
        this.emit('errorMessage', 'Invalid checksum');
    } else {
        this.emit('message', data);
    }
    this._buffer = new Buffer(0);
};

Rtu.prototype.encode = function (buffer) {
    var crcValue = crc16(buffer);
    var crcBuffer = new Buffer(2);
    crcBuffer.writeUInt16LE(crcValue, 0);
    return Buffer.concat([buffer, crcBuffer]);
};

Rtu.prototype.try = function (expectedLength) {
    this._stop = false;
    if (this._timer > 0) {
        this._setupTimer();
    }
    this._buffer = new Buffer(0);
    this._expectedLength = expectedLength;
};

Rtu.prototype.pushCodedStream = function (data) {
    if (!this._stop) {
        this._buffer = Buffer.concat([this._buffer, data]);
        if (this._buffer.length >= this._expectedLength) {
            this._buffer = this._buffer.slice(0, this._expectedLength);
            this._findFrame();
        } else if (this._buffer.length === 5) { // addr(1) + FC(1) + exception(1) + crc(2)
            if (this._decode(this._buffer) !== null) {
                this._findFrame();
            }
        }
    }
};

Rtu.prototype._findFrame = function () {
    this._stop = true;
    clearTimeout(this._timer);
    this._emit();
};

Rtu.prototype._decode = function (buffer) {
    if (buffer.length < 2) {
        return null;
    }
    var crcValue = buffer.readUInt16LE(buffer.length - 2);
    var bufferDecoded = buffer.slice(0, buffer.length - 2);
    if (crc16(bufferDecoded) !== crcValue) {
        return null;
    }
    return bufferDecoded;
};

module.exports = Rtu;
