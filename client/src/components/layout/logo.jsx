function Logo() {
  return (
    <div className="flex items-center gap-3">

      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg"
        style={{
          background: "var(--primary)",
        }}
      >
        T
      </div>

      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white">
          TaskFlow
        </h1>

        <p className="text-[10px] text-gray-400 -mt-1">
          Organize • Focus • Deliver
        </p>
      </div>

    </div>
  );
}

export default Logo;