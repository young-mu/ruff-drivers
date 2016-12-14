'use strict';

var Level = require('gpio').Level;
var driver = require('ruff-driver');

var minRpm = 40;
var maxRpm = 300;

var stepAngle = 1.8;
var microStep = 1; // M0/M1/M2 are all LOW level

// ppr (Pulse Per Round) = (360 / stepAngle) * microStep
// rpm (Round Per Minute) = freq * 60 / ppr

var getFrequency = function (rpm) {
    var ppr = 360 / stepAngle * microStep;
    var freq = rpm * ppr / 60;
    return freq;
};

module.exports = driver({

    attach: function (inputs, context) {
        this._pwmA = inputs['pwm-A'];
        this._directionA = inputs['direction-A'];
        this._enableA = inputs['enable-A'];

        this._pwmB = inputs['pwm-B'];
        this._directionB = inputs['direction-B'];
        this._enableB = inputs['enable-B'];

        this._enableA.write(Level.high);
        this._enableB.write(Level.high);
    },

    exports: {
        forwardRotateA: function (rpm, callback) {
            if (rpm > maxRpm || rpm < minRpm) {
                console.log('rpm should NOT be more than 300');
                callback && callback(new Error('invalid rpm'));
                return;
            }

            var freq = getFrequency(rpm);
            this._pwmA.setFrequency(freq);
            this._directionA.write(Level.high);
            this._enableA.write(Level.low);

            callback && callback(undefined);
        },
        forwardRotateB: function (rpm, callback) {
            if (rpm > maxRpm || rpm < minRpm) {
                console.log('rpm should NOT be more than 300');
                callback && callback(new Error('invalid rpm'));
                return;
            }

            var freq = getFrequency(rpm);
            this._pwmB.setFrequency(freq);
            this._directionB.write(Level.high);
            this._enableB.write(Level.low);

            callback && callback(undefined);
        },

        backwardRotateA: function (rpm, callback) {
            if (rpm > maxRpm || rpm < minRpm) {
                console.log('rpm should NOT be more than 300');
                callback && callback(new Error('invalid rpm'));
                return;
            }

            var freq = getFrequency(rpm);
            this._pwmA.setFrequency(rpm);
            this._directionA.write(Level.low);
            this._enableA.write(Level.low);

            callback && callback(undefined);
        },
        backwardRotateB: function (rpm, callback) {
            if (rpm > maxRpm || rpm < minRpm) {
                console.log('rpm should NOT be more than 300');
                callback && callback(new Error('invalid rpm'));
                return;
            }

            var freq = getFrequency(rpm);
            this._pwmB.setFrequency(freq);
            this._directionB.write(Level.low);
            this._enableB.write(Level.low);

            callback && callback(undefined);
        },

        stopRotateA: function (callback) {
            this._enableA.write(Level.high);

            callback && callback(undefined);
        },
        stopRotateB: function (callback) {
            this._enableB.write(Level.high);

            callback && callback(undefined);
        }
    }

});
