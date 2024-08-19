"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorCodeToStatusCode = exports.badGatewayStatusCodes = void 0;
const http_1 = require("http");
exports.badGatewayStatusCodes = {
    /**
     * Upstream has timed out.
     */
    TIMEOUT: 504,
    /**
     * Upstream responded with non-200 status code.
     */
    NON_200: 590,
    /**
     * Upstream respondend with status code different than 100-999.
     */
    STATUS_CODE_OUT_OF_RANGE: 592,
    /**
     * DNS lookup failed - EAI_NODATA or EAI_NONAME.
     */
    NOT_FOUND: 593,
    /**
     * Upstream refused connection.
     */
    CONNECTION_REFUSED: 594,
    /**
     * Connection reset due to loss of connection or timeout.
     */
    CONNECTION_RESET: 595,
    /**
     * Trying to write on a closed socket.
     */
    BROKEN_PIPE: 596,
    /**
     * Incorrect upstream credentials.
     */
    AUTH_FAILED: 597,
    /**
     * Generic upstream error.
     */
    GENERIC_ERROR: 599,
};
http_1.STATUS_CODES['590'] = 'Non Successful';
http_1.STATUS_CODES['592'] = 'Status Code Out Of Range';
http_1.STATUS_CODES['593'] = 'Not Found';
http_1.STATUS_CODES['594'] = 'Connection Refused';
http_1.STATUS_CODES['595'] = 'Connection Reset';
http_1.STATUS_CODES['596'] = 'Broken Pipe';
http_1.STATUS_CODES['597'] = 'Auth Failed';
http_1.STATUS_CODES['599'] = 'Upstream Error';
// https://nodejs.org/api/errors.html#common-system-errors
exports.errorCodeToStatusCode = {
    ENOTFOUND: exports.badGatewayStatusCodes.NOT_FOUND,
    ECONNREFUSED: exports.badGatewayStatusCodes.CONNECTION_REFUSED,
    ECONNRESET: exports.badGatewayStatusCodes.CONNECTION_RESET,
    EPIPE: exports.badGatewayStatusCodes.BROKEN_PIPE,
    ETIMEDOUT: exports.badGatewayStatusCodes.TIMEOUT,
};
//# sourceMappingURL=statuses.js.map