import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { api } from "../api/client";
import FollowItem from "../components/FollowItem";
import type { FollowUser } from "../types/follow";

type SearchResp = {
  status: "success" | "error";
  message?: string;
  data?: {
    users: {
      id: string | number;
      username: string;
      name: string;
      followers: number;
    }[];
  };
};

export default function Search() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
            avatar: null,
            is_following: false,
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

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-200">
      <div className="px-4 pb-3">
        {/* Input */}
        <div className="relative mt-4">
          <UserPlus
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={20}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search user..."
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
            <span className="text-zinc-400">No users found.</span>
          )}
        </div>

        {/* Results*/}
        <div className="mt-1 divide-y divide-zinc-900">
          {users.map((u) => (
            <FollowItem key={String(u.id)} user={u} />
          ))}
        </div>
      </div>
    </div>
  );
}
