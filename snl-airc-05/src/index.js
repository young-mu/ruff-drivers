'use strict';

var driver = require('ruff-driver');
var ModbusRtuMaster = require('modbus-rtu-master');

module.exports = driver({
    attach: function (inputs, context) {
        this._uart = inputs['uart'];
        this.modbus = new ModbusRtuMaster(this._uart);
        this.slaveAddress = 0x15;
        this.startAddress = 0x64;
        this.quantity = 0x08;
    },

    // 地址, 内容, 精度, 单位
    // ---------------------
    // 100, 温度, 0.1, ℃
    // 101, 湿度, 0.1, %RH
    // 102, PM2.5, 1, ug/m3
    // 103, E-CO2/CO2, 1, ppm
    // 104, TVOC, 1, ppb
    // 105, PM1.0, 1, ug/m3
    // 106, PM10, 1, ug/m3
    // 107, 甲醛, 1, ppb

    exports: {
        readData: function (callback) {
            this.modbus.readHoldingRegisters(this.slaveAddress, this.startAddress, this.quantity,
                function (error, values) {
                    if (error) {
                        callback(error);
                        return;
                    }

                    var temperature = values[0] / 10;
                    var humidity = values[1] / 10;
                    var pm25 = values[2];
                    var co2 = values[3];
                    var tvoc = values[4];
                    var pm1 = values[5];
                    var pm10 = values[6];
                    var hcho = values[7];

                    callback(undefined, temperature, humidity, pm1, pm25, pm10, hcho, tvoc, co2);
                }
            );
        }
    }
});
