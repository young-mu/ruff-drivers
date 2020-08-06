'use strict';

var Level = require('gpio').Level;
var driver = require('ruff-driver');

module.exports = driver({

    attach: function (inputs, context) {
        var that = this;
        this._gpio = inputs['gpio'];
        this._gpio.write(Level.low);
    },

    exports: {
        ring: function () {
            this._gpio.write(Level.high);
            setTimeout(function () {
                this._gpio.write(Level.low);
            }, 1000);
        }
    }

});
