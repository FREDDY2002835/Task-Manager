import { motion } from "framer-motion";

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.02, y: -20 }}
      transition={{
        duration: 0.30,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;