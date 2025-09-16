import Sidebar from "../components/Sidebar";
import ProfilePanel from "../components/ProfilePanel";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex">
      <div className="hidden md:block shrink-0 w-64">
        <Sidebar />
      </div>

      <main className="flex-1 min-w-0 md:border-x md:border-zinc-800">
        {children}
      </main>

      <div className="hidden lg:block shrink-0 w-[340px]">
        <ProfilePanel
          user={{
            name: "Teuku Sulthan",
            username: "teukusulthan",
            bio: "Kalo hidupmu membosankan, coba belajar React.",
            following: 128,
            followers: 927,
          }}
          suggestions={[
            {
              id: 1,
              name: "Ananda Steven Firdaus",
              username: "freikugel",
              isFollowing: true,
            },
            { id: 2, name: "Alvin Richardo", username: "WeyGen" },
            { id: 3, name: "Fernando Lie", username: "Fernando_lie" },
          ]}
        />
      </div>
    </div>
  );
}
