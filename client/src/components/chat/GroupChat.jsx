import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import ChatComposer from "./ChatComposer";
import ImageLightbox from "../common/ImageLightbox";
import { useLanguage } from "../../context/LanguageContext";
import { createChatSocket } from "../../services/socket";
import {
  getGroupMessages,
  sendGroupMessage,
  deleteGroupMessage,
  getGroupTasks,
} from "../../services/api";

const cardStyle = { borderWidth: 1, borderColor: "var(--primary-dark)" };

const dayKey = (iso) => new Date(iso).toDateString();

function dayLabel(iso, t) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return t("chat.today");
  if (date.toDateString() === yesterday.toDateString()) return t("chat.yesterday");
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Group chat, WhatsApp-style: every message shows who sent it (photo + name,
// "(you)" on your own). Tapping a person calls onOpenProfile(userId).
//   unread        -> { [userId]: count } of private messages waiting from each person
//   presetTaskId  -> pre-selects the task label (from a task card's "Discuss" button)
function GroupChat({
  groupId,
  myId,
  isAdmin,
  presetTaskId = "",
  unread = {},
  onOpenProfile,
  onGone,
}) {
  const { t } = useLanguage();

  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  const rootRef = useRef(null);
  const listRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const restoreScrollRef = useRef(null);
  const onGoneRef = useRef(onGone);

  useEffect(() => {
    onGoneRef.current = onGone;
  });

  // Bring the chat into view when opened (so the message box isn't off-screen)
  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // ---------------- loading ----------------

  useEffect(() => {
    let cancelled = false;

    getGroupMessages(groupId)
      .then((res) => {
        if (cancelled) return;
        setMessages(res.data.messages);
        setHasMore(res.data.hasMore);
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
        if (!cancelled) setError(t("chat.errorLoad"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    getGroupTasks(groupId)
      .then((res) => {
        if (!cancelled) setTasks(res.data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  // ---------------- live updates ----------------

  useEffect(() => {
    const socket = createChatSocket();
    let firstConnect = true;

    const catchUp = () =>
      getGroupMessages(groupId)
        .then((res) =>
          setMessages((prev) => {
            const known = new Set(prev.map((m) => m._id));
            const fresh = res.data.messages.filter((m) => !known.has(m._id));
            return fresh.length
              ? [...prev, ...fresh].sort((a, b) => (a._id < b._id ? -1 : 1))
              : prev;
          })
        )
        .catch(() => {});

    socket.on("connect", () => {
      socket.emit("group:join", groupId);
      // After a dropped connection, fetch whatever we missed
      if (!firstConnect) catchUp();
      firstConnect = false;
    });

    socket.on("message:new", (msg) => {
      if (String(msg.group) !== String(groupId)) return;
      // The sender also gets their own message back - ignore duplicates
      setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
    });

    socket.on("message:deleted", ({ _id }) => {
      setMessages((prev) => prev.filter((m) => m._id !== _id));
    });

    // The group was deleted, or this user was removed from it
    const gone = ({ groupId: id }) => {
      if (String(id) === String(groupId)) onGoneRef.current?.();
    };
    socket.on("group:deleted", gone);
    socket.on("group:removed", gone);

    return () => {
      socket.emit("group:leave", groupId);
      socket.disconnect();
    };
  }, [groupId]);

  // ---------------- scrolling ----------------

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const handleScroll = () => {
    const el = listRef.current;
    if (el) {
      stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    }
  };

  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;

    // Older messages were just added above: keep the view where it was
    if (restoreScrollRef.current !== null) {
      el.scrollTop = el.scrollHeight - restoreScrollRef.current;
      restoreScrollRef.current = null;
      return;
    }

    const last = messages[messages.length - 1];
    if (stickToBottomRef.current || last?.sender?._id === myId) scrollToBottom();
  }, [messages, myId, scrollToBottom]);

  const handleMediaLoad = () => {
    if (stickToBottomRef.current) scrollToBottom();
  };

  const loadOlder = async () => {
    if (loadingOlder || messages.length === 0) return;

    try {
      setLoadingOlder(true);
      const res = await getGroupMessages(groupId, { before: messages[0]._id });
      const el = listRef.current;
      restoreScrollRef.current = el.scrollHeight - el.scrollTop;

      setMessages((prev) => {
        const known = new Set(prev.map((m) => m._id));
        return [...res.data.messages.filter((m) => !known.has(m._id)), ...prev];
      });
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Failed to load older messages:", err);
      setError(t("chat.errorLoad"));
    } finally {
      setLoadingOlder(false);
    }
  };

  // ---------------- send / delete ----------------

  // Used by the composer; it clears itself on success and shows errors on failure
  const sendToGroup = (formData, onProgress) =>
    sendGroupMessage(groupId, formData, onProgress).then((res) =>
      // The live event may already have added it - don't show it twice
      setMessages((prev) => (prev.some((m) => m._id === res.data._id) ? prev : [...prev, res.data]))
    );

  const handleDelete = async (messageId) => {
    if (!window.confirm(t("chat.confirmDelete"))) return;

    try {
      await deleteGroupMessage(groupId, messageId);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      console.error("Failed to delete message:", err);
      setError(err.response?.data?.message || t("chat.errorSend"));
    }
  };

  // ---------------- render ----------------

  return (
    <section
      ref={rootRef}
      className="flex h-[75vh] min-h-[460px] scroll-mt-20 flex-col overflow-hidden rounded-2xl bg-[#162117]"
      style={cardStyle}
    >
      {/* ================= MESSAGES ================= */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 space-y-3 overflow-y-auto p-4"
      >
        {hasMore && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={loadOlder}
              disabled={loadingOlder}
              className="rounded-full bg-[#1D2C20] px-4 py-2 text-xs text-gray-300 hover:text-white transition disabled:opacity-60"
            >
              {loadingOlder ? t("chat.loading") : t("chat.loadOlder")}
            </button>
          </div>
        )}

        {loading && <p className="py-10 text-center text-gray-400">{t("chat.loading")}</p>}

        {!loading && messages.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">{t("chat.empty")}</p>
        )}

        {messages.map((message, i) => {
          const previous = messages[i - 1];
          const newDay = !previous || dayKey(previous.createdAt) !== dayKey(message.createdAt);
          const mine = message.sender._id === myId;

          return (
            <div key={message._id} className="space-y-3">
              {newDay && (
                <div className="flex justify-center py-1">
                  <span className="rounded-full bg-[#1D2C20] px-3 py-1 text-[11px] text-gray-400">
                    {dayLabel(message.createdAt, t)}
                  </span>
                </div>
              )}

              <MessageBubble
                message={message}
                mine={mine}
                showIdentity
                unreadCount={mine ? 0 : unread[message.sender._id] || 0}
                canDelete={mine || isAdmin}
                onDelete={handleDelete}
                onOpenImage={setLightbox}
                onMediaLoad={handleMediaLoad}
                onOpenProfile={onOpenProfile}
              />
            </div>
          );
        })}
      </div>

      {error && (
        <p className="mx-3 mt-3 rounded-lg border border-red-900 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}

      <ChatComposer onSubmit={sendToGroup} tasks={tasks} initialTaskId={presetTaskId} />

      <AnimatePresence>
        {lightbox && <ImageLightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </section>
  );
}

export default GroupChat;
