// src/components/stats/StatsHeader.jsx

import { FaChartLine } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

function StatsHeader() {
  const { t } = useLanguage();
  const monthName = new Date().toLocaleDateString(undefined, { month: "long" });

  return (
    <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] border border-green-900 p-5 sm:p-8 lg:p-10">

      <div className="absolute -top-10 -right-10 h-48 w-48 lg:h-72 lg:w-72 rounded-full bg-green-500 opacity-20 blur-3xl"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">

        <div>

          <div className="flex items-center gap-3">

            <FaChartLine className="text-2xl lg:text-4xl text-green-400" />

            <h1 className="text-2xl lg:text-5xl font-bold text-white">
              {t("stats.title")}
            </h1>

          </div>

          <p className="mt-3 text-sm lg:text-base text-gray-300">
            {t("stats.subtitle")}
          </p>

        </div>

        <div className="rounded-xl bg-[#162117] border border-green-900 px-6 py-4 text-center">

          <p className="text-xs uppercase tracking-wider text-gray-400">
            {t("stats.thisMonth")}
          </p>

          <h2 className="mt-2 text-2xl lg:text-4xl font-bold text-green-400">
            {monthName}
          </h2>

        </div>

      </div>

    </section>
  );
}

export default StatsHeader;
