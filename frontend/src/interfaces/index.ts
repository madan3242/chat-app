export interface UserInterface {
    _id: string;
    avatar: string;
    username: string;
    email: string;
}

export interface ApiResponseInterface {
    data: any,
    message: string,
    statusCode: number,
    success: boolean
}