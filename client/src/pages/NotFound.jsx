import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import {
  FaHome,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";

function NotFound() {
  return (

    <PageTransition>
      <MainLayout>
        {/* Your dashboard content */}
      
    <div className="min-h-screen bg-[#08110A] flex items-center justify-center px-4 py-8">

      {/* Background Glow */}
      <div className="absolute w-64 h-64 sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full opacity-10 blur-[150px]" style={{ background: "var(--primary)" }}></div>

      <div className="relative z-10 w-full max-w-2xl text-center">

        {/* Error Icon */}

        <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 items-center justify-center rounded-full bg-[#162117] shadow-xl" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

          <FaExclamationTriangle className="text-3xl sm:text-4xl lg:text-5xl" style={{ color: "var(--primary-light)" }} />

        </div>

        {/* Error Code */}

        <h1 className="mt-8 text-6xl sm:text-7xl lg:text-9xl font-extrabold text-white">

          404

        </h1>

        {/* Title */}

        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: "var(--primary-light)" }}>

          Page Not Found

        </h2>

        {/* Description */}

        <p className="mx-auto mt-5 max-w-xl text-sm sm:text-base lg:text-lg leading-7 text-gray-400">

          The page you're looking for doesn't exist, may have been moved,
          or the URL might be incorrect.

        </p>

        {/* Buttons */}

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm lg:text-base font-semibold text-white transition" style={{ background: "var(--primary)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-dark)")} onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
          >

            <FaHome />

            Dashboard

          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm lg:text-base font-semibold text-white transition" style={{ borderWidth: 1, borderColor: "var(--primary)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >

            <FaArrowLeft />

            Go Back

          </button>

        </div>

        {/* Divider */}

        <div className="mt-12 border-t pt-8">

          <h3 className="text-xl lg:text-2xl font-bold text-white">
            TaskFlow
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Organize. Focus. Deliver.
          </p>

        </div>

      </div>

    </div>

    </MainLayout>
    </PageTransition>
  );
}

export default NotFound;