class ErrorHandler extends Error {
    ErrorHandler(message, statusCode){
        this.message = message;
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = ErrorHandler;