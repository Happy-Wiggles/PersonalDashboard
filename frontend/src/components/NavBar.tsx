import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import confetti from "canvas-confetti";
import { logout } from "../features/auth/AuthSlice";
import type { RootState, AppDispatch } from "../store/store";
import DefaultFunNavBackButton from "./TinyComponents/DefaultFunNavBackButton";

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

  const isNotBackButtonAllowedPage = (title: string) => {
    const isForbiddenPage =
      title.includes("Dashboard") ||
      title.includes("Datenschutz") ||
      title.includes("Registrieren") ||
      title.includes("Login");

    return isForbiddenPage;
  };

  return (
    <div className="contents">
      <nav
        className={`bg-[rgba(20,125,205,0.3)] border-b border-white/10 backdrop-blur-md text-white shadow-md sticky top-0 z-60 transition-transform duration-300 ${
          visible
            ? "translate-y-0 ease-in-out"
            : "-translate-y-full ease-in-out"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 pr-35">
            {/* Logo */}
            <div
              className={` 
                ${
                  pageTitle.includes("Login") ||
                  pageTitle.includes("Registrieren")
                    ? "h-10 items-center text-center pt-2 pl-4 mb-2"
                    : "h-10 items-center text-center pt-2 pl-4 mb-2"
                }`}
            >
              <p className="text-2xl font-black tracking-tighter bg-linear-to-r from-cyan-400 via-cyan-200 to-blue-500 animate-gradient-logo bg-clip-text text-transparent">
                INFO-CENTER
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-6 bg-white/5 p-3 rounded-2xl border border-white/5 px-6 h-14">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `transition-colors duration-200 font-semibold rounded-xl text-[18px] ${
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
              <div className="flex-1 flex justify-end pl-6">
                {isAuthenticated && user ? (
                  <div className="flex group items-center gap-2 w-auto">
                    <NavLink
                      to="/userprofile"
                      className="group flex items-center h-[45px] gap-3 bg-white/5 hover:bg-white/10 p-1.5 pr-3 rounded-xl border border-white/10 group-transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-cyan-500/80 flex items-center justify-center font-bold text-gray-800 uppercase group-hover:bg-cyan-400 group-duration-300">
                        {user.username?.charAt(0) || "U"}
                      </div>
                      <span className="text-[16px] font-bold text-gray-300 group-hover:text-cyan-400/80 transition-colors">
                        {user.username}
                      </span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="bg-red-800/70 hover:bg-red-500 px-4 py-2 rounded-lg transition duration-200 text-sm font-semibold cursor-pointer pb-2.5"
                    >
                      Abmelden
                    </button>
                  </div>
                ) : (
                  // Holds it centered when no user info is shown
                  <div className="w-20" />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      {!pageTitle.includes("Dashboard") &&
      !pageTitle.includes("Datenschutz") ? (
        <div className="flex flex-row justify-between text-white mt-3 mb-3 mx-4 p-4 w-auto rounded-xl bg-[rgba(20,125,205,0.15)] backdrop-blur-md border border-white/10 shadow-[0px_0px_15px_rgba(34,211,238,0.2)] sticky top-0 z-70">
          <p className="text-2xl font-bold text-cyan-400 tracking-wide uppercase pt-0.5">
            {pageTitle}
          </p>
          {/* Show Back button only when not on specific pages */}
          {isNotBackButtonAllowedPage(pageTitle) ? (
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
