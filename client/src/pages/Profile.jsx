import MainLayout from "../layouts/MainLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import StatsCards from "../components/profile/StatsCards";
import PersonalInfo from "../components/profile/PersonalInfo";
import ProductivityCard from "../components/profile/ProductivityCard";

function Profile() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        <ProfileHeader />

        <StatsCards />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          <PersonalInfo />

          <ProductivityCard />

        </div>

      </div>
    </MainLayout>
  );
}

export default Profile;