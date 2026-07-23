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
      isActive ? "text-green-400" : "text-gray-400"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 bg-[#111A12]/95 backdrop-blur-md border-t border-green-900 lg:hidden">

      <NavLink to="/" className={linkClass}>
        <FaHome size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/tasks" className={linkClass}>
        <FaTasks size={20} />
        <span>Tasks</span>
      </NavLink>

      <button className="bg-green-500 hover:bg-green-600 rounded-full p-4 -mt-8 shadow-lg transition">
        <FaPlusCircle className="text-white text-xl" />
      </button>

      <NavLink to="/analytics" className={linkClass}>
        <FaChartBar size={20} />
        <span>Stats</span>
      </NavLink>

      <NavLink to="/profile" className={linkClass}>
        <FaUser size={20} />
        <span>Profile</span>
      </NavLink>

    </nav>
  );
}

export default BottomNav;