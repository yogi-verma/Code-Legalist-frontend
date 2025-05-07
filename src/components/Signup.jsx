import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await signup(formData);
      toast.success("Signup successful! Redirecting...", {
        position: "top-center",
        autoClose: 3000,
      });

      localStorage.setItem("token", response.token);
      setToken(response.token);
      setIsAuthenticated(true);

      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      const message = err.message || "Registration failed. Try again.";
      setError(message);
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col">
      <ToastContainer />

      <div className="flex-grow flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-red-600">Sign up</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Code Legalist and make legal support more accessible.
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6 border-t-4 border-red-500">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {["firstName", "lastName", "username", "password"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 capitalize"
                  >
                    {field === "password"
                      ? "Password (min 6 characters)"
                      : field === "username"
                      ? "Username"
                      : field === "firstName"
                      ? "First Name"
                      : "Last Name"}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type={field === "password" ? "password" : "text"}
                    required
                    minLength={field === "password" ? 6 : undefined}
                    value={formData[field]}
                    onChange={handleChange}
                    autoComplete={
                      field === "firstName"
                        ? "given-name"
                        : field === "lastName"
                        ? "family-name"
                        : field
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2 px-4 rounded-md text-sm sm:text-base font-medium text-white ${
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
                    Signing up...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="font-medium text-red-600 hover:text-red-500">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gradient-to-br from-red-50 to-red-100 border-t border-gray-200 py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h4 className="text-lg font-bold text-gray-800">Code Legalist</h4>
            <p className="text-sm text-gray-600">
              Providing legal awareness and solutions for everyone
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-700 mb-2">Follow us on social media</p>
            <div className="flex justify-center md:justify-end space-x-4 text-red-500">
              <a href="#" aria-label="Facebook" className="hover:text-red-700">
                <FaFacebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-red-700">
                <FaTwitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-red-700">
                <FaInstagram size={20} />
              </a>
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

export default Signup;
