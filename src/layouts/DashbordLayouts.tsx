import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transition-transform duration-300 transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:inset-0`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Navbar with hamburger */}
        <div className="sticky top-0 z-20 w-full bg-white border-b shadow-sm">
          <div className="flex items-center p-4">
            <button
              className="md:hidden mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex-1">
              <Navbar />
            </div>
          </div>
        </div>

        {/* Page Content — aligned left with padding, no centering */}
        <div
          className="flex-1 overflow-y-auto p-6 bg-gray-100"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
