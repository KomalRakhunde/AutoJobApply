import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

export interface AuthState {
  token: string | null;
  user: Pick<User, 'id' | 'email'> | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
}

const loadInitial = (): AuthState => {
  if (typeof window === 'undefined') {
    return { token: null, user: null, status: 'idle' };
  }
  const token = localStorage.getItem('applyai_token');
  const userJson = localStorage.getItem('applyai_user');
  const user = userJson ? (JSON.parse(userJson) as Pick<User, 'id' | 'email'>) : null;
  return {
    token,
    user,
    status: token && user ? 'authenticated' : 'unauthenticated',
  };
};

const initialState: AuthState = loadInitial();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        token: string;
        user: Pick<User, 'id' | 'email'>;
      }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = 'authenticated';
      if (typeof window !== 'undefined') {
        localStorage.setItem('applyai_token', action.payload.token);
        localStorage.setItem(
          'applyai_user',
          JSON.stringify(action.payload.user)
        );
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'unauthenticated';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('applyai_token');
        localStorage.removeItem('applyai_user');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
