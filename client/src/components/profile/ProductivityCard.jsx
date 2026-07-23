// src/components/profile/ProductivityCard.jsx

function ProductivityCard() {
  return (
    <div className="bg-[#162117] rounded-2xl border border-green-900 p-5 sm:p-8">

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

            <span className="text-green-400">
              80%
            </span>

          </div>

          <div className="mt-2 h-3 rounded-full bg-gray-700">

            <div className="h-3 w-4/5 rounded-full bg-green-500"></div>

          </div>

        </div>

        {/* Monthly Progress */}

        <div>

          <div className="flex justify-between text-sm">

            <span className="text-gray-300">
              Monthly Progress
            </span>

            <span className="text-green-400">
              65%
            </span>

          </div>

          <div className="mt-2 h-3 rounded-full bg-gray-700">

            <div className="h-3 w-2/3 rounded-full bg-green-500"></div>

          </div>

        </div>

        {/* Achievement */}

        <div className="rounded-xl bg-[#1D2C20] p-5">

          <h3 className="text-lg font-semibold text-white">
            🏆 Achievement
          </h3>

          <p className="mt-3 text-sm lg:text-base text-gray-300">
            You completed <strong className="text-green-400">15 tasks</strong> this week.
            Keep up the amazing work!
          </p>

        </div>

        {/* Productivity Score */}

        <div className="rounded-xl border border-green-900 bg-[#102417] p-5">

          <p className="text-xs uppercase tracking-wider text-gray-400">
            Productivity Score
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            92%
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Excellent consistency this month.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ProductivityCard;