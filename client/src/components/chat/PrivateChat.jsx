import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import ChatComposer from "./ChatComposer";
import ImageLightbox from "../common/ImageLightbox";
import { useLanguage } from "../../context/LanguageContext";
import {
  getDmMessages,
  sendDmMessage,
  deleteDmMessage,
  markDmRead,
} from "../../services/api";

// A 1-to-1 conversation with `partner`, shown inside the profile box.
// `dm` is the object returned by useDmSocket (live events + unread counts).
function PrivateChat({ partner, myId, dm }) {
  const { t } = useLanguage();
  const { subscribe, clearUnread } = dm;

  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const listRef = useRef(null);
  const restoreScrollRef = useRef(null);

  // Open the conversation (the server marks their messages as read)
  useEffect(() => {
    let cancelled = false;

    getDmMessages(partner._id)
      .then((res) => {
        if (cancelled) return;
        setMessages(res.data.messages);
        setHasMore(res.data.hasMore);
        clearUnread(partner._id);
      })
      .catch((err) => {
        console.error("Failed to load private messages:", err);
        if (!cancelled) setError(t("chat.errorLoad"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner._id]);

  // Live updates while this chat is open
  useEffect(
    () =>
      subscribe((event, payload) => {
        if (event === "dm:new") {
          const fromPartner = payload.sender._id === partner._id;
          const toPartner = String(payload.recipient) === partner._id;
          if (!fromPartner && !toPartner) return; // someone else's conversation

          setMessages((prev) => (prev.some((m) => m._id === payload._id) ? prev : [...prev, payload]));

          // They wrote while I'm looking at the chat: it's read already
          if (fromPartner) {
            markDmRead(partner._id).catch(() => {});
            clearUnread(partner._id);
          }
        }

        if (event === "dm:deleted") {
          setMessages((prev) => prev.filter((m) => m._id !== payload._id));
        }
      }),
    [subscribe, clearUnread, partner._id]
  );

  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;

    if (restoreScrollRef.current !== null) {
      el.scrollTop = el.scrollHeight - restoreScrollRef.current;
      restoreScrollRef.current = null;
      return;
    }

    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const loadOlder = async () => {
    if (loadingOlder || messages.length === 0) return;

    try {
      setLoadingOlder(true);
      const res = await getDmMessages(partner._id, { before: messages[0]._id });
      const el = listRef.current;
      restoreScrollRef.current = el.scrollHeight - el.scrollTop;

      setMessages((prev) => {
        const known = new Set(prev.map((m) => m._id));
        return [...res.data.messages.filter((m) => !known.has(m._id)), ...prev];
      });
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Failed to load older private messages:", err);
      setError(t("chat.errorLoad"));
    } finally {
      setLoadingOlder(false);
    }
  };

  const sendToPartner = (formData, onProgress) =>
    sendDmMessage(partner._id, formData, onProgress).then((res) =>
      setMessages((prev) => (prev.some((m) => m._id === res.data._id) ? prev : [...prev, res.data]))
    );

  const handleDelete = async (messageId) => {
    if (!window.confirm(t("chat.confirmDelete"))) return;

    try {
      await deleteDmMessage(partner._id, messageId);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      console.error("Failed to delete private message:", err);
      setError(err.response?.data?.message || t("chat.errorSend"));
    }
  };

  return (
    <div className="flex min-h-0 flex-col">
      <p className="px-4 pt-3 text-center text-[11px] text-gray-500">
        {t("chat.privateNote").replace("{name}", partner.name)}
      </p>

      <div ref={listRef} className="h-64 space-y-2 overflow-y-auto p-4">
        {hasMore && (
          <div className="flex justify-center pb-1">
            <button
              type="button"
              onClick={loadOlder}
              disabled={loadingOlder}
              className="rounded-full bg-[#1D2C20] px-3 py-1.5 text-xs text-gray-300 hover:text-white transition disabled:opacity-60"
            >
              {loadingOlder ? t("chat.loading") : t("chat.loadOlder")}
            </button>
          </div>
        )}

        {loading && <p className="py-6 text-center text-sm text-gray-400">{t("chat.loading")}</p>}

        {!loading && messages.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            {t("chat.privateEmpty").replace("{name}", partner.name)}
          </p>
        )}

        {messages.map((message) => {
          const mine = message.sender._id === myId;

          return (
            <MessageBubble
              key={message._id}
              message={message}
              mine={mine}
              canDelete={mine}
              onDelete={handleDelete}
              onOpenImage={setLightbox}
            />
          );
        })}
      </div>

      {error && (
        <p className="mx-3 mb-2 rounded-lg border border-red-900 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}

      <ChatComposer onSubmit={sendToPartner} />

      <AnimatePresence>
        {lightbox && <ImageLightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}

export default PrivateChat;
