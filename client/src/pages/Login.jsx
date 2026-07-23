import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

function Login() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#08110A]">

      {/* LEFT SIDE */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">

        {/* Green Glow */}
        <div className="absolute w-[700px] h-[700px] rounded-full bg-green-500 opacity-20 blur-[150px]"></div>

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#08110A] via-[#102417] to-[#18452A]"></div>

        <div className="relative z-10 max-w-xl px-10">

          <div className="w-20 h-1 bg-green-500 rounded mb-8"></div>

          <h1 className="text-6xl font-extrabold text-white leading-tight">
            TaskFlow
          </h1>

          <h2 className="text-5xl font-bold text-green-400 mt-8">
            Organize.
            <br />
            Focus.
            <br />
            Deliver.
          </h2>

          <p className="mt-8 text-lg text-gray-300 leading-8">
            Manage your projects, organize your work, and stay productive
            with a modern task management platform designed for developers
            and teams.
          </p>

          <div className="mt-12 flex gap-10">

            <div>
              <h3 className="text-4xl font-bold text-green-400">10K+</h3>
              <p className="text-gray-400 mt-2">Active Users</p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-green-400">500K+</h3>
              <p className="text-gray-400 mt-2">Tasks Completed</p>
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center justify-center px-6">

        <div className="w-full max-w-md bg-[#162117] border border-green-900 rounded-3xl p-10 shadow-2xl">

          <h2 className="text-4xl font-bold text-white">
            Welcome Back
          </h2>

          <p className="text-gray-400 mt-3">
            Login to continue to TaskFlow.
          </p>

          {/* Email */}

          <div className="mt-10">

            <label className="text-gray-300 mb-2 block">
              Email Address
            </label>

            <div className="flex items-center bg-[#1D2C20] rounded-xl px-4 border border-green-900">

              <FaEnvelope className="text-gray-500" />

              <input
                type="email"
                placeholder="john@example.com"
                className="w-full bg-transparent p-4 outline-none text-white placeholder:text-gray-500"
              />

            </div>

          </div>

          {/* Password */}

          <div className="mt-6">

            <label className="text-gray-300 mb-2 block">
              Password
            </label>

            <div className="flex items-center bg-[#1D2C20] rounded-xl px-4 border border-green-900">

              <FaLock className="text-gray-500" />

              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent p-4 outline-none text-white placeholder:text-gray-500"
              />

            </div>

          </div>

          {/* Remember */}

          <div className="flex justify-between items-center mt-6">

            <label className="flex items-center gap-2 text-gray-400">

              <input type="checkbox" />

              Remember me

            </label>

            <button className="text-green-400 hover:text-green-300">
              Forgot Password?
            </button>

          </div>

          {/* Login */}

          <button className="w-full mt-8 bg-green-500 hover:bg-green-600 transition rounded-xl py-4 font-semibold flex justify-center items-center gap-3">

            Login

            <FaArrowRight />

          </button>

          {/* Register */}

          <p className="text-center text-gray-400 mt-8">

            Don't have an account?

            <Link
              to="/register"
              className="text-green-400 ml-2 hover:text-green-300 font-semibold"
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