class ApiError extends Error {
    constructor(statusCode, message) {
        super(message); // Call the parent class (Error) constructor
        this.statusCode = statusCode;
    }
}

export default ApiError;