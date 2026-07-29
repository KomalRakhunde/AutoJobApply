'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiError } from '../api';
import type { Profile, UpdateProfileDto } from '../types';

export function useGetProfile(userId: string | undefined) {
  return useQuery<Profile, ApiError>({
    queryKey: ['profile', userId],
    queryFn: () => apiRequest<Profile>(`/profiles/${userId}`, { auth: true }),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation<Profile, ApiError, { userId: string; body: UpdateProfileDto }>({
    mutationFn: ({ userId, body }) =>
      apiRequest<Profile>(`/profiles/${userId}`, {
        method: 'PATCH',
        body,
        auth: true,
      }),
    onSuccess: (data, vars) => {
      qc.setQueryData(['profile', vars.userId], data);
    },
  });
}
