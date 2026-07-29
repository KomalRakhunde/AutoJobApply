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
    { email: string; password: string; firstName?: string; lastName?: string }
  >({
    mutationFn: (body) => apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body,
    }),
  });
}

export function useLogin() {
  return useMutation<LoginResponse, ApiError, { email: string; password: string }>({
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
