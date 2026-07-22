function Navbar() {
  return (
    <header className="h-16 bg-emerald-900 text-white shadow-md flex items-center justify-between px-8">

      <h1 className="text-2xl font-bold">
        Task Manager
      </h1>

      <button className="bg-emerald-600 hover:bg-emerald-500 transition px-4 py-2 rounded-lg">
        Logout
      </button>

    </header>
  );
}

export default Navbar;