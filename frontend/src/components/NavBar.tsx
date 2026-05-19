import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import confetti from "canvas-confetti";
import { logout } from "../features/auth/AuthSlice";
import type { RootState, AppDispatch } from "../store/store";
import DefaultFunNavBackButton from "./PartialComponents/DefaultFunNavBackButton";
import "./NavBar.css";

interface NavBarProps {
  pageTitle: string;
}

const NavBar = ({ pageTitle }: NavBarProps) => {
  const [visible, setVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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

  // TODO: Add cool shiny effect on opening
  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup, enables scrolling on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="contents">
      <nav
        className={`sticky top-0 z-50 border-b border-white/10 backdrop-blur-md transition-transform duration-300 bg-[#0f1115]/80 supports-backdrop-filter:bg-[#0f1115]/60
        ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                mobileMenuOpen ? closeMobileMenu() : openMobileMenu()
              }
              className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              aria-label="Menü öffnen"
            >
              <span
                className={`block w-6 h-0.5 bg-current transition-all duration-200 ${mobileMenuOpen ? "rotate-[225deg] translate-y-2" : ""}`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-current transition-all duration-200 ${mobileMenuOpen ? "-rotate-[225deg] -translate-y-2" : ""}`}
              ></span>
            </button>

            {/* Logo */}
            <div className="shrink-0">
              <span className="navbar-logo text-2xl font-black tracking-tighter">
                INFO-CENTER
              </span>
            </div>

            {/* Navigation & Auth */}
            <div className="flex items-center gap-4">
              {/* Desktop Navigation Items */}
              <div className="hidden md:flex items-center space-x-1 bg-white/5 p-2 rounded-2xl border border-white/10 px-4 shadow-[0px_0px_8px_rgba(40,220,240,0.2)]">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${
                        isActive
                          ? "bg-cyan-500/30 text-cyan-400"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>

              {/* User Info & Auth Buttons */}
              <div className="flex items-center gap-3">
                {isAuthenticated && user ? (
                  <>
                    <NavLink
                      to="/userprofile"
                      className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg border border-white/10 transition-all duration-200 shadow-[0px_0px_8px_rgba(40,220,240,0.2)]"
                    >
                      <div className="navbar-avatar w-8 h-8 pb-[2px] rounded-full flex items-center justify-center font-bold text-white text-sm uppercase">
                        {user.username?.charAt(0) || "U"}
                      </div>
                      <span className="text-sm font-semibold text-gray-300">
                        {user.username}
                      </span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600/70 hover:bg-red-600/90 px-4 py-2 rounded-lg transition-all duration-200 text-sm text-gray-200 font-semibold cursor-pointer shadow-lg hover:shadow-red-500/80"
                    >
                      Abmelden
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-cyan-300/20 transition-all duration-200 text-sm font-semibold border border-white/10 shadow-[0px_0px_8px_rgba(40,220,240,0.2)]"
                    >
                      Anmelden
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-all duration-200 text-sm font-semibold hover:shadow-cyan-500/50 shadow-[0px_0px_8px_rgba(40,220,240,0.2)]"
                    >
                      Registrieren
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        ></div>
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-[#0f1115]/95 backdrop-blur-md border-r border-white/10 z-50 md:hidden transition-transform duration-300 overflow-y-hidden overflow-x-hidden flex flex-col ${
          mobileMenuOpen
            ? "top-0 translate-x-0 animate-glow-flow"
            : "top-20 -translate-x-full"
        }`}
      >
        {/* Mobile Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 pt-8">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-all duration-200 font-semibold text-base ${
                    isActive
                      ? "bg-cyan-500/30 text-cyan-400"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile Auth Section */}
        <div className="border-t border-white/10 mt-auto pt-6 px-4 pb-8 bg-[#0f1115]/95">
          {isAuthenticated && user ? (
            <>
              <NavLink
                to="/userprofile"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 mb-4 bg-white/5 hover:bg-white/10 px-4 py-3 rounded-lg border border-white/10 transition-all"
              >
                <div className="navbar-avatar w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm uppercase">
                  {user.username?.charAt(0) || "U"}
                </div>
                <span className="text-base font-semibold text-gray-300">
                  {user.username}
                </span>
              </NavLink>
              <button
                onClick={(e) => {
                  closeMobileMenu();
                  handleLogout(e);
                }}
                className="w-full bg-red-600/70 hover:bg-red-600/90 px-4 py-3 rounded-lg transition-all duration-200 text-base text-gray-200 font-semibold cursor-pointer shadow-lg hover:shadow-red-500/80"
              >
                Abmelden
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <NavLink
                to="/login"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-cyan-300/20 transition-all text-base font-semibold border border-white/10 text-center"
              >
                Anmelden
              </NavLink>
              <NavLink
                to="/register"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-all text-base font-semibold text-center shadow-lg hover:shadow-cyan-500/50"
              >
                Registrieren
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      {!pageTitle.includes("Dashboard") &&
      !pageTitle.includes("Datenschutz") ? (
        <div
          className={`flex flex-row justify-between text-white mt-3 mb-3 mx-4 px-4 py-2 w-auto rounded-xl bg-[rgba(20,125,205,0.15)] backdrop-blur-md border border-white/10 shadow-[0px_0px_15px_rgba(34,211,238,0.2)] sticky z-40 transition-all duration-300 ${
            visible ? "top-20" : "top-0"
          }`}
        >
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
