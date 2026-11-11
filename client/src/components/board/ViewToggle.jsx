import { Link } from "react-router-dom";
import { FaList, FaColumns } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

// Small "List | Board" switch shown on the Tasks and Board pages
function ViewToggle({ active }) {
  const { t } = useLanguage();

  const base = "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm transition";
  const on = { background: "var(--primary)", color: "white" };

  return (
    <div
      className="flex w-full max-w-[220px] gap-1 rounded-xl bg-[#162117] p-1"
      style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
    >
      <Link to="/tasks" className={`${base} ${active === "list" ? "" : "text-gray-300"}`} style={active === "list" ? on : undefined}>
        <FaList /> {t("kanban.viewList")}
      </Link>
      <Link to="/board" className={`${base} ${active === "board" ? "" : "text-gray-300"}`} style={active === "board" ? on : undefined}>
        <FaColumns /> {t("kanban.viewBoard")}
      </Link>
    </div>
  );
}

export default ViewToggle;
