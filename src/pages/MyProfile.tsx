import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  selectMe,
  selectProfileStatus,
  loadMyProfile,
} from "../store/profileSlice";
import EditProfile from "../components/EditProfile";
import { Pencil } from "lucide-react";

export default function MyProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const me = useSelector((s: RootState) => selectMe(s));
  const status = useSelector((s: RootState) => selectProfileStatus(s));
  const [openEdit, setOpenEdit] = useState(false);

  if (status === "loading" || !me) {
    return (
      <div className="min-h-[calc(100vh-1px)] w-full bg-zinc-950">
        <section className="relative h-56 md:h-64 w-full bg-zinc-900 animate-pulse" />
        <div className="max-w-3xl mx-auto px-4 -mt-12 md:-mt-16">
          <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-zinc-800 border-4 border-zinc-950" />
          <div className="mt-6 h-6 w-44 bg-zinc-800 rounded" />
          <div className="mt-2 h-4 w-28 bg-zinc-800 rounded" />
          <div className="mt-6 h-16 w-full bg-zinc-900/50 rounded-xl" />
        </div>
      </div>
    );
  }

  const avatar =
    me.avatar ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
      me.username
    )}`;

  const followers = (me as any).followers ?? 0;
  const following = (me as any).following ?? 0;

  return (
    <div className="min-h-[calc(100vh-1px)] w-full bg-zinc-950">
      <section className="relative h-56 md:h-64 w-full bg-zinc-900">
        <div
          className="absolute inset-0"
          style={
            me.banner
              ? {
                  backgroundImage: `url(${me.banner})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />

        <div className="relative h-full max-w-3xl mx-auto px-4">
          <button
            onClick={() => setOpenEdit(true)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-900 px-4 py-2 text-sm font-semibold hover:bg-zinc-300 transition"
          >
            <Pencil size={16} />
            Edit Profile
          </button>

          <div className="absolute -bottom-12 left-4">
            <img
              src={avatar}
              alt={me.username}
              className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover border-4 border-zinc-950 shadow-lg"
            />
          </div>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4">
        <div className="pt-16 md:pt-20" />
        <header>
          <h1 className="text-2xl font-semibold text-zinc-100">{me.name}</h1>
          <p className="text-sm text-zinc-400">@{me.username}</p>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard label="Following" value={following} />
          <StatCard label="Followers" value={followers} />
        </section>

        <section className="mt-8 mb-16">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-zinc-400 text-sm">
              This is your profile page. Future contentcan live here.
            </p>
          </div>
        </section>
      </main>

      <EditProfile
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        initial={{
          name: me.name,
          username: me.username,
          avatar: me.avatar ?? null,
          banner: me.banner ?? null,
        }}
        onSuccess={() => dispatch(loadMyProfile())}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-sm">
      <div className="text-xl font-semibold text-zinc-100">{value}</div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </div>
    </div>
  );
}
