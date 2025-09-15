import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = { id: number; username: string; email: string; full_name?: string };

interface AuthState {
  user: User | null;
  token: string | null;
}

function safeLoadUser(): User | null {
  const raw = localStorage.getItem("user");
  if (!raw || raw === "undefined" || raw === "null") return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: safeLoadUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ token: string; user?: User | null }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user ?? null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
