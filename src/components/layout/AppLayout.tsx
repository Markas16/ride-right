import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Car, Calendar, CreditCard, LayoutDashboard, Settings, LogOut, Menu, X, Wrench, Sparkles, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const userNavItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/vehicles", icon: Car, label: "Vehicles" },
  { to: "/bookings", icon: Calendar, label: "My Bookings" },
  { to: "/profile", icon: Settings, label: "Profile" },
  { to: "/system-design", icon: GitBranch, label: "System Design" },
];

const adminNavItems = [
  { to: "/admin/vehicles", icon: Car, label: "Manage Vehicles" },
  { to: "/admin/bookings", icon: Calendar, label: "All Bookings" },
  { to: "/admin/maintenance", icon: Wrench, label: "Maintenance" },
];

export default function AppLayout() {
  const { profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate("/auth");
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - dark gradient */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 lg:translate-x-0",
          "bg-sidebar border-r border-sidebar-border",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center glow-sm">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-sidebar-primary-foreground">RentRide</h1>
              <p className="text-xs text-sidebar-foreground/60">Vehicle Rental</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {isAdmin && (
            <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-[0.15em] px-3 py-2">
              Menu
            </p>
          )}
          {userNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-lg glow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-[0.15em] px-3 py-2 mt-6">
                Admin
              </p>
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "gradient-primary text-primary-foreground shadow-lg glow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User card */}
        <div className="p-4 mx-4 mb-4 rounded-xl bg-sidebar-accent/50 border border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
              {(profile?.full_name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-sidebar-foreground/60 flex items-center gap-1">
                {isAdmin && <Sparkles className="h-3 w-3" />}
                {isAdmin ? "Admin" : "Customer"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 glass border-b border-border/50 flex items-center px-4 lg:px-8 gap-4 sticky top-0 z-30">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="lg:hidden font-heading font-bold text-lg gradient-text">RentRide</div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
