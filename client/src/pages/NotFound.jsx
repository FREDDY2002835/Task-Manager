import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#08110A] flex items-center justify-center px-6">

      {/* Background Glow */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-green-500 opacity-10 blur-[180px]"></div>

      <div className="relative z-10 max-w-3xl w-full text-center">

        {/* Icon */}
        <div className="mx-auto w-28 h-28 rounded-full bg-[#162117] border border-green-900 flex items-center justify-center shadow-2xl">
          <FaExclamationTriangle className="text-5xl text-green-400" />
        </div>

        {/* Error Code */}
        <h1 className="mt-10 text-8xl md:text-9xl font-extrabold text-white">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-4xl font-bold text-green-400">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto leading-8">
          The page you're looking for doesn't exist, may have been moved,
          or the URL might be incorrect.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">

          <Link
            to="/"
            className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 transition px-8 py-4 rounded-xl font-semibold text-white"
          >
            <FaHome />
            Back to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-3 border border-green-500 hover:bg-green-500 transition px-8 py-4 rounded-xl font-semibold text-white"
          >
            <FaArrowLeft />
            Go Back
          </button>

        </div>

        {/* Branding */}
        <div className="mt-20 border-t border-green-900 pt-8">

          <h3 className="text-2xl font-bold text-white">
            TaskFlow
          </h3>

          <p className="text-gray-500 mt-2">
            Organize. Focus. Deliver.
          </p>

        </div>

      </div>

    </div>
  );
}

export default NotFound;