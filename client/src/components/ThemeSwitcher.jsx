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
  alert(color);
  setTheme(color);
}}
  className={`w-10 h-10 rounded-full border-4 ${
    theme === color ? "border-white scale-110" : "border-transparent"
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