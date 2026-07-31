import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import StatsCards from "../components/profile/StatsCards";
import PersonalInfo from "../components/profile/PersonalInfo";
import ProductivityCard from "../components/profile/ProductivityCard";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import { getTaskStats, getProductivityStats, updateMe } from "../services/api";

function Profile() {
  const { user, setUser } = useAuth();

  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [productivity, setProductivity] = useState({
    weeklyGoalPercent: 0,
    monthlyProgressPercent: 0,
    completedThisWeek: 0,
    productivityScore: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const [showEditForm, setShowEditForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoadingStats(true);
    Promise.all([getTaskStats(), getProductivityStats()])
      .then(([statsRes, productivityRes]) => {
        setTaskStats(statsRes.data);
        setProductivity(productivityRes.data);
      })
      .catch((err) => console.error("Failed to load profile stats:", err))
      .finally(() => setLoadingStats(false));
  }, []);

  const handleSaveProfile = async (data) => {
    try {
      setSubmitting(true);
      setError("");
      const res = await updateMe(data);
      setUser((prev) => ({ ...prev, ...res.data.user }));
      setShowEditForm(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <MainLayout>

        <div className="max-w-7xl mx-auto space-y-8">

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-900 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Profile Header */}
          <ProfileHeader user={user} onEditClick={() => setShowEditForm(true)} />

          {/* Statistics Cards */}
          <StatsCards stats={taskStats} loading={loadingStats} />

          {/* Personal Information & Productivity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            <PersonalInfo user={user} />

            <ProductivityCard stats={productivity} loading={loadingStats} />

          </div>

        </div>

        {showEditForm && (
          <ProfileEditForm
            user={user}
            submitting={submitting}
            onSubmit={handleSaveProfile}
            onClose={() => setShowEditForm(false)}
          />
        )}

      </MainLayout>
    </PageTransition>
  );
}

export default Profile;
