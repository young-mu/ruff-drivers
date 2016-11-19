'use strict';

var driver = require('ruff-driver');

var distanceCommand = new Buffer([0x55]);
var temperatureCommand = new Buffer([0x50]);
var temperatureBase = 45;

module.exports = driver({

    attach: function (inputs) {
        this._uart = inputs['uart'];
    },

    exports: {

        getDistance: function (callback) {
            this._uart.write(distanceCommand);
            this._uart.read(function (error, data) {
                if (error) {
                    callback(error);
                    return;
                }

                if (data.length !== 2) {
                    callback(new Error('Invalid distance data length ' + data.length));
                }

                var distanceH = data[0];
                var distanceL = data[1];

                var distance = distanceH * 256 + distanceL;
                callback(undefined, distance);
            });
        },

        getTemperature: function (callback) {
            this._uart.write(temperatureCommand);
            this._uart.read(function (error, data) {
                if (error) {
                    callback(error);
                    return;
                }

                if (data.length !== 1) {
                    callback(new Error('Invalid temperature data length ' + data.length));
                }

                var temperature = data[0] - temperatureBase;
                callback(undefined, temperature);
            });
        }

    }
});
