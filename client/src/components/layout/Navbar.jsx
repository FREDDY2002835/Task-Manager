import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEllipsisV, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = () => {
    // Remove saved login data if you use it
    localStorage.removeItem("token");

    setMenuOpen(false);

    navigate("/login");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}

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
          borderColor: "rgba(255,255,255,.05)",
        }}
      >
        {/* Logo */}

        <div className="flex items-center gap-3">

          <img
            src={logo}
            alt="TaskFlow"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
          />

          <span className="text-sm sm:text-base lg:text-lg font-semibold">
            Task Manager
          </span>

        </div>

        {/* Three dots */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <FaEllipsisV className="text-lg" />
        </button>
      </header>

      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />

          {/* Bottom Sheet */}

          <div
            ref={menuRef}
            className="
              absolute
              bottom-0
              left-0
              right-0
              rounded-t-3xl
              p-6
            "
            style={{
              background: "#111A12",
              borderTop: "1px solid var(--primary-dark)",
            }}
          >
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
              onClick={handleLogout}
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

      {/* ================= DESKTOP MENU ================= */}

      {menuOpen && (
        <div
          ref={menuRef}
          className="hidden lg:block fixed top-16 right-6 z-[100]"
        >
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
              onClick={handleLogout}
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