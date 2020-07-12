# Modbus-rtu Master Module for Ruff

The master controller of modbus protocol of RTU mode.

The supported function codes are listed ad follows:
* FC 0x01 "Read Coils"
* FC 0x02 "Read Discrete Inputs"
* FC 0x03 "Read Holding Registers"
* FC 0x04 "Read Input Registers"
* FC 0x05 "Write Single Coil"
* FC 0x06 "Write Single Register"
* FC 0x0F "Write Multiple Coils"
* FC 0x10 "Write Multiple Registers”

Please reference [Modbus Application Protocol](www.modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf) for more information.

## Usage

Here is the basic usage of this module.

```js
var ModbusRtuMaster = require('modbus-rtu-master');
rs485 = $('#rs485');
var modbus = new ModbusRtuMaster(rs485);
var slaveAddress = 0x01;
var startAddress = 0x03e8;
var quantity = 8;
modbus.readHoldingRegisters(slaveAddress, startAddress, quantity, function (error, values) {
    if (error) {
        console.log('Error is', error);
        return;
    }
    console.log('data is', values);
});

```

## API References

### Methods

#### Class `ModbusRtuMaster(port, options)`
The constructor function.
- **port:** The communication port that modbus relies on, usually the port is an `UART`. The port must have one `write` method and can emit `data` event.
- **options:** Some configrations to parse data from the port using mobus protocol.
  - **cmdTimeout:** Optional. The command timeout of one modbus command. The default value is 500 milliseconds.
  - **parseSlaveData:** Optional. `parseSlaveData` is an boolean, when it is `true`, the response data will be converted to an readable `Array` format according the modbus protocol,
  otherwise, the response data will be in format of raw `Buffer`. The defalue vlaue is `true`.

#### `readCoils(slaveAddress, startAddress, quantity, callback)`
Function code 0x01, it is used to read from 1 to 2000 contiguous status of coils in a remote device.
- **slaveAddress:** The address of the remote device.
- **startAddress:** The starting address of coils to be read.
- **quantity:** The quantity of coils to be read.
- **callback:** The callback gets `error` and `states` as its arguments. The `states` is an array or buffer that contains the states of coils.

#### `readDiscreteInputs(slaveAddress, startAddress, quantity, callback)`
Function code 0x02, it is used to read from 1 to 2000 contiguous status of discrete inputs in a remote device.
- **slaveAddress:** The address of the remote device.
- **startAddress:** The starting address of discrete inputs to be read.
- **quantity:** The quantity of discrete inputs to be read.
- **callback:** The callback gets `error` and `states` as its arguments. The `states` is an array or buffer that contains the states of discrete inputs.

### `readHoldingRegisters(slaveAddress, startAddress, quantity, callback)`
Function code 0x03, it is used to read the contents of a contiguous block of holding registers in a remote device.
- **slaveAddress:** The address of the remote device.
- **startAddress:** The starting address of holding registers to be read.
- **quantity:** The quantity of holding registers to be read.
- **callback:** The callback gets `error` and `values` as its arguments. The `values` is an array or buffer that contains the values of holding registers.

### `readInputRegisters(slaveAddress, startAddress, quantity, callback)`
Function code 0x04, it is used to read from 1 to 125 contiguous input registers in a remote device.
- **slaveAddress:** The address of the remote device.
- **startAddress:** The starting address of input registers to be read.
- **quantity:** The quantity of input registers to be read.
- **callback:** The callback gets `error` and `values` as its arguments. The `values` is an array or buffer that contains the values of input registers.

### `writeSingleCoil(slaveAddress, address, state, callback)`
Function code 0x05, it is used to write a single output to either `ON` or `OFF` in a remote device.
- **slaveAddress:** The address of the remote device.
- **address:** The address of coil to be forced to `ON` or `OFF` state.
- **state:** The `ON` or `OFF` state, `1` means `ON` and `0` means `OFF`.
- **callback:** The callback gets `error` and `state` as its arguments. The `state` is the parameter `state` to be written.

### `writeSingleRegister(slaveAddress, address, value, callback)`
Function code 0x06, it is used to write a single holding register in a remote device.
- **slaveAddress:** The address of the remote device.
- **address:** The address of the holding register to be written.
- **value:** The value to be set to the holding register.
- **callback:** The callback gets `error` and `value` as its arguments. The `value` is the parameter `value` to be written.

### `writeMultipleCoils(slaveAddress, startAddress, states, callback)`
Function code 0x0F, it is used to force each coil in a sequence of coils to either `ON` or `OFF` in a remote device.
- **slaveAddress:** The address of the remote device.
- **startAddress:** The starting address of the coils to be written to.
- **states:** The states to be written to the coils. The `states` is an array with `1` or `0` as its element, here `1` means `ON` and `0` means `OFF`.
- **callback:** The callback gets `error` and `quantity` as its arguments. The `quantity` is the length of `states` to be written.

### `writeMultipleRegisters(slaveAddress, startAddress, values, callback)`
Function code 0x10, it is used to write a block of contiguous registers (1 to 123 registers) in a remote device.
- **slaveAddress:** The address of the remote device.
- **startAddress:** The starting address of the registers to be written to.
- **values:** The values to be written to the registers. The `values` is an array with an two bytes value as its element.
- **callback:** The callback gets `error` and `quantity` as its arguments. The `quantity` is the length of `values` to be written.

## Contributing

Contributions to this project are warmly welcome. But before you open a pull request, please make sure your changes are passing code linting and tests.

You will need the latest [Ruff SDK](https://ruff.io/) to install rap dependencies and then to run tests.

## License

The MIT License (MIT)

Copyright (c) 2016 Nanchao Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
