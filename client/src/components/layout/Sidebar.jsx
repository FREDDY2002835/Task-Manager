import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside
      className="w-64 text-white min-h-screen p-6"
      style={{
        background: "var(--primary-dark)",
      }}
    >

      <h2 className="text-2xl font-bold mb-10">
        Task Manager
      </h2>


      <nav className="flex flex-col gap-4">

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
          Dashboard
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
          Tasks
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
          Profile
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
          Analytics
        </Link>


      </nav>

    </aside>
  );
}

export default Sidebar;