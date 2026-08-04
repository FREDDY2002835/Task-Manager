import { FaUser } from "react-icons/fa";

// Shows the user's real photo if they have one, otherwise a generic
// silhouette icon (like WhatsApp/most apps do) instead of a random
// stock photo. sizeClass controls both the img and the fallback so
// they line up exactly wherever this is used.
function Avatar({ src, alt = "Profile", sizeClass = "w-24 h-24", className = "", style }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover ${className}`}
        style={style}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center bg-gray-700 ${className}`}
      style={style}
    >
      <FaUser className="text-gray-300 w-1/2 h-1/2" />
    </div>
  );
}

export default Avatar;
