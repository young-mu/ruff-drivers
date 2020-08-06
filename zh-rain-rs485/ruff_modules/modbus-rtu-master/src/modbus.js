/*!
 * Copyright (c) 2017 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var EventEmitter = require('events');
var util = require('util');

function Modbus(port, option) {
    EventEmitter.call(this);

    this._port = port;
    this._write = port.write.bind(port);

    option = option || {};
    this._timeout = option.timeout;
    this._mode = option.mode || 'rtu';
    if (option.parseSlaveData === undefined) {
        this._parseSlaveData = true;
    } else {
        this._parseSlaveData = option.parseSlaveData;
    }

    if (this._mode === 'rtu') {
        var Rtu = require('./rtu');
        this._codec = new Rtu(this._timeout);
    } else if (this._mode === 'ascii') {
        var Ascii = require('./ascii');
        this._codec = new Ascii(this._timeout);
    } else {
        throw Error('Unknow mode, please use `rtu` or `ascii` mode');
    }

    var that = this;
    this._port.on('data', function (data) {
        that._codec.pushCodedStream(data);
    });

    this._port.on('error', function (error) {
        that.emit('error', error);
    });

    this._codec.on('message', function (data) {
        that.emit('message', data);
    });
    this._codec.on('errorMessage', function (error) {
        that.emit('errorMessage', error);
    });
}

util.inherits(Modbus, EventEmitter);

// encode data and write to port
Modbus.prototype._writeData = function (buffer, callback) {
    var bufferCoded = this._codec.encode(buffer);
    this._write(bufferCoded, callback);
};

// read slave data common handler
Modbus.prototype._readSlaveData = function (slaveAddress, functionCode, startAddress, quantity, callback) {
    var bufferLength = 6;
    var buffer = new Buffer(bufferLength);

    buffer.writeUInt8(slaveAddress, 0);
    buffer.writeUInt8(functionCode, 1);
    buffer.writeUInt16BE(startAddress, 2);
    buffer.writeUInt16BE(quantity, 4);

    this._writeData(buffer, callback);
};

// Request Modbus "Read Coil Status" (FC=0x01)
Modbus.prototype.requestReadCoils = function (slaveAddress, startAddress, quantity, callback) {
    var expectedLength = 5 + Math.ceil(quantity / 8); // addr(1) + FC(1) + byteCount(1) + data + crc(2)
    this._codec.try(expectedLength);
    this._readSlaveData(slaveAddress, 0x01, startAddress, quantity, callback);
};

// Request Modbus "Read Input Status" (FC=0x02)
Modbus.prototype.requestReadDiscreteInputs = function (slaveAddress, startAddress, quantity, callback) {
    var expectedLength = 5 + Math.ceil(quantity / 8); // addr(1) + FC(1) + byteCount(1) + data + crc(2)
    this._codec.try(expectedLength);
    this._readSlaveData(slaveAddress, 0x02, startAddress, quantity, callback);
};

// Request Modbus "Read Holding Registers" (FC=0x03)
Modbus.prototype.requestReadHoldingRegisters = function (slaveAddress, startAddress, quantity, callback) {
    var expectedLength = 5 + quantity * 2; // addr(1) + FC(1) + byteCount(1) + data + crc(2)
    this._codec.try(expectedLength);
    this._readSlaveData(slaveAddress, 0x03, startAddress, quantity, callback);
};

// Request Modbus "Read Input Registers" (FC=0x04)
Modbus.prototype.requestReadInputRegisters = function (slaveAddress, startAddress, quantity, callback) {
    var expectedLength = 5 + quantity * 2; // addr(1) + FC(1) + byteCount(1) + data + crc(2)
    this._codec.try(expectedLength);
    this._readSlaveData(slaveAddress, 0x04, startAddress, quantity, callback);
};

// write single common handler
Modbus.prototype._writeSlaveSingle = function (slaveAddress, functionCode, address, value, callback) {
    var bufferLength = 6;
    var buffer = new Buffer(bufferLength);

    buffer.writeUInt8(slaveAddress, 0);
    buffer.writeUInt8(functionCode, 1);
    buffer.writeUInt16BE(address, 2);
    buffer.writeUInt16BE(value, 4);

    this._writeData(buffer, callback);
};

// Request Modbus "Write Single Coil" (FC=0x05)
Modbus.prototype.requestWriteSingleCoil = function (slaveAddress, address, state, callback) {
    this._codec.try(8); // addr(1) + FC(1) + OutputAddress(2) + OutputValue(2) + crc(2)
    var value = state ? 0xFF00 : 0x0000;
    this._writeSlaveSingle(slaveAddress, 0x05, address, value, callback);
};

// Request Modbus "Write Single Register " (FC=0x06)
Modbus.prototype.requestWriteSingleRegister = function (slaveAddress, address, value, callback) {
    this._codec.try(8); // addr(1) + FC(1) + OutputAddress(2) + OutputValue(2) + crc(2)
    this._writeSlaveSingle(slaveAddress, 0x06, address, value, callback);
};

// Request Modbus "Write Multiple Coils" (FC=0x0F)
Modbus.prototype.requestWriteMultipleCoils = function (slaveAddress, startAddress, states, callback) {
    this._codec.try(8); // addr(1) + FC(1) + OutputAddress(2) + OutputValue(2) + crc(2)
    var functionCode = 0x0F;
    var buffer = new Buffer(6);

    buffer.writeUInt8(slaveAddress, 0);
    buffer.writeUInt8(functionCode, 1);
    buffer.writeUInt16BE(startAddress, 2);
    buffer.writeUInt16BE(states.length, 4);

    var statesBuffer = bitsToBuffer(states);
    var bufferAll = Buffer.concat([buffer, statesBuffer]);

    this._writeData(bufferAll, callback);
};

// Request Modbus "Write Multiple Registers" (FC=0x10)
Modbus.prototype.requestWriteMultipleRegisters = function (slaveAddress, address, values, callback) {
    this._codec.try(8); // addr(1) + FC(1) + OutputAddress(2) + OutputValue(2) + crc(2)
    var functionCode = 0x10;
    var bufferLength = 7 + 2 * values.length;
    var buffer = new Buffer(bufferLength);

    buffer.writeUInt8(slaveAddress, 0);
    buffer.writeUInt8(functionCode, 1);
    buffer.writeUInt16BE(address, 2);
    buffer.writeUInt16BE(values.length, 4);
    buffer.writeUInt8(values.length * 2, 6);

    for (var i = 0; i < values.length; i++) {
        buffer.writeUInt16BE(values[i], 7 + 2 * i);
    }

    this._writeData(buffer, callback);
};

// Response Exception
Modbus.prototype.responseError = function (slaveAddress, functionCode, exceptionCode, callback) {
    var buffer = new Buffer(3);
    buffer.writeUInt8(slaveAddress, 0);
    buffer.writeUInt8(functionCode + 0x80, 1);
    buffer.writeUInt8(exceptionCode, 2);
    this._writeData(buffer, callback);
};

Modbus.prototype._responseBits = function (slaveAddress, functionCode, bits, callback) {
    var buffer = new Buffer(2);
    var bitsBuffer = bitsToBuffer(bits);

    buffer.writeUInt8(slaveAddress, 0);
    buffer.writeUInt8(functionCode, 1);

    var bufferAll = Buffer.concat([buffer, bitsBuffer]);

    this._writeData(bufferAll, callback);
};

Modbus.prototype._responseRegisters = function (slaveAddress, functionCode, registers, callback) {
    var buffer = new Buffer(2);
    var registersBuffer = registersToBuffer(registers);

    buffer.writeUInt8(slaveAddress, 0);
    buffer.writeUInt8(functionCode, 1);

    var bufferAll = Buffer.concat([buffer, registersBuffer]);

    this._writeData(bufferAll, callback);
};

// Response Modbus "Read Coil Status" (FC=0x01)
Modbus.prototype.responseReadCoils = function (slaveAddress, coilStatus, callback) {
    this._responseBits(slaveAddress, 0x01, coilStatus, callback);
};
// Response Modbus "Read Input Status" (FC=0x02)
Modbus.prototype.responseReadDiscreteInputs = function (slaveAddress, discreteInputs, callback) {
    this._responseBits(slaveAddress, 0x02, discreteInputs, callback);
};
// Response Modbus "Read Holding Registers" (FC=0x03)
Modbus.prototype.responseReadHoldingRegisters = function (slaveAddress, holdingRegisters, callback) {
    this._responseRegisters(slaveAddress, 0x03, holdingRegisters, callback);
};
// Response Modbus "Read Input Registers" (FC=0x04)
Modbus.prototype.responseReadInputRegisters = function (slaveAddress, InputRegisters, callback) {
    this._responseRegisters(slaveAddress, 0x04, InputRegisters, callback);
};

// Response Modbus "Write Single Coil" (FC=0x05), the same as request
Modbus.prototype.responseWriteSingleCoil = function (slaveAddress, address, state, callback) {
    var value = state ? 0xFF00 : 0x0000;
    this._writeSlaveSingle(slaveAddress, 0x05, address, value, callback);
};

// Response Modbus "Write Single Register " (FC=0x06), the same as request
Modbus.prototype.responseWriteSingleRegister = function (slaveAddress, address, value, callback) {
    this._writeSlaveSingle(slaveAddress, 0x06, address, value, callback);
};

// Response Modbus "Write Multiple Coils" (FC=0x0F)
Modbus.prototype.responseWriteMultipleCoils = function (slaveAddress, startAddress, quantity, callback) {
    var buffer = new Buffer(6);

    buffer.writeUInt8(slaveAddress, 0);
    buffer.writeUInt8(0x0F, 1);
    buffer.writeUInt16BE(startAddress, 2);
    buffer.writeUInt16BE(quantity, 4);

    this._writeData(buffer, callback);
};

// Response Modbus "Write Multiple Registers" (FC=0x10)
Modbus.prototype.responseWriteMultipleRegisters = function (slaveAddress, startAddress, quantity, callback) {
    var buffer = new Buffer(6);

    buffer.writeUInt8(slaveAddress, 0);
    buffer.writeUInt8(0x10, 1);
    buffer.writeUInt16BE(startAddress, 2);
    buffer.writeUInt16BE(quantity, 4);

    this._writeData(buffer, callback);
};

// parse read status common handler
Modbus.prototype._parseReadStatusResponse = function (quantity, buffer, expectFunctionCode, convertHandler) {
    var slaveAddress = buffer.readUInt8(0);
    var functionCode = buffer.readUInt8(1);
    if (functionCode === expectFunctionCode) {
        var byteCount = buffer.readUInt8(2);
        var statusBuffer = buffer.slice(2);
        var status = this._parseSlaveData ? convertHandler(statusBuffer).slice(0, quantity) : statusBuffer.slice(1);
        return {
            slaveAddress: slaveAddress,
            functionCode: functionCode,
            byteCount: byteCount,
            status: status
        };
    } else if (functionCode === (expectFunctionCode | 0x80)) {
        var exceptionCode = buffer.readUInt8(2);
        return {
            slaveAddress: slaveAddress,
            functionCode: functionCode,
            exceptionCode: exceptionCode
        };
    } else {
        throw new Error('Invalid function code to be parsed');
    }
};

// Parse "Read Coil Status" (FC=0x01) Response
Modbus.prototype.parseReadCoilsResponse = function (quantity, buffer) {
    return this._parseReadStatusResponse(quantity, buffer, 0x01, bufferToBits);
};
// Parse "Read Input Status" (FC=0x02) Response
Modbus.prototype.parseReadDiscreteInputsResponse = function (quantity, buffer) {
    return this._parseReadStatusResponse(quantity, buffer, 0x02, bufferToBits);
};
// Parse "Read Holding Registers" (FC=0x03) Response
Modbus.prototype.parseReadHoldingRegistersResponse = function (quantity, buffer) {
    return this._parseReadStatusResponse(quantity * 2, buffer, 0x03, bufferToRegisters);
};
// Parse "Read Input Registers" (FC=0x04) Response
Modbus.prototype.parseReadInputRegistersResponse = function (quantity, buffer) {
    return this._parseReadStatusResponse(quantity * 2, buffer, 0x04, bufferToRegisters);
};

// Parse "Write Single Coil" (FC=0x05) Response
Modbus.prototype.parseWriteSingleCoilResponse = function (buffer) {
    var slaveAddress = buffer.readUInt8(0);
    var functionCode = buffer.readUInt8(1);

    if (functionCode === 0x05) {
        var address = buffer.readUInt16BE(2);
        var state;
        if (this._parseSlaveData) {
            state = buffer.readUInt16BE(4) === 0xFF00 ? 1 : 0;
        } else {
            state = buffer.slice(4, 6);
        }

        return {
            slaveAddress: slaveAddress,
            functionCode: functionCode,
            address: address,
            state: state
        };
    } else if (functionCode === 0x85) {
        var exceptionCode = buffer.readUInt8(2);
        return {
            slaveAddress: slaveAddress,
            functionCode: functionCode,
            exceptionCode: exceptionCode
        };
    } else {
        throw new Error('Invalid function code to be parsed');
    }
};
// Parse "Write Single Register " (FC=0x06) Response
Modbus.prototype.parseWriteSingleRegisterResponse = function (buffer) {
    var slaveAddress = buffer.readUInt8(0);
    var functionCode = buffer.readUInt8(1);

    if (functionCode === 0x06) {
        var address = buffer.readUInt16BE(2);
        var value = this._parseSlaveData ? buffer.readUInt16BE(4) : buffer.slice(4, 6);

        return {
            slaveAddress: slaveAddress,
            functionCode: functionCode,
            address: address,
            value: value
        };
    } else if (functionCode === 0x86) {
        var exceptionCode = buffer.readUInt8(2);
        return {
            slaveAddress: slaveAddress,
            functionCode: functionCode,
            exceptionCode: exceptionCode
        };
    } else {
        throw new Error('Invalid function code to be parsed');
    }
};

// parse write multiple common handler
Modbus.prototype._parseWriteMultipleResponse = function (buffer, expectFunctionCode) {
    var slaveAddress = buffer.readUInt8(0);
    var functionCode = buffer.readUInt8(1);

    if (functionCode === expectFunctionCode) {
        var startAddress = buffer.readUInt16BE(2);
        var quantity = buffer.readUInt16BE(4);

        return {
            slaveAddress: slaveAddress,
            functionCode: functionCode,
            startAddress: startAddress,
            quantity: quantity
        };
    } else if (functionCode === (expectFunctionCode | 0x80)) {
        var exceptionCode = buffer.readUInt8(2);
        return {
            slaveAddress: slaveAddress,
            functionCode: functionCode,
            exceptionCode: exceptionCode
        };
    } else {
        throw new Error('Invalid function code to be parsed');
    }
};

// Parse "Write Multiple Coils" (FC=0x0F) Response
Modbus.prototype.parseWriteMultipleCoilsResponse = function (buffer) {
    return this._parseWriteMultipleResponse(buffer, 0x0F);
};
// Parse "Write Multiple Registers" (FC=0x10) Response
Modbus.prototype.parseWriteMultipleRegistersResponse = function (buffer) {
    return this._parseWriteMultipleResponse(buffer, 0x10);
};

function bitsToBuffer(bits) {
    var buffer = new Buffer(Math.ceil(bits.length / 8) + 1);
    var i;

    buffer.fill(0x00);
    buffer.writeUInt8(buffer.length - 1, 0);

    for (var index = 0; index < bits.length; index++) {
        i = Math.floor(index / 8) + 1;

        buffer.writeUInt8(buffer.readUInt8(i) >> 1, i);
        if (bits[index]) {
            buffer.writeUInt8(buffer.readUInt8(i) | 0x80, i);
        }
    }

    i = bits.length - (Math.floor(bits.length / 8) * 8);
    if (i > 0) {
        i = 8 - i;
        while (i > 0) {
            buffer.writeUInt8(buffer.readUInt8(buffer.length - 1) >> 1, buffer.length - 1);
            i -= 1;
        }
    }

    return buffer;
}

function bufferToBits(buffer) {
    var bits = [];

    for (var i = 1; i < Math.min(buffer.length, buffer.readUInt8(0) + 1); i++) {
        for (var j = 0; j < 8; j++) {
            bits.push((buffer.readUInt8(i) >> j) & 0x1);
        }
    }

    return bits;
}

function bufferToRegisters(buffer) {
    var total = buffer.readUInt8(0) / 2;
    var registers = [];
    for (var i = 0; i < total; i++) {
        registers.push(buffer.readUInt16BE(1 + 2 * i));
    }

    return registers;
}

function registersToBuffer(registers) {
    var buffer = new Buffer(registers.length * 2 + 1);
    buffer.writeUInt8(registers.length * 2, 0);

    for (var i = 0; i < registers.length; i++) {
        buffer.writeUInt16BE(registers[i], 1 + 2 * i);
    }

    return buffer;
}

module.exports = Modbus;
