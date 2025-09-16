import ThreadList from "../components/ThreadList";

export default function Home() {
  return (
    <div>
      {/*Header */}
      <h1 className="my-3 mx-5 font-semibold text-2xl">Home</h1>
      {/* Feed */}
      <ThreadList />
    </div>
  );
}
