import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "../types/profile";
import { fetchMyProfile } from "../api/profile";

type ProfileState = {
  me: Profile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: ProfileState = {
  me: null,
  status: "idle",
  error: null,
};

export const loadMyProfile = createAsyncThunk(
  "profile/loadMyProfile",
  async () => {
    const me = await fetchMyProfile();
    return me;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateMyProfileLocally: (
      state,
      action: PayloadAction<Partial<Profile>>
    ) => {
      if (!state.me) return;
      state.me = { ...state.me, ...action.payload };
    },

    clearProfile: (state) => {
      state.me = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMyProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadMyProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.me = action.payload;
      })
      .addCase(loadMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load profile";
      });
  },
});

export const { updateMyProfileLocally, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

export const selectMe = (s: { profile: ProfileState }) => s.profile.me;
export const selectProfileStatus = (s: { profile: ProfileState }) =>
  s.profile.status;
export const selectProfileError = (s: { profile: ProfileState }) =>
  s.profile.error;
