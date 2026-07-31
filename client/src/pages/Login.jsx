import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
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

        {/* Your dashboard content */}

    <div className="min-h-screen bg-[#08110A] flex items-center justify-center px-5 py-4">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="text-center mb-6 sm:mb-10">

         <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-green-500/10 border border-green-700 shadow-lg">

           <span className="text-2xl sm:text-4xl font-bold text-green-400">
              T
            </span>

          </div>

         <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
            TaskFlow
          </h1>

         <p className="mt-1 text-xs sm:text-base text-gray-400">
            Organize. Focus. Deliver.
          </p>

        </div>

        {/* Login Card */}

       <form
        onSubmit={handleSubmit}
        className="bg-[#162117] border border-green-900 rounded-2xl shadow-2xl p-5 sm:p-8"
       >

        <h2 className="text-xl sm:text-3xl font-bold text-white">
            Welcome Back !
          </h2>

         <p className="mt-1 text-xs sm:text-sm text-gray-400">
            Login to continue managing your tasks.
          </p>

          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Email */}

          <div className="mt-8">

            <label className="block mb-1 text-xs sm:text-sm text-gray-300">
              Email Address
            </label>

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

          {/* Password */}

          <div className="mt-5">

            <label className="block mb-2 text-gray-300">
              Password
            </label>

            <div className="flex items-center rounded-xl border border-green-900 bg-[#1D2C20] px-4">

              <FaLock className="text-gray-500" />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
               className="w-full bg-transparent px-3 py-3 sm:px-4 sm:py-4 outline-none text-sm sm:text-base text-white placeholder:text-gray-500"
              />

            </div>

          </div>

          {/* Options */}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">

              <input
                type="checkbox"
                className="accent-green-500"
              />

              Remember me

            </label>

            <button type="button" className="text-xs sm:text-sm text-green-400 hover:text-green-300">

              Forgot Password?

            </button>

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
            {!submitting && <FaArrowRight />}
          </button>

          {/* Divider */}

         <div className="flex items-center gap-3 my-6">

            <div className="flex-1 h-px bg-green-900"></div>

           <span className="text-gray-500 text-xs sm:text-sm">
              OR
            </span>

            <div className="flex-1 h-px bg-green-900"></div>

          </div>

          {/* Register */}

         <p className="text-center text-xs sm:text-sm text-gray-400">

            Don't have an account?

            <Link
              to="/register"
              className="ml-2 font-semibold text-green-400 hover:text-green-300"
            >
              Create One
            </Link>

          </p>

        </form>

      </div>

    </div>

    </PageTransition>
  );
}

export default Login;
