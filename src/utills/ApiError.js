class ApiError extends Error {
  constructor(
    statuscode = 500,
    message = "Internal Server Error",
    isOperational = true,
    stack ="",
    errors=[]
  ) {
    this.statuscode = statuscode;
    this.message = message;
    this.stack = stack;
    this.isOperational = isOperational; 
    this.errors=errors;

    
  }
}