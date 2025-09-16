import { Heart, MessageCircle } from "lucide-react";
import type { Thread } from "../types/thread";

type Props = { t: Thread; onToggleLike?: (id: number) => void };

export default function ThreadCard({ t, onToggleLike }: Props) {
  const ProfilePicture =
    t.user.profile_picture ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
      t.user.username
    )}`;

  return (
    <article className="px-4 py-4 border-b border-zinc-900">
      <div className="flex gap-3">
        <img
          src={ProfilePicture}
          alt={t.user.username}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t.user.name}</span>
            <span className="text-sm text-zinc-500">@{t.user.username}</span>
            <span className="text-sm text-zinc-600">
              · {new Date(t.created_at).toLocaleString()}
            </span>
          </div>

          <p className="mt-1 text-sm text-zinc-300">{t.content}</p>

          {t.image ? (
            <img
              src={t.image}
              alt=""
              className="mt-3 max-h-130 max-w-full rounded-xl border border-zinc-800 object-cover"
            />
          ) : null}

          <div className="mt-3 flex items-center gap-6 text-zinc-400">
            <button
              onClick={() => onToggleLike?.(t.id)}
              className={`inline-flex items-center gap-1 hover:text-zinc-200 ${
                t.isLiked ? "text-red-400" : ""
              }`}
            >
              <Heart size={18} fill={t.isLiked ? "currentColor" : "none"} />
              <span>{t.likes}</span>
            </button>

            <div className="inline-flex items-center gap-1">
              <MessageCircle size={18} />
              <span>{t.reply} Replies</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
