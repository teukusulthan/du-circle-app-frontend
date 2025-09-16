import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <HomeLayout>
            <Home />
          </HomeLayout>
        }
      />
    </Routes>
  );
}

export default App;
