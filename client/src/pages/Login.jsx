import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

function Login() {
  return (
    <div className="min-h-screen bg-[#08110A] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-500/10 border border-green-700 shadow-lg">

            <span className="text-4xl font-bold text-green-400">
              T
            </span>

          </div>

          <h1 className="mt-5 text-4xl font-extrabold text-white">
            TaskFlow
          </h1>

          <p className="mt-2 text-gray-400">
            Organize. Focus. Deliver.
          </p>

        </div>

        {/* Login Card */}

        <div className="bg-[#162117] border border-green-900 rounded-3xl shadow-2xl p-6 sm:p-8">

          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Login to continue managing your tasks.
          </p>

          {/* Email */}

          <div className="mt-8">

            <label className="block mb-2 text-gray-300">
              Email Address
            </label>

            <div className="flex items-center rounded-xl border border-green-900 bg-[#1D2C20] px-4">

              <FaEnvelope className="text-gray-500" />

              <input
                type="email"
                placeholder="john@example.com"
                className="w-full bg-transparent px-4 py-4 outline-none text-white placeholder:text-gray-500"
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
                placeholder="••••••••"
                className="w-full bg-transparent px-4 py-4 outline-none text-white placeholder:text-gray-500"
              />

            </div>

          </div>

          {/* Options */}

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <label className="flex items-center gap-2 text-sm text-gray-400">

              <input
                type="checkbox"
                className="accent-green-500"
              />

              Remember me

            </label>

            <button className="text-sm text-green-400 hover:text-green-300">

              Forgot Password?

            </button>

          </div>

          {/* Login Button */}

          <button className="mt-8 w-full flex items-center justify-center gap-3 rounded-xl bg-green-500 py-4 font-semibold text-white transition hover:bg-green-600">

            Login

            <FaArrowRight />

          </button>

          {/* Divider */}

          <div className="flex items-center gap-4 my-8">

            <div className="flex-1 h-px bg-green-900"></div>

            <span className="text-gray-500 text-sm">
              OR
            </span>

            <div className="flex-1 h-px bg-green-900"></div>

          </div>

          {/* Register */}

          <p className="text-center text-gray-400">

            Don't have an account?

            <Link
              to="/register"
              className="ml-2 font-semibold text-green-400 hover:text-green-300"
            >
              Create One
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;