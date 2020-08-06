'use strict';

var driver = require('ruff-driver');
var ModbusRtuMaster = require('modbus-rtu-master');

module.exports = driver({
    attach: function (inputs, context) {
        this._uart = inputs['uart'];
        this.modbus = new ModbusRtuMaster(this._uart);
        this.slaveAddress = 0x1;
        this.rainAddress = 0x0;
        this.heatStartAddress = 0xc0;
        this.heatEndAddress = 0xc1;

        this.heatStart = 0;
        this.heatEnd = 40;
    },

    exports: {
        readRain: function (callback) {
            this.modbus.readHoldingRegisters(this.slaveAddress, this.rainAddress, 1,
                function (error, values) {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback(undefined, values[0]);
                }
            );
        },

        readHeat: function (callback) {
            var that = this;
            this.modbus.readHoldingRegisters(this.slaveAddress, this.heatStartAddress, 2,
                function (error, values) {
                    if (error) {
                        callback(error);
                        return;
                    }

                    var heatStart = values[0] / 10;
                    var heatEnd = values[1] / 10;
                    that.heatStart = heatStart;
                    that.heatEnd = heatEnd;

                    callback(undefined, heatStart, heatEnd);
                }
            );
        },

        // Note: call readHeat first before call the following two functions

        changeHeatStart: function (value, callback) {
            if (value >= this.heatEnd) {
                callback(new Error('invalid value'));
                return;
            }

            var that = this;
            this.modbus.writeMultipleRegisters(this.slaveAddress, this.heatStartAddress, [value * 10],
                function (error, quantity) {
                    if (error) {
                        callback(error);
                        return;
                    }

                    that.heatStart = value;
                    callback(undefined);
                }
            );
        },

        changeHeatEnd: function (value, callback) {
            if (value <= this.heatStart) {
                callback(new Error('invalid value'));
                return;
            }

            var that = this;
            this.modbus.writeMultipleRegisters(this.slaveAddress, this.heatEndAddress, [value * 10],
                function (error, quantity) {
                    if (error) {
                        callback(error);
                        return;
                    }

                    that.heatEnd = value;
                    callback(undefined);
                }
            );
        }
    }
});
