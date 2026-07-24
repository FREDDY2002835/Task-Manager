import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEllipsisV, FaCog, FaSignOutAlt } from "react-icons/fa";
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
    <>
      {/* NAVBAR */}
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
          background: "rgba(8,17,10,0.45)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="TaskFlow"
            className="w-25 h-25 object-contain"
          />

          <span className="text-lg font-semibold ml-7">
            Task Manager
          </span>
        </div>

        {/* Three dots */}
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <FaEllipsisV className="text-lg" />
        </button>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* Dark overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Bottom sheet */}
          <div
            ref={menuRef}
            className="
              absolute
              bottom-0
              left-0
              right-0
              rounded-t-3xl
              p-6
              animate-[slideUp_0.25s_ease-out]
            "
            style={{
              background: "#111A12",
              borderTop: "1px solid var(--primary-dark)",
            }}
          >
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>

            <Link
              to="/settings"
              onClick={() => setMenuOpen(false)}
              className="
                flex
                items-center
                gap-4
                px-4
                py-4
                rounded-2xl
                text-white
                hover:bg-white/5
                transition
              "
            >
              <FaCog className="text-xl" />
              <span className="text-base font-medium">
                Settings
              </span>
            </Link>

            <button
              onClick={() => {
                setMenuOpen(false);
                // logout logic
              }}
              className="
                w-full
                flex
                items-center
                gap-4
                px-4
                py-4
                rounded-2xl
                text-red-400
                hover:bg-white/5
                transition
              "
            >
              <FaSignOutAlt className="text-xl" />
              <span className="text-base font-medium">
                Logout
              </span>
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP DROPDOWN */}
      {menuOpen && (
        <div className="hidden lg:block fixed top-16 right-6 z-[100]">

          <div
            className="w-52 rounded-2xl overflow-hidden border shadow-2xl"
            style={{
              background: "#162117",
              borderColor: "var(--primary-dark)",
            }}
          >
            <Link
              to="/settings"
              onClick={() => setMenuOpen(false)}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                text-white
                hover:bg-[#1d2c20]
                transition
              "
            >
              <FaCog />
              Settings
            </Link>

            <button
              onClick={() => setMenuOpen(false)}
              className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                text-left
                text-red-400
                hover:bg-[#1d2c20]
                transition
              "
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;