/*!
 * Copyright (c) 2017 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

module.exports = function crc16(buffer) {
    var crc = 0xFFFF;
    var odd;

    for (var i = 0; i < buffer.length; i++) {
        crc ^= buffer.readUInt8(i);

        for (var j = 0; j < 8; j++) {
            odd = crc & 0x0001;
            crc >>= 1;
            if (odd) {
                crc ^= 0xA001;
            }
        }
    }

    return crc;
};

