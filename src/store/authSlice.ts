import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  userId: number | null;
  username: string | null;
  roles: string[];
  isAuthenticated: boolean;
}

// Initial state reads from localStorage if available (client-side only)
const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  userId: null,
  username: typeof window !== 'undefined' ? localStorage.getItem('username') : null,
  roles: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('roles') || '[]') : [],
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; userId: number; username: string; roles: string[] }>
    ) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.username);
        localStorage.setItem('roles', JSON.stringify(action.payload.roles));
      }
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.username = null;
      state.roles = [];
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('roles');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
