import { api } from "./client";
import type { Thread } from "../types/thread";

export async function fetchThreads(limit = 25): Promise<Thread[]> {
  const { data } = await api.get(`/threads?limit=${limit}`);

  return data?.data?.threads ?? [];
}
