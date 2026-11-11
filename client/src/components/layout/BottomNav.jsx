import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaUsers,
  FaPlusCircle,
  FaChartBar,
  FaUser,
} from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

// Each tab shares the width equally (flex-1) and can shrink (min-w-0), so
// five tabs plus the round "+" button always fit on a small phone.
const linkClass = ({ isActive }) =>
  `flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5 text-[10px] ${
    isActive ? "" : "text-gray-400"
  }`;

const linkStyle = ({ isActive }) => ({
  color: isActive ? "var(--primary-light)" : "#9ca3af",
});

function BottomNav() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const tabs = [
    { to: "/", icon: FaHome, label: t("nav.home") },
    { to: "/tasks", icon: FaTasks, label: t("nav.tasks") },
    { to: "/groups", icon: FaUsers, label: t("nav.groups") },
  ];
  const rightTabs = [
    { to: "/analytics", icon: FaChartBar, label: t("nav.stats") },
    { to: "/profile", icon: FaUser, label: t("nav.profile") },
  ];

  const renderTab = ({ to, icon: Icon, label }) => (
    <NavLink key={to} to={to} className={linkClass} style={linkStyle}>
      <Icon size={18} />
      <span className="max-w-full truncate">{label}</span>
    </NavLink>
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center backdrop-blur-md lg:hidden"
      style={{
        background: "rgba(17,26,18,0.95)",
        borderTop: "1px solid var(--primary-dark)",
      }}
    >
      {tabs.map(renderTab)}

      <div className="flex flex-1 justify-center">
        <button
          onClick={() => navigate("/tasks?new=1")}
          aria-label={t("nav.tasks")}
          className="-mt-7 rounded-full p-3 shadow-lg transition"
          style={{ background: "var(--primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-light)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
        >
          <FaPlusCircle className="text-xl text-white" />
        </button>
      </div>

      {rightTabs.map(renderTab)}
    </nav>
  );
}

export default BottomNav;
