import { useState } from "react";
import { FaTimes } from "react-icons/fa";

// Modal form for editing the logged-in user's profile fields.
function ProfileEditForm({ user, onSubmit, onClose, submitting }) {
  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setError("");
    onSubmit({ name, title, bio, phone, location, avatar });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg bg-[#162117] border border-green-900 rounded-2xl shadow-2xl p-5 sm:p-8 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Edit Profile</h2>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-green-900 bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack Developer"
              className="w-full rounded-xl border border-green-900 bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-green-900 bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs sm:text-sm text-gray-300">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+256 700 000000"
                className="w-full rounded-xl border border-green-900 bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs sm:text-sm text-gray-300">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full rounded-xl border border-green-900 bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-green-900 bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-green-900 py-3 text-sm text-gray-300 hover:bg-[#1D2C20] transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-green-500 hover:bg-green-600 transition py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default ProfileEditForm;
