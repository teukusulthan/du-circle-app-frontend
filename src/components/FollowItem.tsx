import { useState } from "react";
import type { FollowUser } from "../types/follow";

type Props = {
  user: FollowUser;
  onFollow?: (id: string | number) => Promise<void>;
  onUnfollow?: (id: string | number) => Promise<void>;
};

export default function FollowItem({ user, onFollow, onUnfollow }: Props) {
  const [busy, setBusy] = useState(false);

  const avatar =
    user.avatar ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
      String(user.username)
    )}`;

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (user.is_following) await onUnfollow?.(user.id);
      else await onFollow?.(user.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="px-4 py-3 border-b border-zinc-900 bg-zinc-950">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={String(user.username)}
          className="h-11 w-11 rounded-full object-cover bg-zinc-800"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{user.name}</span>
            <span className="text-sm text-zinc-500 truncate">
              @{user.username}
            </span>
          </div>
        </div>

        <button
          onClick={handleClick}
          disabled={busy}
          className={`px-4 py-1.5 rounded-full text-sm border transition
            ${
              user.is_following
                ? "bg-transparent border-zinc-600 text-zinc-200 hover:bg-zinc-900"
                : "bg-zinc-100 text-zinc-900 border-zinc-100 hover:bg-white"
            }
            disabled:opacity-60`}
        >
          {busy ? "…" : user.is_following ? "Following" : "Follow"}
        </button>
      </div>
    </article>
  );
}
