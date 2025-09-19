import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import type { Thread } from "../types/thread";
import { likeThread } from "../api/thread";

type Props = { t: Thread };

export default function ThreadCard({ t }: Props) {
  const [isLiked, setIsLiked] = useState(t.isLiked);
  const [likes, setLikes] = useState(t.likes);
  const navigate = useNavigate(); // ⬅️ untuk pindah halaman

  const profilePicture =
    t.user.profile_picture ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
      t.user.username
    )}`;

  const dt = new Date(t.created_at);
  const mobileDate = dt.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const desktopDate = dt.toLocaleString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  async function handleLike() {
    setIsLiked((prev) => !prev);
    setLikes((prev) => prev + (isLiked ? -1 : 1));
    try {
      const result = await likeThread(t.id);
      setIsLiked(result.isLiked);
      setLikes(result.likes);
    } catch {
      setIsLiked(t.isLiked);
      setLikes(t.likes);
    }
  }

  return (
    <article
      className="px-4 py-4 border-b border-zinc-900 cursor-pointer"
      onClick={() => navigate(`/threads/${t.id}`)}
    >
      <div className="flex gap-3">
        <img
          src={profilePicture}
          alt={t.user.username}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-1 sm:gap-2 overflow-hidden">
            <span className="font-semibold text-sm sm:text-base truncate max-w-[45%]">
              {t.user.name}
            </span>
            <span className="text-xs sm:text-sm text-zinc-500 truncate max-w-[35%]">
              @{t.user.username}
            </span>
            <span className="ml-auto sm:hidden text-xs text-zinc-600 whitespace-nowrap">
              · {mobileDate}
            </span>
            <span className="ml-auto hidden sm:inline text-sm text-zinc-600 whitespace-nowrap">
              · {desktopDate}
            </span>
          </div>

          {/* Konten */}
          <div className="mt-1 text-sm text-zinc-300 whitespace-pre-wrap break-words leading-relaxed">
            {t.content}
          </div>

          {/* Gambar */}
          {t.image && (
            <img
              src={t.image}
              alt=""
              className="mt-3 w-full max-h-130 rounded-xl border border-zinc-800 object-cover"
            />
          )}

          {/* Actions */}
          <div
            className="mt-3 flex items-center gap-6 text-zinc-400 text-sm"
            onClick={(e) => e.stopPropagation()} // agar klik tombol tidak ikut buka detail
          >
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-1 hover:text-zinc-200 transition-colors ${
                isLiked ? "text-red-400" : ""
              }`}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              <span>{likes}</span>
            </button>

            {/* tombol reply juga ke detail */}
            <button
              onClick={() => navigate(`/threads/${t.id}`)}
              className="inline-flex items-center gap-1 hover:text-zinc-200"
            >
              <MessageCircle size={18} />
              <span>{t.reply} Replies</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
