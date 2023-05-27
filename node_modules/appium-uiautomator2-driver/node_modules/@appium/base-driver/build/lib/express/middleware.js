"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catch404Handler = exports.handleIdempotency = exports.allowCrossDomainAsyncExecute = exports.catchAllHandler = exports.defaultToJSONContentType = exports.fixPythonContentType = exports.allowCrossDomain = void 0;
const lodash_1 = __importDefault(require("lodash"));
const logger_1 = __importDefault(require("./logger"));
const protocol_1 = require("../protocol");
const idempotency_1 = require("./idempotency");
Object.defineProperty(exports, "handleIdempotency", { enumerable: true, get: function () { return idempotency_1.handleIdempotency; } });
function allowCrossDomain(req, res, next) {
    try {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
        res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, X-Requested-With, Content-Type, Accept, User-Agent');
        // need to respond 200 to OPTIONS
        if ('OPTIONS' === req.method) {
            return res.sendStatus(200);
        }
    }
    catch (err) {
        logger_1.default.error(`Unexpected error: ${err.stack}`);
    }
    next();
}
exports.allowCrossDomain = allowCrossDomain;
function allowCrossDomainAsyncExecute(basePath) {
    return (req, res, next) => {
        // there are two paths for async responses, so cover both
        // https://regex101.com/r/txYiEz/1
        const receiveAsyncResponseRegExp = new RegExp(`${lodash_1.default.escapeRegExp(basePath)}/session/[a-f0-9-]+/(appium/)?receive_async_response`);
        if (!receiveAsyncResponseRegExp.test(req.url)) {
            return next();
        }
        allowCrossDomain(req, res, next);
    };
}
exports.allowCrossDomainAsyncExecute = allowCrossDomainAsyncExecute;
function fixPythonContentType(basePath) {
    return (req, res, next) => {
        // hack because python client library gives us wrong content-type
        if (new RegExp(`^${lodash_1.default.escapeRegExp(basePath)}`).test(req.path) &&
            /^Python/.test(req.headers['user-agent'])) {
            if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                req.headers['content-type'] = 'application/json; charset=utf-8';
            }
        }
        next();
    };
}
exports.fixPythonContentType = fixPythonContentType;
function defaultToJSONContentType(req, res, next) {
    if (!req.headers['content-type']) {
        req.headers['content-type'] = 'application/json; charset=utf-8';
    }
    next();
}
exports.defaultToJSONContentType = defaultToJSONContentType;
function catchAllHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    logger_1.default.error(`Uncaught error: ${err.message}`);
    logger_1.default.error('Sending generic error response');
    const error = protocol_1.errors.UnknownError;
    res.status(error.w3cStatus()).json(patchWithSessionId(req, {
        status: error.code(),
        value: {
            error: error.error(),
            message: `An unknown server-side error occurred while processing the command: ${err.message}`,
            stacktrace: err.stack,
        },
    }));
    logger_1.default.error(err);
}
exports.catchAllHandler = catchAllHandler;
function catch404Handler(req, res) {
    logger_1.default.debug(`No route found for ${req.url}`);
    const error = protocol_1.errors.UnknownCommandError;
    res.status(error.w3cStatus()).json(patchWithSessionId(req, {
        status: error.code(),
        value: {
            error: error.error(),
            message: 'The requested resource could not be found, or a request was ' +
                'received using an HTTP method that is not supported by the mapped ' +
                'resource',
            stacktrace: '',
        },
    }));
}
exports.catch404Handler = catch404Handler;
const SESSION_ID_PATTERN = /\/session\/([^/]+)/;
function patchWithSessionId(req, body) {
    const match = SESSION_ID_PATTERN.exec(req.url);
    if (match) {
        body.sessionId = match[1];
    }
    return body;
}
//# sourceMappingURL=middleware.js.map