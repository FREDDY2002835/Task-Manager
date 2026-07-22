import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-emerald-950 text-white min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-10">
        Task Manager
      </h2>

      <nav className="flex flex-col gap-4">

        <Link
          to="/"
          className="hover:bg-emerald-800 p-3 rounded-lg transition"
        >
          Dashboard
        </Link>

        <Link
          to="/tasks"
          className="hover:bg-emerald-800 p-3 rounded-lg transition"
        >
          Tasks
        </Link>

        <Link
          to="/profile"
          className="hover:bg-emerald-800 p-3 rounded-lg transition"
        >
          Profile
        </Link>

      </nav>

    </aside>
  );
}

export default Sidebar;