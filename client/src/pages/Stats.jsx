import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageTransition from "../components/PageTransition";

import StatsHeader from "../components/stats/StatsHeader";
import SummaryCards from "../components/stats/SummaryCards";
import WeeklyChart from "../components/stats/WeeklyChart";
import PriorityChart from "../components/stats/PriorityChart";
import CategoryChart from "../components/stats/CategoryChart";
import RecentActivity from "../components/stats/RecentActivity";

import { getTaskStats, getProductivityStats, getAnalyticsStats } from "../services/api";

function Stats() {
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [productivity, setProductivity] = useState({ productivityScore: 0 });
  const [analytics, setAnalytics] = useState({
    weekly: [],
    priority: { High: 0, Medium: 0, Low: 0 },
    categories: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getTaskStats(), getProductivityStats(), getAnalyticsStats()])
      .then(([statsRes, productivityRes, analyticsRes]) => {
        setTaskStats(statsRes.data);
        setProductivity(productivityRes.data);
        setAnalytics(analyticsRes.data);
      })
      .catch((err) => console.error("Failed to load analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
     <PageTransition>

    <MainLayout>

      <div className="max-w-7xl mx-auto space-y-8">

        <StatsHeader />

        <SummaryCards taskStats={taskStats} productivity={productivity} loading={loading} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          <WeeklyChart weekly={analytics.weekly} loading={loading} />

          <PriorityChart priority={analytics.priority} loading={loading} />

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          <CategoryChart categories={analytics.categories} loading={loading} />

          <RecentActivity activity={analytics.recentActivity} loading={loading} />

        </div>

      </div>

    </MainLayout>
     </PageTransition>
  );
}

export default Stats;
