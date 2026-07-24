import { useTheme } from "../context/ThemeContext";

const colors = [
  "emerald",
  "blue",
  "purple",
  "red",
  "orange",
  "slate",
];

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-[#162117] rounded-2xl border border-gray-700 p-6">

      <h2 className="text-xl font-bold text-white mb-5">
        Choose Theme
      </h2>

      <div className="flex flex-wrap gap-4">

        {colors.map((color) => (
      <button
        key={color}
        onClick={() => {
        setTheme(color);
      }}
        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 cursor-pointer ${
          theme === color
            ? "border-white scale-125"
            : "border-transparent hover:scale-110"
        }`}
        style={{
          background:
            color === "emerald"
              ? "#22c55e"
              : color === "blue"
              ? "#3b82f6"
              : color === "purple"
              ? "#8b5cf6"
              : color === "red"
              ? "#ef4444"
              : color === "orange"
              ? "#f97316"
              : "#64748b",
        }}
      ></button>

        ))}

      </div>

    </div>
  );
}

export default ThemeSwitcher;