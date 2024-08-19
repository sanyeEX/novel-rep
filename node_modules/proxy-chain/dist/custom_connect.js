"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customConnect = void 0;
const tslib_1 = require("tslib");
const net_1 = tslib_1.__importDefault(require("net"));
const util_1 = require("util");
const asyncWrite = (0, util_1.promisify)(net_1.default.Socket.prototype.write);
const customConnect = async (socket, server) => {
    // `countTargetBytes(socket, socket)` is incorrect here since `socket` is not a target.
    // We would have to create a new stream and pipe traffic through that,
    // however this would also increase CPU usage.
    // Also, counting bytes here is not correct since we don't know how the response is generated
    // (whether any additional sockets are used).
    await asyncWrite.call(socket, 'HTTP/1.1 200 Connection Established\r\n\r\n');
    server.emit('connection', socket);
    return new Promise((resolve) => {
        if (socket.destroyed) {
            resolve();
            return;
        }
        socket.once('close', () => {
            resolve();
        });
    });
};
exports.customConnect = customConnect;
//# sourceMappingURL=custom_connect.js.map