import MainLayout from "../layouts/MainLayout";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { FaCog } from "react-icons/fa";

function Settings() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-[#08110A] via-[#102417] to-[#18452A] border border-[var(--primary-dark)] p-6 md:p-8">

          <div className="flex items-center gap-4">

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <FaCog className="text-white text-xl" />
            </div>

            <div>

              <h1 className="text-2xl md:text-4xl font-bold text-white">
                Settings
              </h1>

              <p className="text-gray-400 text-sm md:text-base">
                Customize your TaskFlow experience.
              </p>

            </div>

          </div>

        </div>

        <ThemeSwitcher />

      </div>
    </MainLayout>
  );
}

export default Settings;