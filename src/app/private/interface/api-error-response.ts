export interface ApiErrorResponse {

    httpStatus: string,
    timestamp: Date,
    message: string,
    path: string
    error: {
        httpStatus: string
        message: string
        path: string
        timestamp: Date
    }
}