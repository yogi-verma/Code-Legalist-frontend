import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getDashboard, getPostsByUsername } from "../utils/api";
import {
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiSearch,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import img from "../assets/img.png";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = "https://code-legalist-backend.onrender.com";

const Dashboard = ({ token, setIsAuthenticated, view = "all" }) => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const POSTS_PER_PAGE = 3;
  const MAX_DESCRIPTION_LENGTH = 100;

  const fetchAllPosts = async () => {
    try {
      setIsLoading(true);
      const userData = await getDashboard(token);
      setUserData(userData.user);

      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const postsData = await response.json();
      setPosts(postsData);
    } catch (err) {
      setError(err.message || "Failed to load data");
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      setIsLoading(true);
      const userData = await getDashboard(token);
      setUserData(userData.user);

      const myPosts = await getPostsByUsername(userData.user.username);
      setPosts(myPosts.posts);
    } catch (err) {
      setError(err.message || "Failed to load your posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (view === "myposts") {
      fetchMyPosts();
    } else {
      fetchAllPosts();
    }
  }, [token, navigate, setIsAuthenticated, view]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setIsSearchActive(false);
      setFilteredPosts([]);
      setCurrentPage(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = posts.filter((post) => {
      const usernameMatch = post.username.toLowerCase().includes(query);
      const dateMatch = formatDate(post.createdAt)
        .toLowerCase()
        .includes(query);
      const keywordMatch =
        post.description.toLowerCase().includes(query) ||
        (post.city && post.city.toLowerCase().includes(query)) ||
        (post.state && post.state.toLowerCase().includes(query));
      return usernameMatch || dateMatch || keywordMatch;
    });

    setFilteredPosts(filtered);
    setIsSearchActive(true);
    setCurrentPage(0);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      toast.success("Account deleted successfully");
      setIsAuthenticated(false);
      navigate("/");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const togglePostExpand = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const displayedPosts = isSearchActive ? filteredPosts : posts;
  const totalPages = Math.ceil(displayedPosts.length / POSTS_PER_PAGE);
  const currentPosts = displayedPosts.slice(
    currentPage * POSTS_PER_PAGE,
    (currentPage + 1) * POSTS_PER_PAGE
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {view === "myposts" && (
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 text-gray-600 hover:text-red-600"
              >
                <FiArrowLeft size={24} />
              </button>
            )}
            <img src={img} alt="logo" className="w-10 h-10" />
          </div>

          <div className="flex items-center space-x-4">
            {view === "all" && (
              <Link
                to="/dashboard/myposts"
                className="px-3 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-all"
              >
                My Posts
              </Link>
            )}

            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <FiUser size={20} />
                </div>
                
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                  {userData && (
                  <span className="flex text-left items-center px-4 py-2 text-sm text-gray-700 font-bold">
                  <CgProfile  className="mr-2 h-4 w-4" />
                  {userData.firstName} {userData.lastName}
                </span>
                )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center"
                  >
                    <FiTrash2 className="mr-2" /> Delete Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete your account?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Post Overlay */}
      {expandedPostId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b">
              <button
                onClick={() => setExpandedPostId(null)}
                className="text-gray-500 hover:text-red-600 p-1"
              >
                <FiX size={24} />
              </button>
              {displayedPosts
                .filter((post) => post._id === expandedPostId)
                .map((post) => (
                  <span key={post._id} className="text-sm text-gray-500 mr-4">
                    {formatDate(post.createdAt)}
                  </span>
                ))}
            </div>
            <div className="p-6">
              {displayedPosts
                .filter((post) => post._id === expandedPostId)
                .map((post) => (
                  <div key={post._id}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg text-red-600">
                        {post.username}
                      </h4>
                    </div>
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        {post.city}, {post.state}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">
                      {post.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {isLoading ? (
         <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
         <span className="ml-4 text-gray-700 text-lg font-medium">Loading data...</span>
       </div>
       
        
        
        
        ) : (
          <>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {view === "myposts"
                    ? "My Posts"
                    : "Welcome to Your Dashboard"}
                </h2>
                <Link
                  to="/create-post"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-center transition-transform duration-300 hover:scale-105"
                >
                  Create Post
                </Link>
              </div>
            </div>

            {view === "all" && (
              <div className="text-center py-12">
                <h2 className="text-4xl font-bold">
                  <span className="text-red-600">Code Legalist </span>: A legal
                  awareness platform
                </h2>
                <div className="mt-6 flex justify-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by username, date, or keywords"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="border px-4 py-3 w-full sm:w-[400px] md:w-[500px] rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-3 top-3 text-gray-500 hover:text-red-600 hover:cursor-pointer transition-transform duration-300 hover:scale-105"
                    >
                      <FiSearch size={20} />
                    </button>
                  </div>
                </div>
                {isSearchActive && (
                  <div className="mt-4">
                    <span className="text-gray-600">
                      Showing {filteredPosts.length} results for "{searchQuery}"
                    </span>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearchActive(false);
                      }}
                      className="ml-2 text-red-600 hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-3xl font-bold mb-6">
                {isSearchActive
                  ? "Search Results"
                  : view === "myposts"
                  ? "My Stories"
                  : "Read the Latest Stories"}
              </h3>

              {displayedPosts.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentPosts.map((post) => (
                      <div
                        key={post._id}
                        className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow p-6 h-full flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-lg text-red-600">
                            {post.username}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            {post.city}, {post.state}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 flex-grow">
                          {post.description.length > MAX_DESCRIPTION_LENGTH &&
                          !expandedPostId
                            ? `${post.description.substring(
                                0,
                                MAX_DESCRIPTION_LENGTH
                              )}...`
                            : post.description}
                        </p>
                        {post.description.length > MAX_DESCRIPTION_LENGTH && (
                          <button
                            onClick={() => togglePostExpand(post._id)}
                            className="self-start text-red-600 hover:underline text-sm mt-auto"
                          >
                            Read More
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-4">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        className={`p-2 rounded-full ${
                          currentPage === 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        } transition-colors`}
                      >
                        <FiChevronLeft size={20} />
                      </button>

                      <span className="text-gray-600 mx-2">
                        Page {currentPage + 1} of {totalPages}
                      </span>

                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        className={`p-2 rounded-full ${
                          currentPage === totalPages - 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        } transition-colors`}
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-600">
                    {isSearchActive
                      ? "No posts match your search criteria."
                      : view === "myposts"
                      ? "You haven't created any posts yet."
                      : "No posts yet. Be the first to create one!"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
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

export default Dashboard;
