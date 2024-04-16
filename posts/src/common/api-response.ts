interface IAppResponse<T> {
    success: boolean;
    data: T;
    message: string;
    statusCode: number;
}

export class AppResponse<T> implements IAppResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    success: boolean;

    constructor(message: string) {
        this.message = message;
    }

    setSuccessData(data: T): this {
        this.success = true;
        this.data = data;
        return this;
    }

    setStatus(status: number): this {
        this.statusCode = status;
        return this;
    }
}
