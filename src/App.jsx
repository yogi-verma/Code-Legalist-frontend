import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import PostForm from "./components/PostForm";
import { Toaster } from "react-hot-toast";

function App() {
  // Check localStorage for existing token on initial load
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("token") !== null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  // Handle authentication state changes
  const handleLogin = (newToken, user) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(newToken);
    setUserData(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setToken={handleLogin}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Signup
                setIsAuthenticated={setIsAuthenticated}
                setToken={handleLogin}
              />
            )
          }
        />
        // Add this new route in your App.jsx
        <Route
          path="/dashboard/myposts"
          element={
            isAuthenticated ? (
              <Dashboard
                token={token}
                setIsAuthenticated={setIsAuthenticated}
                view="myposts"
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard
                token={token}
                userData={userData}
                setIsAuthenticated={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/create-post"
          element={
            isAuthenticated ? (
              <PostForm username={userData?.username} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
