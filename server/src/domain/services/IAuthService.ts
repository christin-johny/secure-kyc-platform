export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthService {
  registerUser(name: string, email: string, password: string): Promise<IAuthTokens>;
  loginUser(email: string, password: string): Promise<IAuthTokens>;
  refreshAccessToken(refreshToken: string): string;
}
