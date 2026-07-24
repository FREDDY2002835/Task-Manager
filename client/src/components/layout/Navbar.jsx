import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEllipsisV, FaCog, FaSignOutAlt } from "react-icons/fa";
import Logo from "./Logo";
import logo from "../../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
   <header
  className="
    sticky
    top-0
    z-50
    h-14
    sm:h-16
    flex
    items-center
    justify-between
    px-4
    sm:px-6
    lg:px-8
    text-white
    backdrop-blur-xl
    border-b
  "
  style={{
    background: "rgba(8, 109, 30, 0.16)",
    borderColor: "rgba(255, 255, 255, 0)",
  }}
>

  
      {/* Logo */}
      <img
      src={logo}
      alt="TaskFlow"
      className="w-27 h-27 object-contain"
    />

      <h2 className="text-1xl font-bold mb-1 mr-7">
        Task Manager
      </h2>

      {/* Menu */}
      <div className="relative" ref={menuRef}>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <FaEllipsisV className="text-lg" />
        </button>

        {menuOpen && (

          <div
            className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden shadow-2xl border z-50"
            style={{
              background: "#162117",
              borderColor: "var(--primary-dark)",
            }}
          >

            <Link
              to="/settings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#1d2c20] transition"
            >
              <FaCog />
              Settings
            </Link>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-[#1d2c20] transition"
              onClick={() => {
                setMenuOpen(false);
                // Logout logic here
              }}
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>

        )}

      </div>

    </header>
  );
}

export default Navbar;