import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import confetti from "canvas-confetti";
import { logout } from "../features/auth/AuthSlice";
import type { RootState, AppDispatch } from "../store/store";
import DefaultFunNavBackButton from "./DefaultFunNavBackButton";

interface NavBarProps {
  pageTitle: string;
}

const NavBar = ({ pageTitle }: NavBarProps) => {
  const [visible, setVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [navItems, setNavItems] = useState([
    { name: "Startseite", path: "/dashboard" },
    { name: "ToDo-Listen", path: "/todolists" },
    { name: "Über Mich", path: "/about" },
    { name: "Kontakt", path: "/contact" },
  ]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get auth state from Redux
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    const manageNavItems = () => {
      if (!isAuthenticated) {
        setNavItems([
          { name: "Startseite", path: "/dashboard" },
          { name: "Über Mich", path: "/about" },
          { name: "Kontakt", path: "/contact" },
        ]);
      } else if (isAuthenticated && user?.role === "admin") {
        setNavItems([
          { name: "Startseite", path: "/dashboard" },
          { name: "ToDo-Listen", path: "/todolists" },
          { name: "Über Mich", path: "/about" },
          { name: "Kontakt", path: "/contact" },
          { name: "Benutzerverwaltung", path: "/useroverview" },
        ]);
      } else {
        setNavItems([
          { name: "Startseite", path: "/dashboard" },
          { name: "ToDo-Listen", path: "/todolists" },
          { name: "Über Mich", path: "/about" },
          { name: "Kontakt", path: "/contact" },
        ]);
      }
    };

    manageNavItems();
  }, [isAuthenticated, user]);

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

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Calculate the center of the button
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const dirMin = -0.5;
    const dirMax = 0.5;

    const randDirection = getRandomInt(dirMin, dirMax);

    const angleMin = 65;
    const angleMax = 115;

    const randAngle = getRandomInt(angleMin, angleMax);

    confetti({
      particleCount: 80,
      spread: 360,
      origin: { x, y },
      zIndex: 1000,
      disableForReducedMotion: true,
      startVelocity: 10,
      shapes: ["circle"],
      flat: true,
      drift: randDirection,
      angle: randAngle,
      gravity: 0,
      colors: ["#e02619", "#eb4034", "#ff5e24"],
    });

    dispatch(logout());
    setTimeout(() => navigate("/login"), 800);
  };

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
                      className="font-semibold text-cyan-400 transition-colors duration-200 hover:text-white hover:bg-cyan-500 px-2 py-0.5 rounded-xl"
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
        <div className="text-white mt-3 mb-3 mx-4 p-4 w-auto rounded bg-gray-800/50 backdrop-blur-md shadow-[0px_0px_15px_rgba(6,182,212,0.3)] sticky top-0 z-50 flex flex-row justify-between">
          <p className="text-4xl font-bold text-[rgba(10,190,220,0.9)]">
            {pageTitle}
          </p>
          {pageTitle.includes("Dashboard") ||
          pageTitle.includes("Datenschutz") ? (
            ""
          ) : (
            <DefaultFunNavBackButton></DefaultFunNavBackButton>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default NavBar;
