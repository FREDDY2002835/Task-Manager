import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-emerald-50">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default MainLayout;