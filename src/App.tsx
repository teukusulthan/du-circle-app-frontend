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

function App() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-400">Loading…</div>}>
      <Routes>
        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected + Layout (punya path "/") */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeLayout />}>
            {/* index untuk "/" → redirect ke /home (atau langsung taruh <Home/> di index) */}
            <Route index element={<Navigate to="home" replace />} />

            {/* Anak-anak pakai path RELATIF (tanpa leading "/") */}
            <Route path="home" element={<Home />} />
            <Route path="threads/:id" element={<ThreadDetail />} />
            <Route path="follows" element={<Follow />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
