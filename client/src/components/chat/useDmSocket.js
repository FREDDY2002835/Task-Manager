import { useCallback, useEffect, useRef, useState } from "react";
import { createChatSocket } from "../../services/socket";
import { getDmUnread } from "../../services/api";

// Keeps track of private messages for the logged-in user:
//   unread         -> { [userId]: count } of unread private messages per person
//   totalUnread    -> sum of the above
//   clearUnread(id)-> forget the count for one person (they opened that chat)
//   subscribe(fn)  -> an open private chat registers here to receive live
//                     events: fn("dm:new", message) / fn("dm:deleted", { _id }).
//                     Returns an "unsubscribe" function.
// One live connection serves every private chat on the page.
export function useDmSocket(myId) {
  const [unread, setUnread] = useState({});
  const listenersRef = useRef(new Set());

  const subscribe = useCallback((listener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const clearUnread = useCallback((userId) => {
    setUnread((prev) => {
      if (!prev[userId]) return prev;
      const next = { ...prev };
      delete next[userId];
      return next;
    });
  }, []);

  useEffect(() => {
    if (!myId) return undefined;

    let cancelled = false;
    getDmUnread()
      .then((res) => {
        if (!cancelled) setUnread(res.data);
      })
      .catch(() => {});

    const socket = createChatSocket();
    const tell = (event, payload) =>
      listenersRef.current.forEach((listener) => listener(event, payload));

    socket.on("dm:new", (message) => {
      // Someone else wrote to me -> bump their counter (an open chat with
      // them will clear it again straight away)
      if (message.sender._id !== myId) {
        setUnread((prev) => ({
          ...prev,
          [message.sender._id]: (prev[message.sender._id] || 0) + 1,
        }));
      }
      tell("dm:new", message);
    });

    socket.on("dm:deleted", (payload) => tell("dm:deleted", payload));

    // I read it on another device
    socket.on("dm:read", ({ userId }) => clearUnread(userId));

    return () => {
      cancelled = true;
      socket.disconnect();
    };
  }, [myId, clearUnread]);

  const totalUnread = Object.values(unread).reduce((sum, n) => sum + n, 0);

  return { unread, totalUnread, clearUnread, subscribe };
}
