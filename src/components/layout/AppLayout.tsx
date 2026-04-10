import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Car, Calendar, CreditCard, LayoutDashboard, Settings, LogOut, Menu, X, Wrench, Sparkles, GitBranch, Bell, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const userNavItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", notify: false },
  { to: "/vehicles", icon: Car, label: "Vehicles", notify: true },
  { to: "/bookings", icon: Calendar, label: "My Bookings", notify: false },
  { to: "/profile", icon: Settings, label: "Profile", notify: false },
  { to: "/system-design", icon: GitBranch, label: "System Design", notify: false },
];

const adminNavItems = [
  { to: "/admin/vehicles", icon: Car, label: "Manage Vehicles", notify: false },
  { to: "/admin/bookings", icon: Calendar, label: "All Bookings", notify: true },
  { to: "/admin/maintenance", icon: Wrench, label: "Maintenance", notify: false },
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

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 lg:translate-x-0",
          "bg-sidebar border-r border-sidebar-border relative overflow-hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Subtle gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="p-6 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center glow-sm"
            >
              <Car className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-lg font-heading font-bold text-sidebar-primary-foreground">RentRide</h1>
              <p className="text-xs text-sidebar-foreground/60">Vehicle Rental</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto relative z-10 sidebar-scroll">
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group/nav relative",
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-lg glow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-0.5"
                )
              }
            >
              <item.icon className="h-4 w-4 transition-transform group-hover/nav:scale-110" />
              {item.label}
              {item.notify && (
                <span className="ml-auto h-2 w-2 rounded-full bg-accent animate-pulse" />
              )}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="my-4 mx-3 h-px bg-gradient-to-r from-transparent via-sidebar-border to-transparent" />
              <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-[0.15em] px-3 py-2 flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-accent" />
                Admin
              </p>
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group/nav relative",
                      isActive
                        ? "gradient-primary text-primary-foreground shadow-lg glow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-0.5"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 transition-transform group-hover/nav:scale-110" />
                  {item.label}
                  {item.notify && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-warning animate-pulse" />
                  )}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User card */}
        <div className="p-4 mx-4 mb-4 rounded-xl bg-sidebar-accent/50 border border-sidebar-border backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm ring-2 ring-primary/20">
                {(profile?.full_name || "U").charAt(0).toUpperCase()}
              </div>
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-sidebar" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-sidebar-foreground/60 flex items-center gap-1">
                {isAdmin ? (
                  <>
                    <Crown className="h-3 w-3 text-warning" />
                    <span className="text-warning font-medium">Pro Admin</span>
                  </>
                ) : (
                  "Customer"
                )}
              </p>
            </div>
            {isAdmin && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-warning/20 text-warning border border-warning/30">
                PRO
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
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
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-muted/50">
              <Bell className="h-4.5 w-4.5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent animate-pulse" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
