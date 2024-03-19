export interface LoginSignupUser {
  email: string;
  password: string;
}
export interface Login {
  code: string;
  redirectUri: string;
}

export interface Logout {
  refreshToken: string;
  accessToken: string;
}

export interface LoginUserData {
  access_token: string;
  roles?: string[];
  role: string;
  user_name: string;
  email: string;
}

export interface ChangePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
}
