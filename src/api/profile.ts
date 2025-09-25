import axios from "axios";
import type { Profile } from "../types/profile";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

function normalizeUrl(u?: string | null): string | null {
  if (!u) return null;
  if (u.startsWith("/")) return `${API_BASE}${u}`;
  return u;
}

export async function fetchMyProfile(): Promise<Profile> {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API_BASE}/api/v1/auth/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const d = res.data?.data as {
    id: number | string;
    username: string;
    name: string;
    avatar?: string | null;
    banner?: string | null;
    bio?: string | null;
    follower_count: number;
    following_count: number;
  };

  return {
    id: d.id,
    username: d.username,
    name: d.name,
    avatar: normalizeUrl(d.avatar),
    banner: normalizeUrl(d.banner),
    bio: d.bio ?? "",
    followers: d.follower_count ?? 0,
    following: d.following_count ?? 0,
  };
}

export async function updateMyProfile(data: {
  name?: string;
  username?: string;
  profile_photo?: File | null;
  banner_photo?: File | null;
}) {
  const token = localStorage.getItem("token");
  const fd = new FormData();
  if (data.name) fd.append("name", data.name);
  if (data.username) fd.append("username", data.username);
  if (data.profile_photo) fd.append("profile_photo", data.profile_photo);
  if (data.banner_photo) fd.append("banner_photo", data.banner_photo);

  return axios.patch(`${API_BASE}/api/v1/auth/me`, fd, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
}
