export interface AuthModel {

    message: string;
    isAuthenticated: boolean;
    username: string;
    email: string;
    roles: string[];
    token: string;
    expiresOn: string;
} 

export interface LoginModel {
    email: string;
    password: string;
}