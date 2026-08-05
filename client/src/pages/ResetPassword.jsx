import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaLock, FaArrowRight } from "react-icons/fa";
import PageTransition from "../components/PageTransition";
import { resetPassword } from "../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await resetPassword(token, newPassword);
      setSuccess(res.data.message || "Password reset successfully.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "This reset link is invalid or has expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#08110A] flex items-center justify-center px-5 py-4">

        <div className="w-full max-w-md">

          <div className="text-center mb-6 sm:mb-10">

            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl shadow-lg" style={{ background: "var(--primary)" }}>
              <span className="text-2xl sm:text-4xl font-bold" style={{ color: "var(--primary-light)" }}>T</span>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">TaskFlow</h1>

          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-[#162117] rounded-2xl shadow-2xl p-5 sm:p-8" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
          >

            <h2 className="text-xl sm:text-3xl font-bold text-white">Reset Password</h2>

            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              Choose a new password for your account.
            </p>

            {error && (
              <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="mt-4 text-sm rounded-lg px-3 py-2" style={{ color: "var(--primary-light)", borderWidth: 1, borderColor: "var(--primary-dark)" }}>
                {success} Redirecting to login...
              </p>
            )}

            <div className="mt-8">

              <label className="block mb-1 text-xs sm:text-sm text-gray-300">New Password</label>

              <div className="flex items-center rounded-xl bg-[#1D2C20] px-4" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

                <FaLock className="text-gray-500" />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-3 py-3 sm:px-4 sm:py-4 outline-none text-sm sm:text-base text-white placeholder:text-gray-500"
                />

              </div>

            </div>

            <div className="mt-5">

              <label className="block mb-1 text-xs sm:text-sm text-gray-300">Confirm New Password</label>

              <div className="flex items-center rounded-xl bg-[#1D2C20] px-4" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

                <FaLock className="text-gray-500" />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-3 py-3 sm:px-4 sm:py-4 outline-none text-sm sm:text-base text-white placeholder:text-gray-500"
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition disabled:opacity-60" style={{ background: "var(--primary)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-dark)")} onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
            >
              {submitting ? "Saving..." : "Reset Password"}
              {!submitting && <FaArrowRight />}
            </button>

            <p className="text-center text-xs sm:text-sm text-gray-400 mt-6">
              <Link to="/login" className="font-semibold" style={{ color: "var(--primary-light)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-light)")}>
                Back to Login
              </Link>
            </p>

          </form>

        </div>

      </div>
    </PageTransition>
  );
}

export default ResetPassword;
