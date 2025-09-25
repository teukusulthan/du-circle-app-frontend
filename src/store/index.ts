import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "./authSlice";
import threadReducer from "./threadSlice";
import profileReducer from "./profileSlice";

const appReducer = combineReducers({
  auth: authReducer,
  threads: threadReducer,
  profile: profileReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction
) => {
  // Reset redux when logout
  if (action.type === logout.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
