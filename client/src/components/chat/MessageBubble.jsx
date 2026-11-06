import { FaTrash, FaTasks } from "react-icons/fa";
import Avatar from "../common/Avatar";
import UnreadBadge from "./UnreadBadge";
import { resolveAssetUrl } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

// One chat message: text, photo, video or voice note.
//
// Group chat (showIdentity): EVERY message shows the sender's photo and
// name, WhatsApp-style. Your own messages are on the right and say
// "(you)". Tapping the photo or name calls onOpenProfile(userId).
// Private chat (showIdentity=false): just the bubble - you know who it is.
//
// `onMediaLoad` lets the chat stay scrolled to the bottom when an
// image/video finishes loading and changes the height.
function MessageBubble({
  message,
  mine,
  showIdentity = false,
  unreadCount = 0,
  canDelete,
  onDelete,
  onOpenImage,
  onMediaLoad,
  onOpenProfile,
}) {
  const { t } = useLanguage();
  const { media, sender } = message;
  const mediaUrl = media ? resolveAssetUrl(media.url) : "";

  // Only people with an account can be opened (not "Deleted user")
  const canOpen = Boolean(onOpenProfile && sender._id);
  const openProfile = () => canOpen && onOpenProfile(sender._id);

  return (
    <div className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
      {showIdentity && (
        <button
          type="button"
          onClick={openProfile}
          disabled={!canOpen}
          title={sender.name}
          className={`relative shrink-0 rounded-full ${canOpen ? "cursor-pointer" : "cursor-default"}`}
        >
          <Avatar
            src={resolveAssetUrl(sender.avatar)}
            alt={sender.name}
            sizeClass="w-8 h-8"
          />
          {!mine && <UnreadBadge count={unreadCount} />}
        </button>
      )}

      <div
        className={`max-w-[80%] sm:max-w-[68%] rounded-2xl px-3 py-2 text-white ${
          mine ? "rounded-br-md" : "rounded-bl-md bg-[#1D2C20]"
        }`}
        style={mine ? { background: "var(--primary)" } : undefined}
      >
        {showIdentity && (
          <button
            type="button"
            onClick={openProfile}
            disabled={!canOpen}
            className={`mb-1 block max-w-full truncate text-left text-xs font-semibold ${
              canOpen ? "cursor-pointer hover:underline" : "cursor-default"
            }`}
            style={{ color: mine ? "rgba(255,255,255,0.92)" : "var(--primary-light)" }}
          >
            {sender.name}
            {mine && (
              <span className="ml-1 font-normal opacity-80">({t("groups.you")})</span>
            )}
          </button>
        )}

        {message.taskTitle && (
          <div className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-black/25 px-2 py-1 text-[11px] text-gray-200">
            <FaTasks className="shrink-0" />
            <span className="truncate">{message.taskTitle}</span>
          </div>
        )}

        {message.type === "image" && (
          <img
            src={mediaUrl}
            alt={media.originalName || t("chat.photo")}
            loading="lazy"
            onLoad={onMediaLoad}
            onClick={() => onOpenImage(mediaUrl)}
            className="mb-1 max-h-72 w-auto max-w-full cursor-zoom-in rounded-xl object-cover"
          />
        )}

        {message.type === "video" && (
          <video
            src={mediaUrl}
            controls
            playsInline
            preload="metadata"
            onLoadedMetadata={onMediaLoad}
            className="mb-1 max-h-80 w-full max-w-full rounded-xl bg-black"
          />
        )}

        {message.type === "audio" && (
          <audio
            src={mediaUrl}
            controls
            preload="metadata"
            className="mb-1 h-10 w-56 max-w-full sm:w-64"
          />
        )}

        {message.text && (
          <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
        )}

        <div className="mt-1 flex items-center justify-end gap-3 text-[10px] text-gray-300/80">
          <span>{formatTime(message.createdAt)}</span>

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(message._id)}
              title={t("chat.delete")}
              className="hover:text-red-300 transition"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
