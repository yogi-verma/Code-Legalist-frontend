import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = ({ setIsAuthenticated, setToken }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await signup(formData);

      toast.success("Signup successful! Redirecting to dashboard...", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      localStorage.setItem("token", response.token);
      setToken(response.token);
      setIsAuthenticated(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      setError(err.message || "Registration failed. Username may be taken.");
      toast.error(err.message || "Registration failed", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center px-4 py-6 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-red-600">
          Create your account
        </h2>
      </div>

      <div className="mt-6 mx-auto w-full max-w-md">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6 border-t-4 border-red-500">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password (min 6 characters)
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white ${
                  isLoading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base font-medium text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-300 py-6 bg-gray-100 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left side - Branding */}
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800">
                Code Legalist
              </h4>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Providing legal awareness and solutions for everyone
              </p>
            </div>

            {/* Right side - Social media */}
            <div className="text-center md:text-right">
              <p className="text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Follow us on social media
              </p>
              <div className="flex justify-center md:justify-end space-x-4 text-red-500">
                <a
                  href="#"
                  className="hover:text-red-700 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a
                  href="#"
                  className="hover:text-red-700 transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <FaTwitter size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a
                  href="#"
                  className="hover:text-red-700 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-gray-600 text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} Chat Legalist. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
