import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

function Sidebar() {
  const { t } = useLanguage();

  return (
   <aside
  className="hidden lg:flex fixed left-0 top-14 w-64 h-[calc(100vh-3.5rem)] flex-col overflow-hidden px-6 py-6"
  style={{
    background: "rgba(8,17,10,0.55)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
  }}
>

  {/* Background Decorations */}
<div className="absolute -top-16 -left-16 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none"
     style={{ background: "var(--primary)" }} />

<div className="absolute bottom-10 -right-20 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
     style={{ background: "var(--primary-light)" }} />

<div className="absolute top-1/2 left-10 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none"
     style={{ background: "white" }} />

      


     <nav className="relative z-10 flex flex-col gap-4">

        <Link
          to="/"
          className="p-3 rounded-lg transition"
          style={{
            background: "transparent",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "var(--primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "transparent")
          }
        >
          {t("nav.dashboard")}
        </Link>


        <Link
          to="/tasks"
          className="p-3 rounded-lg transition"
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "var(--primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "transparent")
          }
        >
          {t("nav.tasks")}
        </Link>


        <Link
          to="/profile"
          className="p-3 rounded-lg transition"
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "var(--primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "transparent")
          }
        >
          {t("nav.profile")}
        </Link>


        <Link
          to="/analytics"
          className="p-3 rounded-lg transition"
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "var(--primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "transparent")
          }
        >
          {t("nav.analytics")}
        </Link>

              <Link
        to="/settings"
        className="hover:bg-emerald-800 p-3 rounded-lg transition"
        onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "var(--primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "transparent")
          }
      >
        {t("nav.settings")}
      </Link>


      </nav>

    </aside>
  );
}

export default Sidebar;
