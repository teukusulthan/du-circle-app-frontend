import { useEffect, useState } from "react";
import { UserSearch } from "lucide-react";
import { api } from "../api/client";
import FollowItem from "../components/FollowItem";
import { followUser, unfollowUser } from "../api/follow";
import type { FollowUser } from "../types/follow";
import type { SearchResp } from "../types/search";

export default function Search() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Debounce
  useEffect(() => {
    const v = q.trim();
    const t = setTimeout(async () => {
      if (!v) return setUsers([]);
      try {
        setLoading(true);
        setErr(null);
        const { data } = await api.get<SearchResp>("/search", {
          params: { keyword: v, limit: 25 },
        });
        const raw = data?.data?.users ?? [];
        setUsers(
          raw.map((u) => ({
            id: u.id,
            username: u.username,
            name: u.name,
            avatar: u.avatar ?? null,
            is_following: Boolean(u.is_following),
          }))
        );
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Search failed");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  // Follow / Unfollow
  const handleFollow = async (id: string | number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_following: true } : u))
    );
    try {
      await followUser(id);
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_following: false } : u))
      );
    }
  };

  const handleUnfollow = async (id: string | number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_following: false } : u))
    );
    try {
      await unfollowUser(id);
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_following: true } : u))
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-200">
      <div className="px-4 pb-3 flex flex-col min-h-screen">
        {/* Search input */}
        <div className="relative mt-4">
          <UserSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={20}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search people..."
            className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-xl pl-10 pr-3 py-2 outline-none focus:border-zinc-600"
          />
        </div>

        {/* Status */}
        <div className="px-1 py-2 text-sm">
          {loading && <span className="text-zinc-400">Searching…</span>}
          {!loading && err && (
            <span className="text-red-400">Error: {err}</span>
          )}
          {!loading && !err && q.trim() && users.length === 0 && (
            <span className="text-zinc-400 text-">No users found.</span>
          )}
        </div>

        {/* Empty state */}
        {!q.trim() && !loading && !err && (
          <div className="flex-1 flex items-center justify-center mb-20">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <UserSearch size={82} className="text-zinc-600" />
              </div>
              <div className="font-medium text-zinc-300 text-2xl">
                Find people
              </div>
              <div className="text-md text-zinc-400">
                Type a username or name to start.
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {q.trim() && (
          <div className="mt-1 divide-y divide-zinc-900">
            {users.map((u) => (
              <FollowItem
                key={String(u.id)}
                user={u}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
