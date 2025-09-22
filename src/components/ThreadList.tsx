import { useEffect, useState } from "react";
import ThreadCard from "./ThreadCard";
import { fetchThreads } from "../api/thread";
import type { Thread } from "../types/thread";
import { createSocket } from "../utils/socket";

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

  const upsert = (incoming: Thread) => {
    setThreads((prev) => {
      const exist = prev.find((x) => x.id === incoming.id);
      if (exist) {
        return prev.map((x) =>
          x.id === incoming.id ? { ...x, ...incoming } : x
        );
      }
      return [incoming, ...prev];
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = createSocket(token);

    socket.on("connect_error", (err) => {
      console.error("WS connect error:", err.message);
    });

    socket.on("thread:created", (p: any) => {
      const t: Thread = {
        id: Number(p.id),
        user: p.user,
        content: p.content,
        image: p.image_url ?? null,
        created_at: p.created_at,
        likes: 0,
        isLiked: false,
        reply: 0,
      };
      upsert(t);
    });

    socket.on("thread:updated", (p: any) => {
      upsert({
        id: Number(p.id),
        user: p.user,
        content: p.content,
        image: p.image_url ?? null,
        created_at: p.timestamp,
        likes: p.likes ?? 0,
        isLiked: false,
        reply: p.replies ?? 0,
      } as Thread);
    });

    return () => {
      socket.off("thread:created");
      socket.off("thread:updated");
      socket.disconnect();
    };
  }, []);

  if (loading) return <p className="p-4 text-zinc-400">Loading feed…</p>;
  if (error) return <p className="p-4 text-center text-red-400">{error}</p>;
  if (!threads.length)
    return <p className="p-4 text-center text-zinc-400">No threads yet.</p>;

  return (
    <div>
      {threads.map((t) => (
        <ThreadCard key={t.id} t={t} />
      ))}
    </div>
  );
}
