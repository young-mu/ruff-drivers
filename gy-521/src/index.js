'use strict';

var driver = require('ruff-driver');

var RM = {
    SMPLRT_DIV: 0x19,
    CONFIG: 0x1A,
    GYRO_CONFIG: 0x1B,
    ACCEL_CONFIG: 0x1C,

    ACCEL_XOUT_H: 0x3B,
    ACCEL_XOUT_L: 0x3C,
    ACCEL_YOUT_H: 0x3D,
    ACCEL_YOUT_L: 0x3E,
    ACCEL_ZOUT_H: 0x3F,
    ACCEL_ZOUT_L: 0x40,

    TEMP_OUT_H: 0x41,
    TEMP_OUT_L: 0x42,

    GYRO_XOUT_H: 0x43,
    GYRO_XOUT_L: 0x44,
    GYRO_YOUT_H: 0x45,
    GYRO_YOUT_L: 0x46,
    GYRO_ZOUT_H: 0x47,
    GYRO_ZOUT_L: 0x48,

    PWR_MGMT_1: 0x6B,
    WHO_AM_I: 0x75
};

var SMPLRT_DIV = {
    'GYRO_1K_WITH_DLPF': 0x0,
    'GYRO_1K_WITHOUT_DLPF': 0x7
};

var CONFIG = {
    'DLPF_CFG': {
        'DISABLED': 0,
        'LEVEL1': 1,
        'LEVEL2': 2,
        'LEVEL3': 3,
        'LEVEL4': 4,
        'LEVEL5': 5,
        'LEVEL6': 6,
    }
};

var PWR_MGMT_1 = {
    'SLEEP': {
        'DISABLED': 0,
        'ENABLED': 1
    },
    'CLKSEL': {
        'INT_8M': 0,
        'PLL_X_REF': 1,
        'PLL_Y_REF': 2,
        'PLL_Z_REF': 3,
        'PLL_EXT_32K768': 4,
        'PLL_EXT_19M2': 5
    }
};

// Full-Scale Range: { Full-Scale Selector, Sensitivity Scale Factor}
var accelRangeMap = {
    2: {'FSS': 0, 'SSF': 16384},
    4: {'FSS': 1, 'SSF': 8192},
    8: {'FSS': 2, 'SSF': 4096},
    16: {'FSS': 3, 'SSF': 2048}
};

var gyroRangeMap = {
    250: {'FSS': 0, 'SSF': 131},
    500: {'FSS': 1, 'SSF': 65.5},
    1000: {'FSS': 2, 'SSF': 32.8},
    2000: {'FSS': 3, 'SSF': 16.4}
};

function toBinString(value, bitsNum) {
    var binString = value.toString(2);
    var initLength = binString.length;

    for (var i = bitsNum; i > initLength; i--) {
        binString = '0' + binString;
    }

    return binString;
}

function toComplement(value, bitsNum) {
    if (value >= Math.pow(2, bitsNum - 1)) {
        return -(Math.pow(2, bitsNum) - value);
    } else {
        return value;
    }
}

function _getSampleRateDiv (callback) {
    this._i2c.readByte(RM.SMPLRT_DIV, function (error, value) {
        callback(undefined, value);
    });
}

function _setSampleRateDiv (obj, smplRtDiv, callback) {
    obj._i2c.writeByte(RM.SMPLRT_DIV, smplRtDiv, function (error) {
        callback && callback(error);
    });
}

function _getDLPFConfig (callback) {
    this._i2c.readByte(RM.CONFIG, function (error, value) {
        var config = toBinString(value, 8);
        var dlpfConfigBits = config.slice(5, 5 + 3);
        var dlpfConfig = parseInt(dlpfConfigBits, 2);

        callback(undefined, dlpfConfig);
    });
}

function _setDLPFConfig (obj, dlpfConfig, callback) {
    var that = obj;
    obj._i2c.readByte(RM.CONFIG, function (error, value) {
        value = value & parseInt('11111000', 2);
        value |= dlpfConfig << 0;
        that._i2c.writeByte(RM.CONFIG, value, function (error) {
            callback && callback(error);
        });
    });
}

function _getClockSource (callback) {
    this._i2c.readByte(RM.PWR_MGMT_1, function (error, value) {
        var pwrMgmt = toBinString(value, 8);
        var clockSelectBits = pwrMgmt.slice(5, 5 + 3);
        var clockSelect = parseInt(clockSelectBits, 2);

        callback(undefined, clockSelect);
    });
}

function _setClockSource (obj, clkSource, callback) {
    var that = obj;
    obj._i2c.readByte(RM.PWR_MGMT_1, function (error, value) {
        value = value & parseInt('11111000', 2);
        value |= clkSource << 0;
        that._i2c.writeByte(RM.PWR_MGMT_1, value, function (error) {
            callback && callback(error);
        });
    });
}

function _getSleepMode (callback) {
    this._i2c.readByte(RM.PWR_MGMT_1, function (error, value) {
        var pwrMgmt = toBinString(value, 8);
        var sleepModeBits = pwrMgmt.slice(1, 1 + 1);
        var sleepMode = parseInt(sleepModeBits, 2);

        callback(undefined, sleepMode);
    });
}

function _setSleepMode (obj, sleepMode, callback) {
    var that = obj;
    obj._i2c.readByte(RM.PWR_MGMT_1, function (error, value) {
        value = value & parseInt('10111111', 2);
        value |= sleepMode << 6;
        that._i2c.writeByte(RM.PWR_MGMT_1, value, function (error) {
            callback && callback(error);
        });
    });
}

function _getGyroRange (callback) {
    this._i2c.readByte(RM.GYRO_CONFIG, function (error, value) {
        var gyroConfig = toBinString(value, 8);
        var gyroRangeBits = gyroConfig.slice(3, 3 + 2);
        var gyroRange = parseInt(gyroRangeBits, 2);

        callback(undefined, gyroRange);
    });
}

function _setGyroRange (obj, gyroRange, callback) {
    var that = obj;
    var gyroFSS = gyroRangeMap[gyroRange].FSS;
    obj._i2c.readByte(RM.GYRO_CONFIG, function (error, value) {
        value = value & parseInt('11100111', 2);
        value |= gyroFSS << 3;
        that._i2c.writeByte(RM.GYRO_CONFIG, value, function (error) {
            callback && callback(error);
        });
    });
}

function _getAccelRange (callback) {
    this._i2c.readByte(RM.ACCEL_CONFIG, function (error, value) {
        var accelConfig = toBinString(value, 8);
        var accelRangeBits = accelConfig.slice(3, 3 + 2);
        var accelRange = parseInt(accelRangeBits, 2);

        callback(undefined, accelRange);
    });
}

function _setAccelRange (obj, accelRange, callback) {
    var that = obj;
    var accelFSS = accelRangeMap[accelRange].FSS;
    obj._i2c.readByte(RM.ACCEL_CONFIG, function (error, value) {
        value = value & parseInt('11100111', 2);
        value |= accelFSS << 3;
        that._i2c.writeByte(RM.ACCEL_CONFIG, value, function (error) {
            callback && callback(error);
        });
    });
}

function getAcceleration (callback) {
    var that = this;
    this._i2c.readBytes(RM.ACCEL_XOUT_H, 6, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var _accel = [];
        _accel[0] = toComplement((values[0] << 8 | values[1]), 16);
        _accel[1] = toComplement((values[2] << 8 | values[3]), 16);
        _accel[2] = toComplement((values[4] << 8 | values[5]), 16);

        var accelSSF = accelRangeMap[that._accelRange].SSF;

        var accel = _accel.map(function(value) {
            return Number((value / accelSSF).toFixed(2));
        });

        callback(undefined, accel);
    });
}

function getAccelerationX (callback) {
    var that = this;
    this._i2c.readBytes(RM.ACCEL_XOUT_H, 2, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var _accelX = toComplement((values[0] << 8 | values[1]), 16);
        var accelSSF = accelRangeMap[that._accelRange].SSF;
        var accelX = Number((_accelX / accelSSF).toFixed(2));

        callback(undefined, accelX);
    });
}

function getAccelerationY (callback) {
    var that = this;
    this._i2c.readBytes(RM.ACCEL_YOUT_H, 2, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var _accelY = toComplement((values[0] << 8 | values[1]), 16);
        var accelSSF = accelRangeMap[that._accelRange].SSF;
        var accelY = Number((_accelY / accelSSF).toFixed(2));

        callback(undefined, accelY);
    });
}

function getAccelerationZ (callback) {
    var that = this;
    this._i2c.readBytes(RM.ACCEL_ZOUT_H, 2, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var _accelZ = toComplement((values[0] << 8 | values[1]), 16);
        var accelSSF = accelRangeMap[that._accelRange].SSF;
        var accelZ = Number((_accelZ / accelSSF).toFixed(2));

        callback(undefined, accelZ);
    });
}


function getGyroscope (callback) {
    var that = this;
    this._i2c.readBytes(RM.GYRO_XOUT_H, 6, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var _gyro = [];
        _gyro[0] = toComplement((values[0] << 8 | values[1]), 16);
        _gyro[1] = toComplement((values[2] << 8 | values[3]), 16);
        _gyro[2] = toComplement((values[4] << 8 | values[5]), 16);

        var gyroSSF = gyroRangeMap[that._gyroRange].SSF;

        var gyro = _gyro.map(function(value) {
            return Number((value / gyroSSF).toFixed(2));
        });

        callback(undefined, gyro);
    });
}

function getGyroscopeX (callback) {
    var that = this;
    this._i2c.readBytes(RM.GYRO_XOUT_H, 2, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var _gyroX = toComplement((values[0] << 8 | values[1]), 16);
        var gyroSSF = gyroRangeMap[that._gyroRange].SSF;
        var gyroX = Number((_gyroX / gyroSSF).toFixed(2));

        callback(undefined, gyroX);
    });
}

function getGyroscopeY (callback) {
    var that = this;
    this._i2c.readBytes(RM.GYRO_YOUT_H, 2, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var _gyroY = toComplement((values[0] << 8 | values[1]), 16);
        var gyroSSF = gyroRangeMap[that._gyroRange].SSF;
        var gyroY = Number((_gyroY / gyroSSF).toFixed(2));

        callback(undefined, gyroY);
    });
}

function getGyroscopeZ (callback) {
    var that = this;
    this._i2c.readBytes(RM.GYRO_ZOUT_H, 2, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var _gyroZ = toComplement((values[0] << 8 | values[1]), 16);
        var gyroSSF = gyroRangeMap[that._gyroRange].SSF;
        var gyroZ = Number((_gyroZ / gyroSSF).toFixed(2));

        callback(undefined, gyroZ);
    });
}

function getAngleX (callback) {
    var that = this;
    this._i2c.readBytes(RM.ACCEL_XOUT_H, 6, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var accelSSF = accelRangeMap[that._accelRange].SSF;

        var accelX, accelZ;
        accelX = toComplement((values[0] << 8 | values[1]), 16) / accelSSF;
        accelZ = toComplement((values[4] << 8 | values[5]), 16) / accelSSF;

        var angleX;
        angleX = Math.atan2(accelX, -accelZ) * 180 / Math.PI;
        angleX = Number(angleX.toFixed(2));

        callback(undefined, angleX);
    });
}

function getAngleY (callback) {
    var that = this;
    this._i2c.readBytes(RM.ACCEL_XOUT_H, 6, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var accelSSF = accelRangeMap[that._accelRange].SSF;

        var accelY, accelZ;
        accelY = toComplement((values[2] << 8 | values[3]), 16) / accelSSF;
        accelZ = toComplement((values[4] << 8 | values[5]), 16) / accelSSF;

        var angleY;
        angleY = Math.atan2(-accelY, -accelZ) * 180 / Math.PI;
        angleY = Number(angleY.toFixed(2));

        callback(undefined, angleY);
    });
}

function getFusedMotionX (delta, callback) {
    var that = this;
    this._i2c.readBytes(RM.ACCEL_XOUT_H, 12, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var accelSSF = accelRangeMap[that._accelRange].SSF;
        var _accelX = toComplement((values[0] << 8 | values[1]), 16) / accelSSF;
        var _accelZ = toComplement((values[4] << 8 | values[5]), 16) / accelSSF;

        var gyroSSF = gyroRangeMap[that._gyroRange].SSF;
        var _gyroY = toComplement((values[10] << 8 | values[11]), 16) / gyroSSF;

        var _angleX = Math.atan2(_accelX, -_accelZ) * 180 / Math.PI;

        that.angleX = that.K * _angleX +
                      (1 - that.K) * (that.angleX + _gyroY * delta / 1000);

        callback(undefined, that.angleX, _gyroY);
    });
}

function getFusedMotionY (delta, callback) {
    var that = this;
    this._i2c.readBytes(RM.ACCEL_XOUT_H, 12, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var accelSSF = accelRangeMap[that._accelRange].SSF;
        var _accelY = toComplement((values[2] << 8 | values[3]), 16) / accelSSF;
        var _accelZ = toComplement((values[4] << 8 | values[5]), 16) / accelSSF;

        var gyroSSF = gyroRangeMap[that._gyroRange].SSF;
        var _gyroX = toComplement((values[8] << 8 | values[9]), 16) / gyroSSF;

        var _angleY = Math.atan2(_accelY, -_accelZ) * 180 / Math.PI;

        that.angleY = that.K * _angleY +
                      (1 - that.K) * (that.angleY + _gyroX * delta / 1000);

        callback(undefined, that.angleY, _gyroX);
    });
}

function getTemperature (callback) {
    this._i2c.readBytes(RM.TEMP_OUT_H, 2, function (error, values) {
        if (error) {
            callback(error);
            return;
        }

        var _temp = toComplement((values[0] << 8 | values[1]), 16);
        var temp = Number((_temp / 340).toFixed(2)) + 36.25;

        callback(undefined, temp);
    });
}

function _getDeviceID(callback) {
    this._i2c.readByte(RM.WHO_AM_I, function (error, value) {
        if (error) {
            callback(error);
            return;
        }

        callback(undefined, value);
    });
}

var prototype = {
    getAcceleration: getAcceleration,
    getAccelerationX: getAccelerationX,
    getAccelerationY: getAccelerationY,
    getAccelerationZ: getAccelerationZ,
    getGyroscope: getGyroscope,
    getGyroscopeX: getGyroscopeX,
    getGyroscopeY: getGyroscopeY,
    getGyroscopeZ: getGyroscopeZ,
    getAngleX: getAngleX,
    getAngleY: getAngleY,
    getFusedMotionX: getFusedMotionX,
    getFusedMotionY: getFusedMotionY,
    getTemperature: getTemperature,
};

Object.defineProperties(prototype, {
    accelRange: {
        get: function () {
            return this._accelRange;
        },
        set: function (value) {
            this._accelRange = value;
            _setAccelRange(this, this._accelRange);
        }
    },
    gyroRange: {
        get: function () {
            return this._gyroRange;
        },
        set: function (value) {
            this._gyroRange = value;
            _setGyroRange(this, this._gyroRange);
        }
    }
});

module.exports = driver({
    attach: function (inputs, context) {
        this._i2c = inputs['i2c'];

        this.angleX = 0;
        this.angleY = 0;
        this.K = 0.02;

        this._dlpfConfig = CONFIG.DLPF_CFG.LEVEL6;
        this._sampleRateDiv = (this._dlpfConfig === CONFIG.DLPF_CFG.DISABLED) ?
                              SMPLRT_DIV.GYRO_1K_WITHOUT_DLPF :
                              SMPLRT_DIV.GYRO_1K_WITH_DLPF;
        this._accelRange = context.args.accelRange;
        this._gyroRange = context.args.gyroRange;

        _setDLPFConfig(this, this._dlpfConfig);
        _setGyroRange(this, this._gyroRange);
        _setAccelRange(this, this._accelRange);
        _setSampleRateDiv(this, this._sampleRateDiv);

        _setClockSource(this, PWR_MGMT_1.CLKSEL.INT_8M);
        _setSleepMode(this, PWR_MGMT_1.SLEEP.DISABLED);
    },
    exports: prototype
});
