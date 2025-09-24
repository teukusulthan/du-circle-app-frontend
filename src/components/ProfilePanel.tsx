import { Pencil } from "lucide-react";
import { ProfilePanelType } from "../types/profile";

export default function ProfilePanel({
  user,
  suggestions = [],
  onEdit,
  onFollowToggle,
}: ProfilePanelType) {
  const avatar =
    user.avatar ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
      user.username
    )}`;

  return (
    <aside className="hidden lg:block sticky top-0 h-screen overflow-auto p-4 space-y-4">
      {/* Profile Card */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
        <div
          className="h-20 w-full rounded-t-xl bg-zinc-900/60"
          style={
            user.cover_photo
              ? {
                  backgroundImage: `url(${user.cover_photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />

        <div className="p-4 pt-0">
          <div className="-mt-8 mb-3 flex items-center gap-3">
            <img
              src={avatar}
              alt={user.username}
              className="h-16 w-16 rounded-full border-2 border-zinc-900 object-cover"
            />

            <button
              onClick={onEdit}
              className="ml-auto flex items-center gap-1 rounded-full bg-zinc-100 text-zinc-900 px-3 py-1 text-sm font-semibold hover:bg-zinc-300"
            >
              <Pencil size={16} />
              Edit
            </button>
          </div>

          <p className="text-lg font-semibold text-zinc-100">{user.name}</p>
          <p className="text-sm text-zinc-400">@{user.username}</p>
          {user.bio && <p className="mt-2 text-sm text-zinc-300">{user.bio}</p>}

          <div className="mt-3 flex gap-4 text-sm text-zinc-300">
            <span>
              <strong className="text-zinc-100">{user.following}</strong>{" "}
              Following
            </span>
            <span>
              <strong className="text-zinc-100">{user.followers}</strong>{" "}
              Followers
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Users */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
        <h3 className="font-semibold mb-3">Suggested for you</h3>
        <ul className="space-y-3">
          {suggestions.map((s) => {
            const avatarSug =
              s.avatar ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                s.username
              )}`;
            return (
              <li key={s.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={avatarSug} className="h-9 w-9 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      {s.name}
                    </p>
                    <p className="text-xs text-zinc-500">@{s.username}</p>
                  </div>
                </div>

                <button
                  onClick={() => onFollowToggle?.(s.username)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    s.isFollowing
                      ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                      : "bg-zinc-100 text-zinc-900 hover:bg-zinc-300"
                  }`}
                >
                  {s.isFollowing ? "Following" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4 text-xs text-zinc-400">
        <p>Developed by Teuku Sulthan</p>
        <p className="text-zinc-500">
          © 2025 Teuku Sulthan • All rights reserved
        </p>
      </div>
    </aside>
  );
}
