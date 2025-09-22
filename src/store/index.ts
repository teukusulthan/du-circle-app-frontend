import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import threadReducer from "./threadSlice";
import profileReducer from "./profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
