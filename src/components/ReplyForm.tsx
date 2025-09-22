import { useState } from "react";
import { useSelector } from "react-redux";
import { createReply } from "../api/thread";
import { selectMe } from "../store/profileSlice";
import type { RootState } from "../store";

type User = { username: string; profile_picture?: string | null };

type Props = {
  threadId: number;
  currentUser?: User; // opsional: override user dari Redux
  onPosted?: () => void;
};

export default function ReplyForm({ threadId, currentUser, onPosted }: Props) {
  const me = useSelector((s: RootState) => selectMe(s));

  // PRIORITAS: Redux -> prop -> "guest"
  const username = me?.username ?? currentUser?.username ?? "guest";
  const profilePic = me?.avatar ?? currentUser?.profile_picture ?? null;

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatar =
    profilePic ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
      username
    )}`;

  async function submit() {
    if (loading || (!content.trim() && !file)) return;
    setLoading(true);
    setError(null);
    try {
      await createReply(threadId, content, file || undefined);
      setContent("");
      setFile(null);
      onPosted?.();
    } catch (e: any) {
      setError(e?.message || "Failed to reply");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-3 my-3 border-b border-zinc-800/60 bg-zinc-950 p-3">
      <div className="flex gap-3">
        <img
          src={avatar}
          alt={username}
          className="h-9 w-9 rounded-full ring-1 ring-zinc-800 object-cover"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "0px";
              el.style.height = el.scrollHeight + "px";
            }}
            placeholder="Type your reply.."
            className="w-full resize-none rounded-md bg-transparent px-2 py-1.5
                       text-zinc-100 placeholder:text-zinc-500 outline-none
                       focus:ring-2 focus:ring-zinc-900"
            rows={1}
            style={{ overflow: "hidden", minHeight: "44px" }}
          />

          <div className="mt-2 flex items-center gap-2">
            <label
              htmlFor="reply-image"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg
                         border border-zinc-800/60 bg-zinc-900/60 px-2.5 py-1
                         text-sm text-zinc-300 hover:bg-zinc-800/60"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M21 5a2 2 0 0 0-2-2H5C3.9 3 3 3.9 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zM8 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm11 9-4.5-6-3.5 4.5-2.5-3L5 17h14z" />
              </svg>
              Image
            </label>
            <input
              id="reply-image"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            {file && (
              <span className="truncate text-xs text-zinc-400">
                {file.name}
              </span>
            )}

            <button
              onClick={submit}
              disabled={loading || (!content.trim() && !file)}
              className="ml-auto rounded-full bg-green-600 px-4 py-1.5 text-sm
                         font-semibold text-white hover:bg-green-700
                         disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Posting..." : "Reply"}
            </button>
          </div>

          {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
