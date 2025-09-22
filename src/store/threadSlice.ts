import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Thread } from "../types/thread";
import { likeThread } from "../api/thread";

interface ThreadsState {
  items: Thread[];
}

const initialState: ThreadsState = { items: [] };

export const toggleLikeThread = createAsyncThunk<
  { id: number; isLiked: boolean; likes: number },
  number,
  { state: { threads: ThreadsState } }
>("threads/toggleLike", async (id) => {
  const result = await likeThread(id); // { isLiked, likes }
  return { id, isLiked: result.isLiked, likes: result.likes };
});

const threadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    setThreads(state, action: PayloadAction<Thread[]>) {
      state.items = action.payload;
    },
    upsert(state, action: PayloadAction<Thread>) {
      const t = action.payload;
      const idx = state.items.findIndex((x) => x.id === t.id);
      if (idx >= 0) state.items[idx] = { ...state.items[idx], ...t };
      else state.items.unshift(t);
    },
    optimisticToggle(state, action: PayloadAction<number>) {
      const t = state.items.find((x) => x.id === action.payload);
      if (!t) return;
      t.isLiked = !t.isLiked;
      t.likes = t.likes + (t.isLiked ? 1 : -1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleLikeThread.fulfilled, (state, action) => {
      const { id, isLiked, likes } = action.payload;
      const t = state.items.find((x) => x.id === id);
      if (t) {
        t.isLiked = isLiked;
        t.likes = likes;
      }
    });
  },
});

export const { setThreads, upsert, optimisticToggle } = threadsSlice.actions;
export default threadsSlice.reducer;
