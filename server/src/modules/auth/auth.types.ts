export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResendVerificationInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}
