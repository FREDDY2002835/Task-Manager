import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

// Full-screen photo viewer, similar to tapping a profile photo in
// WhatsApp - dark backdrop fades in, image scales/fades in smoothly.
// Wrap the conditional render of this component in <AnimatePresence>
// in the parent so the exit animation plays before it unmounts, e.g.:
//   <AnimatePresence>
//     {show && <ImageLightbox ... />}
//   </AnimatePresence>
function ImageLightbox({ src, alt = "Photo", onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 px-4"
      onClick={onClose}
    >
      <motion.button
        type="button"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
      >
        <FaTimes size={20} />
      </motion.button>

      <motion.img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="max-w-full max-h-[85vh] rounded-lg object-contain"
      />
    </motion.div>
  );
}

export default ImageLightbox;
