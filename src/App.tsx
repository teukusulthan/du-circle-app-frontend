import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ThreadDetail from "./components/ThreadDetail";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/home"
          element={
            <HomeLayout>
              <Home />
            </HomeLayout>
          }
        />

        <Route
          path="/threads/:id"
          element={
            <HomeLayout>
              <ThreadDetail />
            </HomeLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
