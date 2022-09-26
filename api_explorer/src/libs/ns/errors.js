

export class ServiceError extends Error {
    constructor(error_code, data) {
        super(`${error_code}: ${data}`);
        this.error_code = error_code;
        this.data = data;
    }
}
