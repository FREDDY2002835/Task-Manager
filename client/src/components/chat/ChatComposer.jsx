import { useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaPaperclip,
  FaMicrophone,
  FaStop,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { useVoiceRecorder } from "./useVoiceRecorder";
import { useLanguage } from "../../context/LanguageContext";

const cardStyle = { borderWidth: 1, borderColor: "var(--primary-dark)" };

const MB = 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
// Keep in sync with the server limits (utils/chatMedia.js)
const LIMITS = { image: 10 * MB, video: 50 * MB };

const fileKind = (mime) =>
  IMAGE_TYPES.includes(mime) ? "image" : VIDEO_TYPES.includes(mime) ? "video" : null;

const formatTimer = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

// The message box used by BOTH group chat and private chat: text, photo,
// video and voice notes (with preview, upload progress and errors).
//
//   onSubmit(formData, onProgress)  -> must return the API promise. The
//                                      composer clears itself when it succeeds
//                                      and shows the server's error if it fails.
//   tasks                           -> pass the group's tasks to show the
//                                      "about a task?" picker (group chat only)
//   initialTaskId                   -> pre-selects a task in that picker
function ChatComposer({ onSubmit, tasks = null, initialTaskId = "" }) {
  const { t } = useLanguage();
  const recorder = useVoiceRecorder();

  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState(null); // { file, url, kind, duration? }
  const [taskId, setTaskId] = useState(initialTaskId);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Free the temporary preview URL when the attachment changes or we leave
  useEffect(
    () => () => {
      if (attachment?.url) URL.revokeObjectURL(attachment.url);
    },
    [attachment]
  );

  const handlePickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;

    const kind = fileKind(file.type);
    if (!kind) return setError(t("chat.errorFileType"));
    if (file.size > LIMITS[kind]) {
      return setError(kind === "image" ? t("chat.errorImageSize") : t("chat.errorVideoSize"));
    }

    setError("");
    setAttachment({ file, url: URL.createObjectURL(file), kind });
  };

  const handleMic = async () => {
    setError("");

    const code = await recorder.start(({ blob, duration }) => {
      const ext = blob.type.includes("mp4") ? "m4a" : blob.type.includes("ogg") ? "ogg" : "webm";
      const file = new File([blob], `voice-note.${ext}`, { type: blob.type });
      setAttachment({ file, url: URL.createObjectURL(file), kind: "audio", duration });
    });

    if (code) {
      const keys = {
        unsupported: "chat.micUnsupported",
        insecure: "chat.micInsecure",
        denied: "chat.micDenied",
        failed: "chat.micFailed",
      };
      setError(t(keys[code]));
    }
  };

  const handleSend = async () => {
    const body = text.trim();
    if (sending || recorder.recording || (!body && !attachment)) return;

    const formData = new FormData();
    formData.append("text", body);
    if (taskId) formData.append("task", taskId);
    if (attachment) {
      formData.append("media", attachment.file, attachment.file.name);
      if (attachment.duration) formData.append("duration", String(attachment.duration));
    }

    try {
      setSending(true);
      setProgress(0);
      setError("");

      await onSubmit(
        formData,
        attachment
          ? (event) => event.total && setProgress(Math.round((event.loaded * 100) / event.total))
          : undefined
      );

      setText("");
      setAttachment(null);
      setTaskId("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(err.response?.data?.message || t("chat.errorSend"));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends on computers; on phones Enter just adds a new line
    const hasMouse = window.matchMedia?.("(pointer: fine)").matches;
    if (e.key === "Enter" && !e.shiftKey && hasMouse) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const canSend = !sending && (text.trim() || attachment);

  return (
    <div className="shrink-0 space-y-2 border-t p-3" style={{ borderColor: "var(--primary-dark)" }}>
      {error && (
        <p className="rounded-lg border border-red-900 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}

      {attachment && (
        <div className="flex items-center gap-3 rounded-xl bg-[#1D2C20] p-2">
          {attachment.kind === "image" && (
            <img src={attachment.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          )}
          {attachment.kind === "video" && (
            <video src={attachment.url} muted preload="metadata" className="h-16 w-24 rounded-lg bg-black object-cover" />
          )}
          {attachment.kind === "audio" && (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <audio src={attachment.url} controls className="h-10 w-full max-w-xs" />
            </div>
          )}
          {attachment.kind !== "audio" && (
            <p className="min-w-0 flex-1 truncate text-xs text-gray-300">{attachment.file.name}</p>
          )}

          <button
            type="button"
            onClick={() => setAttachment(null)}
            disabled={sending}
            title={t("chat.remove")}
            className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {sending && attachment && (
        <div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#1D2C20]">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--primary)" }}
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            {t("chat.uploading").replace("{p}", progress)}
          </p>
        </div>
      )}

      {tasks && tasks.length > 0 && !recorder.recording && (
        <select
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="w-full rounded-xl bg-[#1D2C20] px-3 py-2 text-xs text-white outline-none"
          style={cardStyle}
        >
          <option value="">{t("chat.tagTask")}</option>
          {tasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.title}
            </option>
          ))}
        </select>
      )}

      {recorder.recording ? (
        <div className="flex items-center gap-3 rounded-xl bg-[#1D2C20] px-3 py-2">
          <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
          <span className="flex-1 text-sm text-white">
            {t("chat.recording")} {formatTimer(recorder.seconds)}
          </span>

          <button
            type="button"
            onClick={recorder.cancel}
            title={t("chat.cancelRecording")}
            className="rounded-full p-3 text-gray-300 hover:bg-white/10 hover:text-red-300"
          >
            <FaTrash />
          </button>

          <button
            type="button"
            onClick={recorder.stop}
            title={t("chat.stopRecording")}
            className="rounded-full p-3 text-white"
            style={{ background: "var(--primary)" }}
          >
            <FaStop />
          </button>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={[...IMAGE_TYPES, ...VIDEO_TYPES].join(",")}
            onChange={handlePickFile}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending || Boolean(attachment)}
            title={t("chat.attach")}
            className="rounded-full p-3 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <FaPaperclip />
          </button>

          <button
            type="button"
            onClick={handleMic}
            disabled={sending || Boolean(attachment)}
            title={t("chat.record")}
            className="rounded-full p-3 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <FaMicrophone />
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            rows={1}
            maxLength={2000}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.placeholder")}
            className="max-h-[120px] min-w-0 flex-1 resize-none rounded-2xl bg-[#1D2C20] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500"
            style={cardStyle}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            title={t("chat.send")}
            className="rounded-full p-3 text-white transition disabled:opacity-40"
            style={{ background: "var(--primary)" }}
          >
            <FaPaperPlane />
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatComposer;
