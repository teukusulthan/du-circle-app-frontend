import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";

import ProtectedRoute from "./utils/ProtectedRoute";
import HomeLayout from "./layouts/HomeLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ThreadDetail from "./components/ThreadDetail";
import Follow from "./pages/Follow";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import MyProfile from "./pages/MyProfile";

function App() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-400">Loading…</div>}>
      <Routes>
        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected + Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Navigate to="home" replace />} />

            <Route path="home" element={<Home />} />
            <Route path="threads/:id" element={<ThreadDetail />} />
            <Route path="follows" element={<Follow />} />
            <Route path="/search" element={<Search />} />
            <Route path="/me" element={<MyProfile />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
