import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";

import ProtectedRoute from "./utils/ProtectedRoute";
import HomeLayout from "./layouts/HomeLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ThreadDetail from "./components/ThreadDetail";

function App() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-400">Loading…</div>}>
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<HomeLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/threads/:id" element={<ThreadDetail />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
