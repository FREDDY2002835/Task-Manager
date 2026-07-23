import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaPlusCircle,
  FaChartBar,
  FaUser,
} from "react-icons/fa";

function BottomNav() {

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center text-xs ${
      isActive ? "" : "text-gray-400"
    }`;


  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 backdrop-blur-md lg:hidden"
      style={{
        background: "rgba(17,26,18,0.95)",
        borderTop: "1px solid var(--primary-dark)",
      }}
    >


      <NavLink
        to="/"
        className={linkClass}
        style={({ isActive }) => ({
          color: isActive
            ? "var(--primary-light)"
            : "#9ca3af",
        })}
      >
        <FaHome size={20} />
        <span>Home</span>
      </NavLink>


      <NavLink
        to="/tasks"
        className={linkClass}
        style={({ isActive }) => ({
          color: isActive
            ? "var(--primary-light)"
            : "#9ca3af",
        })}
      >
        <FaTasks size={20} />
        <span>Tasks</span>
      </NavLink>



      <button
        className="rounded-full p-4 -mt-8 shadow-lg transition"
        style={{
          background: "var(--primary)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background =
            "var(--primary-light)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background =
            "var(--primary)")
        }
      >
        <FaPlusCircle className="text-white text-xl" />
      </button>




      <NavLink
        to="/analytics"
        className={linkClass}
        style={({ isActive }) => ({
          color: isActive
            ? "var(--primary-light)"
            : "#9ca3af",
        })}
      >
        <FaChartBar size={20} />
        <span>Stats</span>
      </NavLink>




      <NavLink
        to="/profile"
        className={linkClass}
        style={({ isActive }) => ({
          color: isActive
            ? "var(--primary-light)"
            : "#9ca3af",
        })}
      >
        <FaUser size={20} />
        <span>Profile</span>
      </NavLink>


    </nav>
  );
}

export default BottomNav;