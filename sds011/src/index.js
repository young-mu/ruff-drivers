'use strict';

var driver = require('ruff-driver');
var ReadStreaming = require('./read-streaming');

var head = parseInt('AA', 16);
var command = parseInt('C0', 16);
var tail = parseInt('AB', 16);

module.exports = driver({

    attach: function (inputs) {
        var that = this;
        this._uart = inputs['uart'];
        this._chunk = Buffer.alloc(0);

        this._readStream = new ReadStreaming(this._uart);
        this._readStream.on('data', parser);
        this._readStream.on('error', function () {
            throw new Error('UART is crashed');
        });
        this._readStream.start();

        function parser (data) {
            if (that._chunk.length < 10) {
                that._chunk = Buffer.concat([that._chunk, data]);
                return;
            }

            var frame = that._chunk.slice(0, 10);
            that._chunk = that._chunk.slice(10, that._chunk.length);

            // invalid frame
            if (frame[0] !== head || frame[1] !== command || frame[9] !== tail) {
                return;
            }

            var checkSum = 0;
            for (var i = 2; i <= 7; i++) {
                checkSum += frame[i];
            }
            checkSum %= 256;

            // invalid checkSum
            if (frame[8] !== checkSum) {
                return;
            }

            var pm25_L = frame[2];
            var pm25_H = frame[3];
            var pm10_L = frame[4];
            var pm10_H = frame[5];

            var pm25 = (pm25_H * 16 + pm25_L) / 10;
            var pm10 = (pm10_H * 16 + pm10_L) / 10;

            that.emit('aqi', undefined, pm25.toFixed(0), pm10.toFixed(0));
        }
    },

    exports: {
        // nothing to do
    }
});

