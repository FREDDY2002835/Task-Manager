import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PageTransition from "../components/PageTransition";
import { getTaskStats } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaPlus,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTaskStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#08110A] via-[#0D1F10] to-[#12351A] p-5 sm:p-8 lg:p-12">

          {/* Glow Effects */}
          <div
          className="absolute -right-10 -top-10 h-48 w-48 md:h-72 md:w-72 lg:h-96 lg:w-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "var(--primary)" }}
        ></div>

          <div
          className="absolute right-5 bottom-0 h-40 w-40 md:h-60 md:w-60 lg:h-72 lg:w-72 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "var(--primary-light)" }}
        ></div>

          <div className="relative z-10 max-w-2xl">

            <div className="w-16 sm:w-20 h-1 rounded mb-6 bg-[var(--primary)]"></div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
              {t("dashboard.title1")}
              <br />
              {t("dashboard.title2")}
              <br />
              {t("dashboard.title3")}
            </h1>

            <p className="mt-6 text-sm sm:text-base lg:text-lg text-gray-300 leading-6 lg:leading-8">
              {t("dashboard.welcome")}
              <br />
              {t("dashboard.subtitle")}
            </p>

            <button
              onClick={() => navigate("/tasks")}
              className="mt-8 w-full sm:w-fit flex items-center justify-center gap-3 border border-[var(--primary)] px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-white hover:bg-[var(--primary)] transition duration-300"
            >

              <FaPlus />

              {t("dashboard.createTask")}

            </button>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-[#162117] border border-[var(--primary-dark)] rounded-2xl p-6 hover:-translate-y-1 transition duration-300">

            <FaTasks className="text-4xl text-[var(--primary-light)] mb-5" />

            <p className="text-gray-400 text-sm">
              {t("dashboard.totalTasks")}
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2">
              {loading ? "-" : stats.total}
            </h2>

          </div>

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:-translate-y-1 transition duration-300">

            <FaCheckCircle className="text-4xl text-[var(--primary-light)] mb-5" />

            <p className="text-gray-400 text-sm">
              {t("dashboard.completed")}
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--primary-light)] mt-2">
              {loading ? "-" : stats.completed}
            </h2>

          </div>

          <div className="bg-[#162117] border border-green-900 rounded-2xl p-6 hover:-translate-y-1 transition duration-300">

            <FaClock className="text-4xl text-yellow-400 mb-5" />

            <p className="text-gray-400 text-sm">
              {t("dashboard.pending")}
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mt-2">
              {loading ? "-" : stats.pending}
            </h2>

          </div>

        </section>


      </div>
    </MainLayout>
   </PageTransition>
  );
}

export default Dashboard;
