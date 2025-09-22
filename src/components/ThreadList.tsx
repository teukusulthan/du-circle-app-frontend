import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThreadCard from "./ThreadCard";
import { fetchThreads } from "../api/thread";
import type { Thread } from "../types/thread";
import { createSocket } from "../utils/socket";
import { setThreads, upsert } from "../store/threadSlice";
import type { RootState } from "../store";

export default function ThreadsList() {
  const dispatch = useDispatch();
  const threads = useSelector((s: RootState) => s.threads.items);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchThreads(25);
        dispatch(setThreads(data));
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load threads");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

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
        image: p.image ?? p.image_url ?? null,
        created_at: p.created_at ?? p.timestamp,
        likes: p.likes ?? 0,
        isLiked: p.isLiked ?? false,
        reply: p.reply ?? 0,
      };
      dispatch(upsert(t));
    });

    socket.on("thread:updated", (p: any) => {
      const t: Thread = {
        id: Number(p.id),
        user: p.user,
        content: p.content,
        image: p.image ?? p.image_url ?? null,
        created_at: p.created_at ?? p.timestamp,
        likes: p.likes ?? 0,
        isLiked: p.isLiked ?? false,
        reply: p.reply ?? 0,
      };
      dispatch(upsert(t));
    });

    return () => {
      socket.off("thread:created");
      socket.off("thread:updated");
      socket.disconnect();
    };
  }, [dispatch]);

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
