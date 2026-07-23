function Navbar() {
  return (
    <header
      className="h-16 text-white shadow-md flex items-center justify-between px-8"
      style={{
        background: "var(--primary-dark)",
      }}
    >

      <h1 className="text-2xl font-bold">
        Task Manager
      </h1>


      <button
        className="transition px-4 py-2 rounded-lg"
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
        Logout
      </button>


    </header>
  );
}

export default Navbar;