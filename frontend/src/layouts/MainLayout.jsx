import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {isSidebarOpen && (
  <div
    className="fixed inset-0 bg-black/40 z-40 md:hidden"
    onClick={() => setIsSidebarOpen(false)}
  />
)}

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
