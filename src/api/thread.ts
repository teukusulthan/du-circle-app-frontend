import { api } from "./client";
import type { Thread } from "../types/thread";
import type { Reply } from "../types/reply";

export async function fetchThreads(limit = 25): Promise<Thread[]> {
  const { data } = await api.get(`/threads?limit=${limit}`);

  return data?.data?.threads ?? [];
}

export async function fetchThread(id: number) {
  const { data } = await api.get(`/thread/${id}`);

  return data.data;
}

export async function createThread(
  content: string,
  image?: File | null
): Promise<Thread> {
  const fd = new FormData();
  fd.append("content", content);
  if (image) fd.append("image", image);

  const { data } = await api.post("/threads", fd);

  return data.data.thread;
}

export async function likeThread(id: number) {
  const { data } = await api.post(`/thread/${id}/like`);

  return data.data;
}

export async function fetchThreadById(id: number): Promise<Thread> {
  const { data } = await api.get(`/thread/${id}`);
  return data?.data?.thread ?? data?.data ?? data;
}

export async function fetchReplies(
  threadId: number,
  limit = 50
): Promise<Reply[]> {
  const { data } = await api.get(`/thread/${threadId}/replies?limit=${limit}`);
  return data?.data?.replies ?? data?.data ?? data;
}

export async function createReply(
  threadId: number,
  content: string,
  image?: File | null
) {
  const fd = new FormData();
  fd.append("content", content);
  if (image) fd.append("image", image);
  const { data } = await api.post(`/thread/${threadId}/replies`, fd);
  return data?.data?.reply ?? data?.data ?? data;
}
