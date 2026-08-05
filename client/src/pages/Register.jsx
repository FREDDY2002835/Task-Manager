import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen lg:grid lg:grid-cols-2 bg-[#08110A]">

        {/* LEFT SIDE (Desktop Only) */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden">

          <div className="absolute w-[700px] h-[700px] rounded-full opacity-20 blur-[150px]" style={{ background: "var(--primary)" }}></div>

          <div className="absolute inset-0 bg-gradient-to-br from-[#08110A] via-[#102417] to-[#18452A]"></div>

          <div className="relative z-10 max-w-xl px-10">

            <div className="w-20 h-1 rounded mb-8" style={{ background: "var(--primary)" }}></div>

            <h1 className="text-6xl font-extrabold text-white">
              TaskFlow
            </h1>

            <h2 className="text-5xl font-bold mt-8 leading-tight" style={{ color: "var(--primary-light)" }}>
              Plan.
              <br />
              Track.
              <br />
              Achieve.
            </h2>

            <p className="mt-8 text-lg text-gray-300 leading-8">
              Create your free account and start organizing your work,
              managing projects, and tracking your progress with TaskFlow.
            </p>

            <div className="mt-12 flex gap-10">

              <div>
                <h3 className="text-4xl font-bold" style={{ color: "var(--primary-light)" }}>
                  10K+
                </h3>

                <p className="text-gray-400 mt-2">
                  Happy Users
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-bold" style={{ color: "var(--primary-light)" }}>
                  99%
                </h3>

                <p className="text-gray-400 mt-2">
                  Productivity Boost
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-5 py-4 sm:px-6 sm:py-10">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl" style={{ background: "var(--primary)" }}>

                <span className="text-2xl font-bold" style={{ color: "var(--primary-light)" }}>
                  T
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-bold text-white">
                TaskFlow
              </h1>

              <p className="mt-1 text-xs text-gray-400">
                Create your free account
              </p>

            </div>

            {/* Register Card */}
            <form
              onSubmit={handleSubmit}
              className="w-full bg-[#162117] rounded-2xl shadow-2xl p-5 sm:p-10" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}
            >

              <h2 className="text-2xl sm:text-4xl font-bold text-white">
                Create Account
              </h2>

              <p className="text-xs sm:text-base text-gray-400 mt-2">
                Join TaskFlow and boost your productivity.
              </p>

              {error && (
                <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Full Name */}
              <div className="mt-6">

                <label className="block mb-1 text-xs sm:text-sm text-gray-300">
                  Full Name
                </label>

                <div className="flex items-center bg-[#1D2C20] rounded-xl px-4" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

                  <FaUser className="text-gray-500 text-sm" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Fill your full name"
                    className="w-full bg-transparent px-3 py-3 sm:p-4 outline-none text-sm sm:text-base text-white placeholder:text-gray-500"
                  />

                </div>

              </div>

              {/* Email */}
              <div className="mt-4">

                <label className="block mb-1 text-xs sm:text-sm text-gray-300">
                  Email Address
                </label>

                <div className="flex items-center bg-[#1D2C20] rounded-xl px-4" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

                  <FaEnvelope className="text-gray-500 text-sm" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    className="w-full bg-transparent px-3 py-3 sm:p-4 outline-none text-sm sm:text-base text-white placeholder:text-gray-500"
                  />

                </div>

              </div>

              {/* Password */}
              <div className="mt-4">

                <label className="block mb-1 text-xs sm:text-sm text-gray-300">
                  Password
                </label>

                <div className="flex items-center bg-[#1D2C20] rounded-xl px-4" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

                  <FaLock className="text-gray-500 text-sm" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent px-3 py-3 sm:p-4 outline-none text-sm sm:text-base text-white placeholder:text-gray-500"
                  />

                </div>

              </div>

              {/* Confirm Password */}
              <div className="mt-4">

                <label className="block mb-1 text-xs sm:text-sm text-gray-300">
                  Confirm Password
                </label>

                <div className="flex items-center bg-[#1D2C20] rounded-xl px-4" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

                  <FaLock className="text-gray-500 text-sm" />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent px-3 py-3 sm:p-4 outline-none text-sm sm:text-base text-white placeholder:text-gray-500"
                  />

                </div>

              </div>

              {/* Terms */}
              <div className="mt-4">

                <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">

                  <input
                    type="checkbox"
                    required
                    style={{ accentColor: "var(--primary)" }}
                  />

                  I agree to the Terms & Conditions

                </label>

              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 transition py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold text-white flex justify-center items-center gap-2 disabled:opacity-60" style={{ background: "var(--primary)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-dark)")} onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
              >

                <FaUserPlus />

                {submitting ? "Creating account..." : "Create Account"}

              </button>

              {/* Login Link */}
              <p className="text-center text-xs sm:text-sm text-gray-400 mt-6">

                Already have an account?

                <Link
                  to="/login"
                  className="ml-2 font-semibold" style={{ color: "var(--primary-light)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-light)")}
                >
                  Login
                </Link>

              </p>

            </form>

          </div>

        </div>

      </div>
    </PageTransition>
  );
}

export default Register;
