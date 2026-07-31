import MainLayout from "../layouts/MainLayout";
import ThemeSwitcher from "../components/ThemeSwitcher";
import PageTransition from "../components/PageTransition";

import {
  FaCog,
  FaUser,
  FaBell,
  FaPalette,
  FaLanguage,
  FaInfoCircle,
  FaChevronRight,
} from "react-icons/fa";


function Settings() {
  return (
    <PageTransition>
      <MainLayout>
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-8">

          {/* Header */}
          <div
            className="rounded-2xl p-4 sm:p-6 lg:p-8 border"
            style={{
              borderColor: "var(--primary-dark)",
              background:
                "linear-gradient(135deg,#08110A,#102417,#18452A)",
            }}
          >
            <div className="flex items-center gap-3 sm:gap-4">

              <div
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center"
                style={{ background: "var(--primary)" }}
              >
                <FaCog className="text-white text-base sm:text-xl lg:text-2xl" />
              </div>

              <div>

                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">
                  Settings
                </h1>

                <p className="text-[11px] sm:text-sm lg:text-base text-gray-400">
                  Customize your TaskFlow experience.
                </p>

              </div>

            </div>
          </div>

          {/* Appearance */}
          <div
            className="rounded-2xl p-4 sm:p-6 border"
            style={{
              borderColor: "var(--primary-dark)",
              background: "#162117",
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4">

              <FaPalette
                className="text-sm sm:text-lg lg:text-xl"
                style={{ color: "var(--primary-light)" }}
              />

              <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-white">
                Appearance
              </h2>

            </div>

            <ThemeSwitcher />
          </div>

          {/* Account */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: "var(--primary-dark)",
              background: "#162117",
            }}
          >
            <SettingItem icon={<FaUser />} title="Account" />
            <SettingItem title="Edit Profile" />
            <SettingItem title="Change Password" />
          </div>

          {/* Notifications */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: "var(--primary-dark)",
              background: "#162117",
            }}
          >
            <SettingItem icon={<FaBell />} title="Notifications" />
            <SettingItem title="Task Reminders" />
            <SettingItem title="Email Notifications" />
          </div>

          {/* Language */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: "var(--primary-dark)",
              background: "#162117",
            }}
          >
            <SettingItem
              icon={<FaLanguage />}
              title="Language"
              value="English"
            />
          </div>

          {/* About */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: "var(--primary-dark)",
              background: "#162117",
            }}
          >
            <SettingItem
              icon={<FaInfoCircle />}
              title="About TaskFlow"
            />

            <div className="px-4 py-3 sm:px-5 sm:py-4 text-[11px] sm:text-sm text-gray-400">
              Version 1.0.0
            </div>
          </div>

        </div>
      </MainLayout>
    </PageTransition>
  );
}

function SettingItem({ icon, title, value }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b last:border-none"
      style={{
        borderColor: "rgba(255,255,255,.05)",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3">

        {icon && (
          <div
            className="text-xs sm:text-base"
            style={{
              color: "var(--primary-light)",
            }}
          >
            {icon}
          </div>
        )}

        <span className="text-[11px] sm:text-sm lg:text-base text-white">
          {title}
        </span>

      </div>

      <div className="flex items-center gap-2 sm:gap-3">

        {value && (
          <span className="text-[11px] sm:text-sm text-gray-400">
            {value}
          </span>
        )}

        <FaChevronRight className="text-gray-500 text-xs sm:text-sm" />

      </div>
    </div>
  );
}

export default Settings;