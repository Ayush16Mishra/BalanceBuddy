import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, Home, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sidebar-surface flex h-screen flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`flex items-center border-b border-sidebar-divider px-5 py-5 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && <h1 className="text-2xl font-bold tracking-tight">BalanceBuddy</h1>}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-white/30"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center rounded-xl px-4 py-3 transition-all ${
              collapsed ? "justify-center" : "gap-3"
            } ${isActive ? "bg-white/80 font-semibold shadow-sm" : "hover:bg-white/35"}`
          }
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/groups"
          className={({ isActive }) =>
            `flex items-center rounded-xl px-4 py-3 transition-all ${
              collapsed ? "justify-center" : "gap-3"
            } ${isActive ? "bg-white/80 font-semibold shadow-sm" : "hover:bg-white/35"}`
          }
        >
          <Users className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Groups</span>}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center rounded-xl px-4 py-3 transition-all ${
              collapsed ? "justify-center" : "gap-3"
            } ${isActive ? "bg-white/80 font-semibold shadow-sm" : "hover:bg-white/35"}`
          }
        >
          <User className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Profile</span>}
        </NavLink>
      </nav>
    </aside>
  );
}
