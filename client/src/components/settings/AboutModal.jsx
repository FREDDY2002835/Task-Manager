import { FaTimes, FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb, SiExpress, SiTailwindcss } from "react-icons/si";
import { useLanguage } from "../../context/LanguageContext";

function AboutModal({ onClose }) {
  const { t } = useLanguage();
  const steps = t("about.steps"); // array, pulled straight from the dictionary

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="w-full max-w-lg bg-[#162117] rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto" style={{ borderWidth: 1, borderColor: "var(--primary-dark)" }}>

        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <span className="text-lg font-bold" style={{ color: "var(--primary-light)" }}>T</span>
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

        <p className="font-semibold text-sm mb-4" style={{ color: "var(--primary-light)" }}>
          {t("about.tagline")}
        </p>

        <p className="text-sm text-gray-300 leading-6 mb-6">
          {t("about.description")}
        </p>

        <div className="flex items-center justify-between mb-6 text-sm">
          <span className="text-gray-400">{t("about.versionLabel")}</span>
          <span className="text-white font-medium">1.0.0</span>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            {t("about.builtWith")}
          </p>

          <div className="flex flex-wrap gap-4 text-2xl text-gray-400">
            <FaReact title="React" className="transition" style={{ color: "var(--primary-light)" }} />
            <FaNodeJs title="Node.js" className="transition" style={{ color: "var(--primary-light)" }} />
            <SiExpress title="Express" className="transition" style={{ color: "var(--primary-light)" }} />
            <SiMongodb title="MongoDB" className="transition" style={{ color: "var(--primary-light)" }} />
            <SiTailwindcss title="Tailwind CSS" className="transition" style={{ color: "var(--primary-light)" }} />
          </div>
        </div>

        <div className="border-t pt-6">

          <h3 className="text-lg font-bold text-white mb-4">
            {t("about.guideTitle")}
          </h3>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-semibold" style={{ color: "var(--primary-light)" }}>
                  {step.title}
                </h4>
                <p className="mt-1 text-sm text-gray-300 leading-6">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-8 rounded-xl transition py-3 text-sm font-semibold text-white" style={{ background: "var(--primary)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-dark)")} onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
        >
          {t("about.close")}
        </button>

      </div>
    </div>
  );
}

export default AboutModal;
