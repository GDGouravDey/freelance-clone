class ApiResponse {
    // Define the shape of the response object
    constructor(
        statusCode, 
        data,
        message = "Success"
    ){ // Define the properties of the response object
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }