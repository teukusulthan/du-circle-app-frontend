import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { MobileSidebar, Sidebar } from "../components/Sidebar";
import ProfilePanel from "../components/ProfilePanel";
import EditProfile from "../components/EditProfile";
import {
  loadMyProfile,
  selectMe,
  selectProfileStatus,
} from "../store/profileSlice";
import type { Suggestion } from "../types/profile";
import type { RootState, AppDispatch } from "../store";

export default function HomeLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const me = useSelector((s: RootState) => selectMe(s));
  const status = useSelector((s: RootState) => selectProfileStatus(s));

  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const hasToken = !!localStorage.getItem("token");
    if (hasToken && status === "idle") {
      dispatch(loadMyProfile());
    }
  }, [status, dispatch]);

  const suggestions: Suggestion[] = [
    {
      id: 1,
      name: "Ananda Steven Firdaus",
      username: "freikugel",
      isFollowing: true,
    },
    { id: 2, name: "Alvin Richardo", username: "WeyGen" },
    { id: 3, name: "Fernando Lie", username: "Fernando_lie" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex">
      <div className="hidden md:block shrink-0 w-64">
        <Sidebar />
      </div>

      <div className="flex md:hidden shrink-0">
        <MobileSidebar />
      </div>

      <main className="flex-1 min-w-0 md:border-x md:border-zinc-800">
        {children ?? <Outlet />}
      </main>

      <div className="hidden lg:block shrink-0 w-[340px]">
        {status === "loading" ? (
          <aside className="sticky top-0 h-screen overflow-auto p-4 space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 animate-pulse">
              <div className="h-20 w-full bg-zinc-800/60 rounded-xl mb-4" />
              <div className="flex items-center gap-3 mb-3">
                <div className="h-16 w-16 rounded-full bg-zinc-800" />
                <div className="ml-auto h-7 w-20 rounded-full bg-zinc-800" />
              </div>
              <div className="h-4 w-40 bg-zinc-800 rounded mb-2" />
              <div className="h-3 w-28 bg-zinc-800 rounded" />
            </div>
          </aside>
        ) : me ? (
          <>
            <ProfilePanel
              user={me}
              suggestions={suggestions}
              onEdit={() => setOpenEdit(true)}
              onFollowToggle={(username) => {
                console.log("Toggle follow:", username);
              }}
            />
            <EditProfile
              open={openEdit}
              onClose={() => setOpenEdit(false)}
              initial={{
                name: me.name,
                username: me.username,
                avatar: me.avatar ?? null,
                banner: me.banner ?? null,
              }}
              onSuccess={() => {
                dispatch(loadMyProfile());
              }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
