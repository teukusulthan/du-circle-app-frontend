import { api } from "./client";
import type { FollowsTab, FollowUser } from "../types/follow";

type ActionData = { user_id: string | number; is_following: boolean };

function numericId(id: string | number): number {
  const n =
    typeof id === "number" ? id : Number(String(id).replace(/\D+/g, ""));
  if (!Number.isSafeInteger(n) || n <= 0) throw new Error("Invalid user id");
  return n;
}

function extractUsers(body: any): FollowUser[] {
  const candidates = [
    body?.data?.followers,
    body?.data?.following,
    body?.followers,
    body?.following,
    body?.data,
  ];
  for (const c of candidates) if (Array.isArray(c)) return c as FollowUser[];
  return [];
}

export async function listFollows(type: FollowsTab): Promise<FollowUser[]> {
  const { data: body } = await api.get("/follows", { params: { type } });
  if (body?.status === "error")
    throw new Error(body?.message || "Failed to load follows");

  const users = extractUsers(body);

  return type === "following"
    ? users.map((u) => ({ ...u, is_following: true }))
    : users;
}

export async function followUser(id: string | number): Promise<ActionData> {
  const followed_user_id = numericId(id);
  const { data: body } = await api.post("/follow", { followed_user_id });
  if (body?.status === "error")
    throw new Error(body?.message || "Failed to follow");
  return body?.data as ActionData;
}

export async function unfollowUser(id: string | number): Promise<ActionData> {
  const followed_id = numericId(id);
  const { data: body } = await api.delete("/follow", {
    data: { followed_id },
  });
  if (body?.status === "error")
    throw new Error(body?.message || "Failed to unfollow");
  return body?.data as ActionData;
}
