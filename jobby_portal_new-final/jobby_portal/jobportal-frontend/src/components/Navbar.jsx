import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Initialize user state - clean up stale data immediately (not in useEffect)
  const getValidUser = () => {
    const storedUser = localStorage.getItem("user");

    // If no token, user data is stale - clear it immediately
    if (!token) {
      if (storedUser) {
        localStorage.removeItem("user");
      }
      return null;
    }

    // Token exists, try to parse user data
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  };

  const user = getValidUser();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowDropdown(false);
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Jobs", path: "/jobs" },
    { name: "Companies", path: "/companies" },
    { name: "Blog", path: "/blog" },
  ];

  // Get user initials
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get dashboard path based on role
  const getDashboardPath = () => {
    if (user?.role === "employer") {
      return "/dashboard/employer";
    }
    return "/profile/steps";
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-glass"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
            J
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-primary-700 transition-colors">
            Jobbe
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold transition-colors duration-300 ${location.pathname === link.path
                ? "text-primary-600"
                : "text-slate-600 hover:text-primary-600"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons / Profile */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            // User is logged in - show profile avatar
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {getInitials()}
                  </div>
                )}
                <FiChevronDown className={`text-slate-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    <FiUser className="text-base" />
                    {user.role === "employer" ? "Dashboard" : "My Profile"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="text-base" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User is not logged in - show Login and Post Job buttons
            <>
              <Link
                to="/auth/login/jobseeker"
                className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link to="/auth/register/employer" className="btn-primary text-sm shadow-primary-500/20">
                Post a Job
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-slate-700 hover:text-primary-600 transition-colors"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xl transition-all duration-300 origin-top ${isOpen
          ? "opacity-100 scale-y-100 py-6"
          : "opacity-0 scale-y-0 h-0 overflow-hidden"
          }`}
      >
        <div className="flex flex-col gap-4 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-lg font-medium ${location.pathname === link.path
                ? "text-primary-600"
                : "text-slate-600"
                }`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-slate-100 my-2" />
          {user ? (
            // User logged in - mobile
            <>
              <div className="flex items-center gap-3 py-2">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <Link
                to={getDashboardPath()}
                className="text-slate-600 font-semibold flex items-center gap-2"
              >
                <FiUser />
                {user.role === "employer" ? "Dashboard" : "My Profile"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold flex items-center gap-2"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            // User not logged in - mobile
            <>
              <Link
                to="/auth/login/jobseeker"
                className="text-slate-600 font-semibold"
              >
                Login
              </Link>
              <Link
                to="/auth/register/employer"
                className="btn-primary text-center justify-center"
              >
                Post a Job
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

