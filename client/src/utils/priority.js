// Single source of truth for task priorities (used by the form, cards,
// board, calendar and charts) so colors always agree everywhere.
export const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

// Tailwind classes for the little badge on a task
export const PRIORITY_STYLES = {
  Low: "bg-blue-500 text-white",
  Medium: "bg-yellow-500 text-black",
  High: "bg-orange-500 text-black",
  Urgent: "bg-red-500 text-white",
};

// The same colors as hex, for charts
export const PRIORITY_COLORS = {
  Low: "#3B82F6",
  Medium: "#EAB308",
  High: "#F97316",
  Urgent: "#EF4444",
};
