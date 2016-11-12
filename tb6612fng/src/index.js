'use strict';

var Level = require('gpio').Level;
var driver = require('ruff-driver');

module.exports = driver({

    attach: function (inputs) {
        this._pwmA = inputs['pwm-A'];
        this._gpioA1 = inputs['gpio-A1'];
        this._gpioA2 = inputs['gpio-A2'];

        this._pwmB = inputs['pwm-B'];
        this._gpioB1 = inputs['gpio-B1'];
        this._gpioB2 = inputs['gpio-B2'];
    },

    exports: {
        forwardRotateA: function (value, callback) {
            this._gpioA1.write(Level.high);
            this._gpioA2.write(Level.low);
            this._pwmA.setDuty(value);

            callback && callback(undefined);
        },
        forwardRotateB: function (value, callback) {
            this._gpioB1.write(Level.high);
            this._gpioB2.write(Level.low);
            this._pwmB.setDuty(value);

            callback && callback(undefined);
        },

        backwardRotateA: function (value, callback) {
            this._gpioA1.write(Level.low);
            this._gpioA2.write(Level.high);
            this._pwmA.setDuty(value);

            callback && callback(undefined);
        },
        backwardRotateB: function (value, callback) {
            this._gpioB1.write(Level.low);
            this._gpioB2.write(Level.high);
            this._pwmB.setDuty(value);

            callback && callback(undefined);
        },

        stopRotateA: function (callback) {
            this._gpioA1.write(Level.low);
            this._gpioA2.write(Level.low);
            this._pwmA.setDuty(0);

            callback && callback(undefined);
        },
        stopRotateB: function (callback) {
            this._gpioB1.write(Level.low);
            this._gpioB2.write(Level.low);
            this._pwmB.setDuty(0);

            callback && callback(undefined);
        }
    }

});
