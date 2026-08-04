import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";
import PageTransition from "../components/PageTransition";
import { forgotPassword } from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await forgotPassword(email);
      setSuccess(res.data.message || "If an account with that email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#08110A] flex items-center justify-center px-5 py-4">

        <div className="w-full max-w-md">

          <div className="text-center mb-6 sm:mb-10">

            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-green-500/10 border border-green-700 shadow-lg">
              <span className="text-2xl sm:text-4xl font-bold text-green-400">T</span>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">TaskFlow</h1>

          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-[#162117] border border-green-900 rounded-2xl shadow-2xl p-5 sm:p-8"
          >

            <h2 className="text-xl sm:text-3xl font-bold text-white">Forgot Password?</h2>

            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              Enter your email and we'll send you a link to reset your password.
            </p>

            {error && (
              <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="mt-4 text-sm text-green-400 bg-green-500/10 border border-green-900 rounded-lg px-3 py-2">
                {success}
              </p>
            )}

            <div className="mt-8">

              <label className="block mb-1 text-xs sm:text-sm text-gray-300">Email Address</label>

              <div className="flex items-center rounded-xl border border-green-900 bg-[#1D2C20] px-4">

                <FaEnvelope className="text-gray-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@example.com"
                  className="w-full bg-transparent px-3 py-3 sm:px-4 sm:py-4 outline-none text-sm sm:text-base text-white placeholder:text-gray-500"
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
              {!submitting && <FaArrowRight />}
            </button>

            <p className="text-center text-xs sm:text-sm text-gray-400 mt-6">
              Remembered your password?
              <Link to="/login" className="ml-2 font-semibold text-green-400 hover:text-green-300">
                Back to Login
              </Link>
            </p>

          </form>

        </div>

      </div>
    </PageTransition>
  );
}

export default ForgotPassword;
