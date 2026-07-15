"use client";

import Navbar  from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  role       = "petani",
  user       = null,
  taniPoint  = 0,
  notifCount = 0,
  children,
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar user={user} notifCount={notifCount} />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-shrink-0">
          <Sidebar role={role} user={user} taniPoint={taniPoint} />
        </div>

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
