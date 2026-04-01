import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/AuthSlice";
import type { RootState, AppDispatch } from "../store/store";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "ToDo-Listen", path: "/todolists" },
  { name: "Über Mich", path: "/about" },
  { name: "Kontakt", path: "/contact" },
];

interface NavBarProps {
  pageTitle: string;
}

const NavBar = ({ pageTitle }: NavBarProps) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get auth state from Redux
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setVisible(false); // scroll down => hide
      } else {
        setVisible(true); // scroll up => show
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <nav
        className={`bg-gray-900/80 backdrop-blur-md text-white shadow-md sticky top-0 z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="text-xl font-semibold tracking-wide">
              Info-Center
            </div>

            {/* Navigation */}
            <div className="flex space-x-6 items-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `transition-colors duration-200 ${
                      isActive
                        ? "text-cyan-400"
                        : "text-gray-300 hover:text-white"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* User Info & Logout Button (only shown when authenticated) */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4 ml-6 pl-4 border-l border-gray-600">
                  <div className="text-sm">
                    <p className="text-gray-300">Angemeldet als:</p>
                    <NavLink
                      key={user.name}
                      to="/userprofile"
                      className="font-semibold text-cyan-400 transition-colors duration-200 hover:text-white"
                    >
                      {user.username || user.name || "User"}
                    </NavLink>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-800 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-200 text-sm font-semibold cursor-pointer pb-2.5"
                  >
                    Abmelden
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>
      {/* Header */}
      {pageTitle !== "Forum" ? (
        <div className="text-white mt-3 mb-3 p-4 w-full rounded bg-gray-800/50 backdrop-blur-md shadow-md sticky top-0 z-50 flex flex-row justify-between">
          <p className="text-4xl font-bold text-blue-400">{pageTitle}</p>
        </div>
      ) : null}
    </div>
  );
};

export default NavBar;
