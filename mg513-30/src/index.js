'use strict';

var driver = require('ruff-driver');

var prototype = {
    getRpm: function (callback) {
        var that = this;
        this._qei.getVelocity(function (error, velocity) {
            that._qei.getDirection(function (error, direction) {
                var rpm = direction * velocity * 60 / that._ppr;
                callback(undefined, rpm);
            });
        });
    }
};

Object.defineProperties(prototype, {
    ppr: {
        get: function () {
            return this._ppr;
        }
    }
});

module.exports = driver({
    attach: function (inputs, context) {
        this._qei = inputs['qei'];
        this._ppr = context.args.ppr;
        this._qei.setPPR(context.args.ppr);
    },
    exports: prototype
});
