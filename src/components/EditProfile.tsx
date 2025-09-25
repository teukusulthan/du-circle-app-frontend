import { useEffect, useState } from "react";
import { updateMyProfile } from "../api/profile";
import { Pencil } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  initial: {
    name: string;
    username: string;
    avatar: string | null;
    banner: string | null;
  };
  onSuccess?: () => void;
};

export default function EditProfile({
  open,
  onClose,
  initial,
  onSuccess,
}: Props) {
  // Local state
  const [name, setName] = useState(initial.name);
  const [username, setUsername] = useState(initial.username);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initial.avatar ?? null
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    initial.banner ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initial.name);
      setUsername(initial.username);
      setAvatarFile(null);
      setBannerFile(null);
      setAvatarPreview(initial.avatar ?? null);
      setBannerPreview(initial.banner ?? null);
      setError(null);
    }
  }, [open, initial]);

  // Submit Handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateMyProfile({
        name: name !== initial.name ? name : undefined,
        username: username !== initial.username ? username : undefined,
        profile_photo: avatarFile,
        banner_photo: bannerFile,
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update profile";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      aria-hidden={!open}
      className={[
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/70 transition-all duration-500",
        open
          ? "backdrop-blur-sm opacity-100 pointer-events-auto"
          : "backdrop-blur-0 opacity-0 pointer-events-none",
      ].join(" ")}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div
          className={[
            "transition-all duration-500",
            open
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-2 scale-95 opacity-0",
          ].join(" ")}
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-5">
              Edit Profile
            </h2>

            {/* Banner Preview */}
            <div className="mb-5 relative h-32 w-full rounded-xl border border-zinc-800 overflow-hidden group">
              <div
                className="absolute inset-0 bg-zinc-900 pointer-events-none transition duration-300 group-hover:brightness-75"
                style={
                  bannerPreview
                    ? {
                        backgroundImage: `url(${bannerPreview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              />

              <label
                title="Change Banner"
                className="absolute inset-0 z-[9] cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setBannerFile(f);
                    setBannerPreview(
                      f ? URL.createObjectURL(f) : initial.banner ?? null
                    );
                  }}
                />
              </label>

              <label
                title="Change Banner"
                className="absolute bottom-2 right-2 z-20 flex items-center justify-center
                           h-8 w-8 rounded-full bg-zinc-100 text-zinc-900
                           cursor-pointer transition-colors duration-300
                           group-hover:bg-black/70 group-hover:text-white"
              >
                <Pencil
                  size={18}
                  className="transition-colors duration-300 group-hover:fill-white"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setBannerFile(f);
                    setBannerPreview(
                      f ? URL.createObjectURL(f) : initial.banner ?? null
                    );
                  }}
                />
              </label>
            </div>

            {/* Avatar Preview  */}
            <div className="relative mt-[-60px] pl-4 z-10 flex items-center gap-4">
              <div className="relative h-20 w-20 group">
                <img
                  src={
                    avatarPreview ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                      initial.username
                    )}`
                  }
                  className="h-20 w-20 rounded-full object-cover border-4 border-zinc-950 shadow-sm transition duration-300 group-hover:brightness-75"
                  alt="Avatar"
                />

                <label
                  title="Change Avatar"
                  className="absolute inset-0 z-[9] cursor-pointer rounded-full"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setAvatarFile(f);
                      setAvatarPreview(
                        f ? URL.createObjectURL(f) : initial.avatar ?? null
                      );
                    }}
                  />
                </label>

                <label
                  title="Change Avatar"
                  className="absolute bottom-1 right-1 flex items-center justify-center
                             h-7 w-7 rounded-full bg-zinc-100 text-zinc-900
                             cursor-pointer transition-colors duration-300 z-10
                             group-hover:bg-black/70 group-hover:text-white"
                >
                  <Pencil
                    size={16}
                    className="transition-colors duration-300 group-hover:fill-white"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setAvatarFile(f);
                      setAvatarPreview(
                        f ? URL.createObjectURL(f) : initial.avatar ?? null
                      );
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              {/* Full name */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/40 px-4 py-2 text-zinc-200 placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition"
                  placeholder="Your name"
                  maxLength={80}
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/40 px-4 py-2 text-zinc-200 placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition"
                  placeholder="Username"
                  maxLength={20}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  3–20 characters, unique.
                </p>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-5 py-2 text-sm bg-zinc-900 text-zinc-200 hover:bg-zinc-800 transition cursor-pointer disabled:opacity-60"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full px-5 py-2 text-sm font-semibold bg-zinc-100 text-zinc-900 hover:bg-zinc-300 cursor-pointer transition disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
