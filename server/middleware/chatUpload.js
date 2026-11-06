import multer from "multer";
import {
  CHAT_DIR,
  MAX_UPLOAD_BYTES,
  classifyMime,
  newFilename,
} from "../utils/chatMedia.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CHAT_DIR),
  filename: (req, file, cb) => {
    // Random name + extension chosen from our allow-list (see chatMedia.js)
    cb(null, newFilename(classifyMime(file.mimetype).ext));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!classifyMime(file.mimetype)) {
      return cb(
        new Error(
          "Unsupported file type. Use JPG/PNG/WEBP/GIF photos, MP4/WEBM/MOV videos, or audio."
        )
      );
    }
    cb(null, true);
  },
});

// Wraps multer so its errors become a clean JSON 400 instead of a crash.
// Expects the file in the "media" field.
export const uploadChatMedia = (req, res, next) => {
  upload.single("media")(req, res, (err) => {
    if (!err) return next();

    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "That file is too large."
        : err.message || "Upload failed.";

    res.status(400).json({ message });
  });
};
