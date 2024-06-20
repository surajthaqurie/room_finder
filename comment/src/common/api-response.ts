interface IAppResponse<T> {
    success: boolean;
    data: T;
    message: string;
    status: number;
}

export class AppResponse<T> implements IAppResponse<T> {
    data: T;
    message: string;
    status: number;
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
        this.status = status;
        return this;
    }
}
