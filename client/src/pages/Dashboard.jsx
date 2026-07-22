import MainLayout from "../layouts/MainLayout";

function Dashboard() {
  return (
    <MainLayout>

      <h1 className="text-4xl font-bold text-emerald-900 mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-700">
          <p className="text-gray-500">Total Tasks</p>
          <h2 className="text-4xl font-bold mt-3 text-emerald-900">12</h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <p className="text-gray-500">Completed</p>
          <h2 className="text-4xl font-bold mt-3 text-green-600">7</h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <p className="text-gray-500">Pending</p>
          <h2 className="text-4xl font-bold mt-3 text-red-500">5</h2>
        </div>

      </div>

    </MainLayout>
  );
}

export default Dashboard;