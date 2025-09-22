import { useState } from "react";
import { useSelector } from "react-redux";
import { createThread } from "../api/thread";
import { selectMe } from "../store/profileSlice";
import type { RootState } from "../store";
import type { ThreadUser } from "../types/thread";

type Props = {
  onPosted?: () => void;
  currentUser?: ThreadUser;
};

export default function ThreadForm({ onPosted, currentUser }: Props) {
  const me = useSelector((s: RootState) => selectMe(s));
  const username = currentUser?.username ?? me?.username ?? "guest";
  const profilePic = currentUser?.profile_picture ?? me?.avatar ?? null;

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarUrl =
    profilePic ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
      username
    )}`;

  async function handleSubmit() {
    if (loading || (!content.trim() && !file)) return;
    setLoading(true);
    setError(null);
    try {
      await createThread(content, file || undefined);
      setContent("");
      setFile(null);
      onPosted?.();
    } catch (e: any) {
      setError(e?.message || "Failed to create thread");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-3">
      <div className="bg-zinc-950 shadow-sm backdrop-blur-sm border-b border-zinc-800/60">
        <div className="flex gap-3 p-3">
          {/* Avatar */}
          <img
            src={avatarUrl}
            alt={username}
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-zinc-800"
          />

          {/* Input */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "0px";
                el.style.height = el.scrollHeight + "px";
              }}
              placeholder="Write a thread..."
              className="w-full resize-none rounded-md bg-transparent px-2 py-1.5
                         text-zinc-100 placeholder:text-zinc-500 outline-none
                         focus:ring-2 focus:ring-zinc-900"
              rows={1}
              style={{ overflow: "hidden", minHeight: "48px" }}
            />

            <div className="mt-2 flex items-center gap-2">
              <label
                htmlFor="thread-image"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-800/60 bg-zinc-900/60 px-2.5 py-1 text-sm text-zinc-300 hover:bg-zinc-800/60"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M21 5a2 2 0 0 0-2-2H5C3.9 3 3 3.9 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zM8 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm11 9-4.5-6-3.5 4.5-2.5-3L5 17h14z" />
                </svg>
                Image
              </label>
              <input
                id="thread-image"
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
                onClick={handleSubmit}
                disabled={loading || (!content.trim() && !file)}
                className="ml-auto rounded-full bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>

            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
