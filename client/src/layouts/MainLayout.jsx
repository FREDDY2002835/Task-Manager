import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import BottomNav from "../components/layout/BottomNav";

function MainLayout({ children }) {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "#08110A",
      }}
    >

      {/* Top Navbar */}
      <Navbar />


      <div className="flex">

  <Sidebar />

  <main
    className="
      flex-1
      lg:ml-64
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