import { NavLink } from "react-router-dom";
import { FaHome, FaTasks, FaUsers, FaChartBar, FaUser } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

// Five equal tabs. Each shares the width (flex-1) and can shrink (min-w-0),
// so they always fit, even on a small phone.
const linkClass = ({ isActive }) =>
  `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 text-xs ${
    isActive ? "" : "text-gray-400"
  }`;

const linkStyle = ({ isActive }) => ({
  color: isActive ? "var(--primary-light)" : "#9ca3af",
});

function BottomNav() {
  const { t } = useLanguage();

  const tabs = [
    { to: "/", icon: FaHome, label: t("nav.home") },
    { to: "/tasks", icon: FaTasks, label: t("nav.tasks") },
    { to: "/groups", icon: FaUsers, label: t("nav.groups") },
    { to: "/analytics", icon: FaChartBar, label: t("nav.stats") },
    { to: "/profile", icon: FaUser, label: t("nav.profile") },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-stretch backdrop-blur-md lg:hidden"
      style={{
        background: "rgba(17,26,18,0.95)",
        borderTop: "1px solid var(--primary-dark)",
      }}
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} className={linkClass} style={linkStyle}>
          <Icon size={20} />
          <span className="max-w-full truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
