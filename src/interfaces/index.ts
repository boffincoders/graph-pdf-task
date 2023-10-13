export interface IBaseResponse<T> {
    statusCode: number;
    success: boolean;
    data?: T;
    message?: string;
}