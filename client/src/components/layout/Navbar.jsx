import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEllipsisV, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
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
          background: "rgba(8,17,10,.45)",
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

        {/* Three Dots */}

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <FaEllipsisV className="text-lg" />
        </button>

      </header>

      {/* ================= MOBILE MENU ================= */}

      <AnimatePresence>

        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}

            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMenuOpen(false)}
            />

            {/* Bottom Sheet */}

            <motion.div
              ref={menuRef}
              initial={{ y: 250 }}
              animate={{ y: 0 }}
              exit={{ y: 250 }}
              transition={{
                duration: 0.28,
                ease: "easeOut",
              }}
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
                borderTop:
                  "1px solid var(--primary-dark)",
              }}
            >
              <div className="w-12 h-1 rounded-full bg-gray-600 mx-auto mb-6"></div>

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
                  hover:bg-white/5
                  transition
                "
              >
                <FaCog className="text-xl" />

                <span>Settings</span>

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

                <span>Logout</span>

              </button>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* ================= DESKTOP MENU ================= */}

      <AnimatePresence>

        {menuOpen && (
          <motion.div
            ref={menuRef}
            className="hidden lg:block fixed top-16 right-6 z-[100]"
            initial={{
              opacity: 0,
              scale: 0.9,
              y: -12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: -12,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
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

          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}

export default Navbar;