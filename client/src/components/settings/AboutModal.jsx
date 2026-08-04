import { FaTimes, FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiExpress, SiTailwindcss } from "react-icons/si";
import { useLanguage } from "../../context/LanguageContext";

function AboutModal({ onClose }) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md bg-[#162117] border border-green-900 rounded-2xl shadow-2xl p-6 sm:p-8">

        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-700 flex items-center justify-center">
              <span className="text-lg font-bold text-green-400">T</span>
            </div>
            <h2 className="text-xl font-bold text-white">{t("about.heading")}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400"
          >
            <FaTimes />
          </button>
        </div>

        <p className="text-green-400 font-semibold text-sm mb-4">
          {t("about.tagline")}
        </p>

        <p className="text-sm text-gray-300 leading-6 mb-6">
          {t("about.description")}
        </p>

        <div className="flex items-center justify-between mb-6 text-sm">
          <span className="text-gray-400">{t("about.versionLabel")}</span>
          <span className="text-white font-medium">1.0.0</span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            {t("about.builtWith")}
          </p>

          <div className="flex flex-wrap gap-4 text-2xl text-gray-400">
            <FaReact title="React" className="hover:text-green-400 transition" />
            <FaNodeJs title="Node.js" className="hover:text-green-400 transition" />
            <SiExpress title="Express" className="hover:text-green-400 transition" />
            <SiMongodb title="MongoDB" className="hover:text-green-400 transition" />
            <SiTailwindcss title="Tailwind CSS" className="hover:text-green-400 transition" />
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-8 rounded-xl bg-green-500 hover:bg-green-600 transition py-3 text-sm font-semibold text-white"
        >
          {t("about.close")}
        </button>

      </div>
    </div>
  );
}

export default AboutModal;
