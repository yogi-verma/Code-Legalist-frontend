import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Login = ({ setIsAuthenticated, setToken }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(formData);
      if (response.token) {
        setToken(response.token);
        setIsAuthenticated(true);

        toast.success("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (err) {
      const message = err.message || "Invalid username or password";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center px-4 py-6 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="mx-auto w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-red-600">
          Welcome Back!
        </h2>
      </div>

      <div className="mt-6 mx-auto w-full max-w-md">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6 border-t-4 border-red-500">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white ${
                isLoading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
              } focus:outline-none focus:ring-2 focus:ring-red-500`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
                    />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-red-600 hover:text-red-500">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-300 py-4 mt-6 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h4 className="text-lg font-bold text-gray-800">Code Legalist</h4>
            <p className="text-sm text-gray-600">Providing legal awareness and solutions for everyone</p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-700 mb-2">Follow us on social media</p>
            <div className="flex justify-center md:justify-end space-x-4 text-red-500">
              <a href="#" aria-label="Facebook" className="hover:text-red-700"><FaFacebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-red-700"><FaTwitter size={20} /></a>
              <a href="#" aria-label="Instagram" className="hover:text-red-700"><FaInstagram size={20} /></a>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Code Legalist. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;
