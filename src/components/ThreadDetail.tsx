import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ThreadCard from "../components/ThreadCard";
import { fetchThreadById, fetchReplies } from "../api/thread";
import type { Reply } from "../types/reply";
import type { Thread } from "../types/thread";
import ReplyForm from "./ReplyForm";

export default function ThreadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const threadId = Number(id);

  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [t, r] = await Promise.all([
          fetchThreadById(threadId),
          fetchReplies(threadId),
        ]);
        setThread(t);
        setReplies(r);
      } catch (e: any) {
        setError(e?.message || "Failed to load thread");
      } finally {
        setLoading(false);
      }
    })();
  }, [threadId]);

  if (!id || Number.isNaN(threadId))
    return <div className="p-4">Invalid thread id.</div>;
  if (loading) return <div className="p-4 text-zinc-400">Loading…</div>;
  if (error) return <div className="p-4 text-center text-red-400">{error}</div>;
  if (!thread)
    return <div className="p-4 text-zinc-400">Thread not found.</div>;

  return (
    <main className="pb-8">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 text-sm text-zinc-300 hover:text-white"
        >
          ←
        </button>
        <h1 className="text-xl font-semibold">Thread</h1>
      </div>

      {/* Main Threads */}
      <div className="mx-2 mb-3 rounded-2xl">
        <ThreadCard t={thread} />
      </div>

      <ReplyForm
        threadId={threadId}
        currentUser={{ username: "me", profile_picture: null }}
      />

      {/* Replies */}
      <section>
        {replies.length === 0 ? (
          <p className=" text-center py-6 text-sm text-zinc-500">
            No replies yet.
          </p>
        ) : (
          replies.map((r) => (
            <article key={r.id} className="px-4 py-4 border-b border-zinc-900">
              <div className="flex gap-3">
                <img
                  src={
                    r.user.profile_picture ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                      r.user.username
                    )}`
                  }
                  alt={r.user.username}
                  className="h-9 w-9 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 overflow-hidden">
                    <span className="font-semibold truncate max-w-[45%]">
                      {r.user.name}
                    </span>
                    <span className="text-sm text-zinc-500 truncate max-w-[35%]">
                      @{r.user.username}
                    </span>
                    <span className="ml-auto text-xs text-zinc-600 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Reply Content */}
                  <div className="mt-1 text-sm text-zinc-300 whitespace-pre-wrap break-words leading-relaxed">
                    {r.content}
                  </div>

                  {r.image && (
                    <img
                      src={r.image}
                      alt=""
                      className="mt-3 w-full rounded-xl border border-zinc-800 object-cover"
                    />
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
