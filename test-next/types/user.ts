export interface User {
	id: number;
	username: string;
	password?: string;
	token?: string;
}
export interface UserLogin {
	username: string;
	password: string;
}
export interface UserLoginErrors {
	username?: string;
	password?: string;
	formError?: string;
}
export interface Token {
	token: string;
}
export interface LoginResponse {
	error: boolean;
	message: string;
	token?: string;
}
export interface HomeResponse {
	error: boolean;
	message: string;
	userData?: User;
}
