import crypto from "crypto";
import fs from "fs";
import path from "path";

// Chat files live OUTSIDE the public "uploads" folder (which server.js
// serves to everyone). They are only reachable through signed,
// expiring links created below, which are only handed to group members.
export const CHAT_DIR = path.join(process.cwd(), "private", "chat");
fs.mkdirSync(CHAT_DIR, { recursive: true });

const MB = 1024 * 1024;

// What may be uploaded. The stored file's extension comes from THIS table,
// never from the user's filename - so an uploaded "evil.html" can never be
// stored (or served) as HTML.
export const MEDIA_RULES = {
  image: {
    maxBytes: 10 * MB,
    types: {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
    },
  },
  video: {
    maxBytes: 50 * MB,
    types: {
      "video/mp4": ".mp4",
      "video/webm": ".webm",
      "video/quicktime": ".mov",
    },
  },
  audio: {
    maxBytes: 15 * MB,
    types: {
      "audio/webm": ".weba",
      "audio/ogg": ".ogg",
      "audio/mp4": ".m4a",
      "audio/x-m4a": ".m4a",
      "audio/mpeg": ".mp3",
      "audio/aac": ".aac",
      "audio/wav": ".wav",
    },
  },
};

export const MAX_UPLOAD_BYTES = Math.max(
  ...Object.values(MEDIA_RULES).map((r) => r.maxBytes)
);

// "audio/webm;codecs=opus" -> "audio/webm"
export const baseMime = (mime = "") => mime.split(";")[0].trim().toLowerCase();

// Returns { kind, ext, maxBytes, mime } or null if the type isn't allowed.
export function classifyMime(mime) {
  const base = baseMime(mime);
  for (const [kind, rule] of Object.entries(MEDIA_RULES)) {
    if (rule.types[base]) {
      return { kind, ext: rule.types[base], maxBytes: rule.maxBytes, mime: base };
    }
  }
  return null;
}

export const newFilename = (ext) => crypto.randomBytes(16).toString("hex") + ext;

// Only names we generate ourselves are valid - blocks "../" tricks.
export const isValidFilename = (name) => /^[a-f0-9]{32}\.[a-z0-9]{2,5}$/.test(name);

export const filePathFor = (filename) => path.join(CHAT_DIR, filename);

export const deleteMediaFile = (filename) =>
  filename ? fs.promises.unlink(filePathFor(filename)).catch(() => {}) : Promise.resolve();

// ---------------- signed links ----------------

const signature = (filename, exp) =>
  crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(`chat:${filename}:${exp}`)
    .digest("hex");

const LINK_TTL_SECONDS = 24 * 60 * 60;

// Link valid for ~24h. The expiry is rounded up to the next hour so the
// same file keeps the same URL for a while, which lets browsers cache it.
export function signedMediaPath(filename) {
  const now = Math.floor(Date.now() / 1000);
  const exp = Math.ceil((now + LINK_TTL_SECONDS) / 3600) * 3600;
  return `/api/media/chat/${filename}?exp=${exp}&sig=${signature(filename, exp)}`;
}

export function verifySignature(filename, exp, sig) {
  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum < Date.now() / 1000) return false;
  if (typeof sig !== "string") return false;

  const expected = Buffer.from(signature(filename, expNum));
  const given = Buffer.from(sig);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}
