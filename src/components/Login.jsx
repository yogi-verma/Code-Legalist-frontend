import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setIsAuthenticated, setToken }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await login(formData);
      if (response.token) {
        setToken(response.token);
        setIsAuthenticated(true);

        toast.success('Login successful! Redirecting...', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password');
      toast.error(err.message || 'Login failed', {
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
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="mx-auto w-full max-w-md">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-red-600">
          Welcome Back!
        </h2>
      </div>

      <div className="mt-6 mx-auto w-full max-w-md">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6 border-t-4 border-red-500">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
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
                  autoComplete="current-password"
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
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Log in'
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
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-red-600 hover:text-red-500">
                Sign up
              </Link>
            </p>
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

export default Login;