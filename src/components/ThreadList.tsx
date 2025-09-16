import { useEffect, useState } from "react";
import ThreadCard from "./ThreadCard";
import { fetchThreads } from "../api/thread";
import type { Thread } from "../types/thread";

export default function ThreadsList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchThreads(25);
        setThreads(data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load threads");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleLike = (id: number) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              isLiked: !t.isLiked,
              likes: t.isLiked ? t.likes - 1 : t.likes + 1,
            }
          : t
      )
    );
  };

  if (loading) return <p className="p-4 text-zinc-400">Loading feed…</p>;
  if (error) return <p className="p-4 text-red-400">{error}</p>;
  if (!threads.length)
    return <p className="p-4 text-zinc-400">No threads yet.</p>;

  return (
    <div>
      {threads.map((t) => (
        <ThreadCard key={t.id} t={t} onToggleLike={toggleLike} />
      ))}
    </div>
  );
}
