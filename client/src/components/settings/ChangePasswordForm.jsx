import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { changePassword } from "../../services/api";

function ChangePasswordForm({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await changePassword({ currentPassword, newPassword });
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to change password:", err);
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md bg-[#162117] rounded-2xl shadow-2xl p-5 sm:p-8" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Change Password</h2>

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

        {success && (
          <p className="mb-4 text-sm rounded-lg px-3 py-2" style={{ color: "var(--primary-light)", borderWidth: 1, borderColor: "var(--primary-dark)" }}>
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
            />
          </div>

          <div>
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
            />
          </div>

          <div>
            <label className="block mb-1 text-xs sm:text-sm text-gray-300">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl bg-[#1D2C20] px-4 py-3 outline-none text-sm text-white" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-3 text-sm text-gray-300 hover:bg-[#1D2C20] transition" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
            >
              Close
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl transition py-3 text-sm font-semibold text-white disabled:opacity-60" style={{ background: "var(--primary)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-dark)")} onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
            >
              {submitting ? "Saving..." : "Update Password"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default ChangePasswordForm;
