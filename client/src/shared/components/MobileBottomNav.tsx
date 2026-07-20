import { NavLink } from "react-router-dom";
import { Home, User, Users } from "lucide-react";

export function MobileBottomNav() {
  const navItem = (isActive: boolean) =>
    `flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${
      isActive
        ? "bg-emerald-100 text-emerald-600 shadow-sm"
        : "text-slate-500 hover:bg-slate-100 hover:text-emerald-600"
    }`;

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      <div className="flex h-16 w-98 items-center justify-around rounded-full border border-white/60 bg-white/90 px-3 shadow-2xl backdrop-blur-xl">
        <NavLink to="/" className={({ isActive }) => navItem(isActive)}>
          <Home className="h-6 w-6" />
        </NavLink>

        <NavLink to="/groups" className={({ isActive }) => navItem(isActive)}>
          <Users className="h-6 w-6" />
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => navItem(isActive)}>
          <User className="h-6 w-6" />
        </NavLink>
      </div>
    </nav>
  );
}
