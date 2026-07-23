import MainLayout from "../layouts/MainLayout";

import StatsHeader from "../components/stats/StatsHeader";
import SummaryCards from "../components/stats/SummaryCards";
import WeeklyChart from "../components/stats/WeeklyChart";
import PriorityChart from "../components/stats/PriorityChart";
import CategoryChart from "../components/stats/CategoryChart";
import RecentActivity from "../components/stats/RecentActivity";

function Stats() {
  return (
    <MainLayout>

      <div className="max-w-7xl mx-auto space-y-8">

        <StatsHeader />

        <SummaryCards />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          <WeeklyChart />

          <PriorityChart />

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          <CategoryChart />

          <RecentActivity />

        </div>

      </div>

    </MainLayout>
  );
}

export default Stats;