// ── Login ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: LoginUser;
  };
}

// ── Forget Password ───────────────────────────────────────────────────────────

export interface ForgetPasswordRequest {
  email: string;
}

export interface ForgetPasswordResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
  };
}

// ── Reset Password ────────────────────────────────────────────────────────────

export interface ResetPasswordRequest {
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// ── Change Password ───────────────────────────────────────────────────────────

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}
