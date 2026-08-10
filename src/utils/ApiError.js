class ApiHandler extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stact = "") {
        super(message)
        this.statusCode = statusCode
        this.data = "null"
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = this.stack

        }
        else {
            errors.captureStackTrace(this, this.constructor)
        }


    }
}
export { ApiHandler }