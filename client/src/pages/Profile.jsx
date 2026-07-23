import MainLayout from "../layouts/MainLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import StatsCards from "../components/profile/StatsCards";
import PersonalInfo from "../components/profile/PersonalInfo";
import ProductivityCard from "../components/profile/ProductivityCard";
import ThemeSwitcher from "../components/ThemeSwitcher";

function Profile() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Profile Header */}
        <ProfileHeader />

        {/* Statistics Cards */}
        <StatsCards />

        {/* Personal Information & Productivity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          <PersonalInfo />

          <ProductivityCard />

        </div>

        {/* Theme Settings */}
        <ThemeSwitcher />

      </div>
    </MainLayout>
  );
}

export default Profile;