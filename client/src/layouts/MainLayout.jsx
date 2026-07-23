import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import BottomNav from "../components/layout/BottomNav";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#08110A] text-white">

      {/* Top Navbar */}
      <Navbar />

      <div className="flex">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main
          className="
            flex-1
            p-5
            md:p-8
            lg:p-10
            pb-24
            lg:pb-10
          "
        >
          {children}
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

    </div>
  );
}

export default MainLayout;