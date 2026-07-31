// src/components/profile/ProductivityCard.jsx

function ProductivityCard({ stats, loading }) {
  const weeklyGoalPercent = loading ? 0 : stats.weeklyGoalPercent;
  const monthlyProgressPercent = loading ? 0 : stats.monthlyProgressPercent;
  const completedThisWeek = loading ? "-" : stats.completedThisWeek;
  const productivityScore = loading ? "-" : stats.productivityScore;

  return (
    <div
      className="rounded-2xl p-5 sm:p-8 border"
      style={{
        background: "#162117",
        borderColor: "var(--primary-dark)",
      }}
    >

      <h2 className="text-xl lg:text-2xl font-bold text-white mb-8">
        Productivity
      </h2>


      <div className="space-y-8">


        {/* Weekly Goal */}

        <div>

          <div className="flex justify-between text-sm">

            <span className="text-gray-300">
              Weekly Goal
            </span>

            <span style={{ color: "var(--primary-light)" }}>
              {loading ? "-" : `${weeklyGoalPercent}%`}
            </span>

          </div>


          <div className="mt-2 h-3 rounded-full bg-gray-700">

            <div
              className="h-3 rounded-full transition-all"
              style={{
                background: "var(--primary)",
                width: `${weeklyGoalPercent}%`,
              }}
            ></div>

          </div>

        </div>



        {/* Monthly Progress */}

        <div>

          <div className="flex justify-between text-sm">

            <span className="text-gray-300">
              Monthly Progress
            </span>

            <span style={{ color: "var(--primary-light)" }}>
              {loading ? "-" : `${monthlyProgressPercent}%`}
            </span>

          </div>


          <div className="mt-2 h-3 rounded-full bg-gray-700">

            <div
              className="h-3 rounded-full transition-all"
              style={{
                background: "var(--primary)",
                width: `${monthlyProgressPercent}%`,
              }}
            ></div>

          </div>

        </div>




        {/* Achievement */}

        <div
          className="rounded-xl p-5"
          style={{
            background: "#1D2C20",
          }}
        >

          <h3 className="text-lg font-semibold text-white">
            🏆 Achievement
          </h3>


          <p className="mt-3 text-sm lg:text-base text-gray-300">

            You completed{" "}

            <strong style={{ color: "var(--primary-light)" }}>
              {completedThisWeek} task{completedThisWeek === 1 ? "" : "s"}
            </strong>

            {" "}this week.
            {!loading && completedThisWeek > 0
              ? " Keep up the amazing work!"
              : " Get started on a task today!"}

          </p>

        </div>




        {/* Productivity Score */}

        <div
          className="rounded-xl p-5 border"
          style={{
            background: "#102417",
            borderColor: "var(--primary-dark)",
          }}
        >

          <p className="text-xs uppercase tracking-wider text-gray-400">
            Productivity Score
          </p>


          <h2
            className="mt-2 text-3xl font-bold"
            style={{
              color: "var(--primary-light)",
            }}
          >
            {loading ? "-" : `${productivityScore}%`}
          </h2>


          <p className="mt-2 text-sm text-gray-400">
            Based on your all-time task completion rate.
          </p>


        </div>


      </div>

    </div>
  );
}

export default ProductivityCard;
