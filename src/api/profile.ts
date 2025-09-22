import axios from "axios";
import type { Profile } from "../types/profile";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function fetchMyProfile(): Promise<Profile> {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE}/api/v1/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const d = res.data?.data as {
    id: number | string;
    username: string;
    name: string;
    avatar?: string | null;
    cover_photo?: string | null;
    bio?: string | null;
    follower_count: number;
    following_count: number;
  };

  return {
    id: d.id,
    username: d.username,
    name: d.name,
    avatar: d.avatar ?? null,
    cover_photo: d.cover_photo ?? null,
    bio: d.bio ?? "",
    followers: d.follower_count ?? 0,
    following: d.following_count ?? 0,
  };
}
