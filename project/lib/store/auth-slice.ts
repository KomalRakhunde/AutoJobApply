import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, UserRole } from '../types';

export interface AuthState {
  token: string | null;
  user: (Pick<User, 'id' | 'email'> & { role?: UserRole }) | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  isAuthenticated: boolean;
}

const loadInitial = (): AuthState => {
  if (typeof window === 'undefined') {
    return { token: null, user: null, status: 'idle', isAuthenticated: false };
  }
  try {
    const token = localStorage.getItem('applyai_token');
    const userJson = localStorage.getItem('applyai_user');
    let user: (Pick<User, 'id' | 'email'> & { role?: UserRole }) | null = null;
    if (userJson) {
      try {
        user = JSON.parse(userJson);
      } catch {
        user = null;
      }
    }
    const isAuth = !!(token && user);
    return {
      token,
      user,
      status: isAuth ? 'authenticated' : 'unauthenticated',
      isAuthenticated: isAuth,
    };
  } catch {
    return { token: null, user: null, status: 'unauthenticated', isAuthenticated: false };
  }
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
        user: Pick<User, 'id' | 'email'> & { role?: UserRole };
      }>
    ) {
      state.token = action.payload.token;
      state.user = {
        ...action.payload.user,
        role: action.payload.user.role ? (action.payload.user.role.toLowerCase() as UserRole) : 'student',
      };
      state.status = 'authenticated';
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('applyai_token', action.payload.token);
        localStorage.setItem('applyai_user', JSON.stringify(state.user));
      }
    },
    setRole(state, action: PayloadAction<UserRole>) {
      if (state.user) {
        state.user.role = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem('applyai_user', JSON.stringify(state.user));
          document.cookie = `applyai_role=${action.payload}; path=/; max-age=604800; SameSite=Lax`;
        }
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'unauthenticated';
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('applyai_token');
        localStorage.removeItem('applyai_user');
        document.cookie = 'applyai_token=; path=/; max-age=0';
        document.cookie = 'applyai_role=; path=/; max-age=0';
      }
    },
  },
});

export const { setCredentials, setRole, logout } = authSlice.actions;
export default authSlice.reducer;
