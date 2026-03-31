import { NavLink } from "react-router";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Home", path: "/dashboard" },
  { name: "Über Mich", path: "/about" },
  { name: "Kontakt", path: "/contact" },
];

interface NavBarProps {
  pageTitle: string;
}

const NavBar = ({ pageTitle }: NavBarProps) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
            <div className="flex space-x-6">
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
            </div>
          </div>
        </div>
      </nav>
      {/* Header */}
      {pageTitle !== "Forum" ? (
        <div className="text-white mt-3 mb-3 p-4 w-full rounded bg-gray-800/50 backdrop-blur-md shadow-md sticky top-0 z-50 flex flex-row justify-between">
          <p className="text-4xl font-bold text-blue-400">{pageTitle}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NavBar;
