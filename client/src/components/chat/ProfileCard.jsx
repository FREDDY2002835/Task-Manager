import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaCrown, FaUserShield } from "react-icons/fa";
import Avatar from "../common/Avatar";
import PrivateChat from "./PrivateChat";
import { resolveAssetUrl } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";

const cardStyle = { borderWidth: 1, borderColor: "var(--primary-dark)" };

// The small box that opens when you tap someone's photo or name in a
// group. Shows their profile and - unless it's you - a private chat with
// them. For your own profile it shows "(you)" and a link to edit it.
//   member -> { user, role, isOwner } from the group's member list
function ProfileCard({ member, isMe, myId, dm, onClose }) {
  const { t } = useLanguage();
  const { user } = member;

  // Escape closes the box
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const roleBadge = member.isOwner ? (
    <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-yellow-400">
      <FaCrown /> {t("groups.owner")}
    </span>
  ) : member.role === "admin" ? (
    <span
      className="flex items-center gap-1 text-[10px] font-semibold uppercase"
      style={{ color: "var(--primary-light)" }}
    >
      <FaUserShield /> {t("groups.admin")}
    </span>
  ) : (
    <span className="text-[10px] font-semibold uppercase text-gray-400">
      {t("groups.member")}
    </span>
  );

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 py-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={user.name}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-md flex-col overflow-y-auto rounded-2xl bg-[#162117] shadow-2xl"
        style={cardStyle}
      >
        {/* ---------- profile ---------- */}
        <div className="relative flex items-center gap-4 p-5 pr-12">
          <Avatar
            src={resolveAssetUrl(user.avatar)}
            alt={user.name}
            sizeClass="w-16 h-16"
          />

          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="truncate text-lg font-bold text-white">
              {user.name}
              {isMe && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({t("groups.you")})
                </span>
              )}
            </h2>
            {user.title && <p className="truncate text-sm text-gray-300">{user.title}</p>}
            {roleBadge}
            {user.email && <p className="truncate text-xs text-gray-500">{user.email}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            title={t("groups.cancel")}
            className="absolute right-3 top-3 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {user.bio && (
          <p className="line-clamp-3 px-5 pb-4 text-sm text-gray-300">{user.bio}</p>
        )}

        {/* ---------- private chat (not for yourself) ---------- */}
        <div className="border-t" style={{ borderColor: "var(--primary-dark)" }}>
          {isMe ? (
            <div className="p-5">
              <Link
                to="/profile"
                onClick={onClose}
                className="block rounded-xl py-3 text-center text-sm font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                {t("chat.viewMyProfile")}
              </Link>
            </div>
          ) : (
            <>
              <h3 className="px-5 pt-4 text-sm font-semibold text-white">
                {t("chat.privateChat")}
              </h3>
              <PrivateChat partner={user} myId={myId} dm={dm} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
