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
    //console.log('rpm (' + rpm + ') => frequency (' + freq + ')');
    return freq;
};

var getCount = function (angle) {
    var count = angle / stepAngle * microStep;
    //console.log('angle (' + angle + ') => count (' + count + ')');
    return count;
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
                console.log('rpm should be in [' + minRpm + ', ' + maxRpm + ']');
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
                console.log('rpm should be in [' + minRpm + ', ' + maxRpm + ']');
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
                console.log('rpm should be in [' + minRpm + ', ' + maxRpm + ']');
                callback && callback(new Error('invalid rpm'));
                return;
            }

            var freq = getFrequency(rpm);
            this._pwmA.setFrequency(freq);
            this._directionA.write(Level.low);
            this._enableA.write(Level.low);

            callback && callback(undefined);
        },
        backwardRotateB: function (rpm, callback) {
            if (rpm > maxRpm || rpm < minRpm) {
                console.log('rpm should be in [' + minRpm + ', ' + maxRpm + ']');
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
        },

        forwardAngleA: function (angle, callback) {
            var count = getCount(angle);
            this._pwmA.setCount(count);
            this._directionA.write(Level.high);
            this._enableA.write(Level.low);

            callback && callback(undefined);
        },
        forwardAngleB: function (angle, callback) {
            var count = getCount(angle);
            this._pwmB.setCount(count);
            this._directionB.write(Level.high);
            this._enableB.write(Level.low);

            callback && callback(undefined);
        },

        backwardAngleA: function (angle, callback) {
            var count = getCount(angle);
            this._pwmA.setCount(count);
            this._directionA.write(Level.low);
            this._enableA.write(Level.low);

            callback && callback(undefined);
        },
        backwardAngleB: function (angle, callback) {
            var count = getCount(angle);
            this._pwmB.setCount(count);
            this._directionB.write(Level.low);
            this._enableB.write(Level.low);

            callback && callback(undefined);
        },
    }

});
