// Small red counter shown on a person's avatar when they've sent you
// private messages you haven't read. Place inside a `relative` wrapper.
function UnreadBadge({ count }) {
  if (!count) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default UnreadBadge;
