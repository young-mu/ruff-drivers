/*!
 * Copyright (c) 2017 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

module.exports = function lrc(buffer) {
    var lrc = 0;
    for (var i = 0; i < buffer.length; i++) {
        lrc += buffer.readUInt8(i) & 0xFF;
    }

    return ((lrc ^ 0xFF) + 1) & 0xFF;
};
