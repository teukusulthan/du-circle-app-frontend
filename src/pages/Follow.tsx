import { useEffect, useMemo, useState } from "react";
import FollowItem from "../components/FollowItem";
import { listFollows, followUser, unfollowUser } from "../api/follow";
import type { FollowsTab, FollowUser } from "../types/follow";

export default function FollowsPage() {
  const [tab, setTab] = useState<FollowsTab>("followers");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listFollows(tab);
        if (alive) setUsers(data);
      } catch (e: any) {
        if (alive) setError(e.message || "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tab]);

  // Filter Search
  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return users;
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(key) ||
        u.name.toLowerCase().includes(key)
    );
  }, [q, users]);

  // Handlers
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
    if (tab === "following") {
      const prev = users;
      setUsers((p) => p.filter((u) => u.id !== id));
      try {
        await unfollowUser(id);
      } catch {
        setUsers(prev);
      }
      return;
    }

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
    <main className="min-h-screen bg-zinc-950 text-zinc-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur border-b border-zinc-900">
        <div className="px-4 py-3">
          <h1 className="font-semibold text-lg">Follows</h1>
        </div>

        {/* Tabs */}
        <div className="px-2">
          <div className="grid grid-cols-2">
            <button
              className={`py-3 text-center font-medium ${
                tab === "followers"
                  ? "text-white border-b-2 border-white"
                  : "text-zinc-400"
              }`}
              onClick={() => setTab("followers")}
            >
              Followers
            </button>
            <button
              className={`py-3 text-center font-medium ${
                tab === "following"
                  ? "text-white border-b-2 border-white"
                  : "text-zinc-400"
              }`}
              onClick={() => setTab("following")}
            >
              Following
            </button>
          </div>

          {/* Search */}
          <div className="px-2 pb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search people..."
              className="mt-4 w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 outline-none focus:border-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-6 text-sm text-zinc-400">Loading…</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-400">Error: {error}</div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-sm text-zinc-400">
          {tab === "followers"
            ? "You don’t have any followers yet."
            : "You aren’t following anyone yet."}
        </div>
      ) : (
        <div>
          {filtered.map((u) => (
            <FollowItem
              key={String(u.id)}
              user={u}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          ))}
        </div>
      )}
    </main>
  );
}
