import { useMutation } from '@tanstack/react-query';
import { apiRequest, ApiError } from '../api';
import type {
  LoginResponse,
  Profile,
  RegisterResponse,
  UpdateProfileDto,
  UpdateUserDto,
  User,
} from '../types';

export function useRegister() {
  return useMutation<
    RegisterResponse,
    ApiError,
    { email: string; password: string; firstName?: string; lastName?: string; role?: string }
  >({
    mutationFn: (body) => apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body,
    }),
  });
}

export function useLogin() {
  return useMutation<LoginResponse, ApiError, { email: string; password: string; selectedRole: string }>({
    mutationFn: (body) =>
      apiRequest<LoginResponse>('/auth/login', { method: 'POST', body }),
  });
}

export function useGetUser(userId: string, enabled: boolean) {
  return useMutation<User, ApiError, void>({
    mutationFn: () => apiRequest<User>(`/users/${userId}`, { auth: true }),
  });
}

export function useUpdateUser() {
  return useMutation<User, ApiError, { id: string; body: UpdateUserDto }>({
    mutationFn: ({ id, body }) =>
      apiRequest<User>(`/users/${id}`, { method: 'PATCH', body, auth: true }),
  });
}

export function useForgotPassword() {
  return useMutation<{ success: boolean; message: string; resetUrl?: string }, ApiError, { email: string; captchaToken: string }>({
    mutationFn: (body) =>
      apiRequest<{ success: boolean; message: string; resetUrl?: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body,
      }),
  });
}

export function useResetPassword() {
  return useMutation<{ success: boolean; message: string }, ApiError, { token: string; email: string; newPassword: string }>({
    mutationFn: (body) =>
      apiRequest<{ success: boolean; message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body,
      }),
  });
}
