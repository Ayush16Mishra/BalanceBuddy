import { Outlet } from "react-router-dom";

import { AppHeader } from "@/shared/components/AppHeader";
import { AppSidebar } from "@/shared/components/AppSidebar";
import { MobileBottomNav } from "@/shared/components/MobileBottomNav";

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <div className="flex flex-1 flex-col">
        <AppHeader />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
