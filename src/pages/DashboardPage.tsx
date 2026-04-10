import { useAuth } from "@/contexts/AuthContext";
import { useUserBookings } from "@/controllers/useBookingController";
import { useVehicles } from "@/controllers/useVehicleController";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Calendar, CreditCard, TrendingUp, Sparkles, ArrowUpRight, ArrowDownRight, Zap, Eye, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { SkeletonStat } from "@/components/ui/skeleton-cards";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useNavigate } from "react-router-dom";

function AnimatedStat({ label, value, icon: Icon, color, suffix = "", trend }: {
  label: string; value: number; icon: any; color: string; suffix?: string; trend?: { value: string; positive: boolean };
}) {
  const animatedValue = useCountUp(value);
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="glass-card hover:glow-sm transition-all duration-300 border-border/40 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03]" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              {trend && (
                <div className={`flex items-center gap-0.5 mt-1 text-xs font-semibold ${trend.positive ? "text-success" : "text-destructive"}`}>
                  {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {trend.value}
                </div>
              )}
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color} transition-transform group-hover:scale-110`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-heading font-bold">
            {suffix === "₹" && "₹"}{animatedValue}{suffix !== "₹" && suffix}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const quickActions = [
  { label: "Book Vehicle", icon: Zap, to: "/vehicles", color: "gradient-primary text-primary-foreground" },
  { label: "View Fleet", icon: Eye, to: "/vehicles", color: "bg-accent/10 text-accent" },
  { label: "My Bookings", icon: BookOpen, to: "/bookings", color: "bg-success/10 text-success" },
];

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const { data: bookings = [], isLoading: bookingsLoading } = useUserBookings(user?.id);
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();

  const activeBookings = bookings.filter((b) => b.isActive());
  const totalSpent = bookings
    .filter((b) => b.payment?.isCompleted())
    .reduce((sum, b) => sum + (b.payment?.amount ?? 0), 0);
  const availableVehicles = vehicles.filter((v) => v.isAvailable()).length;

  const isLoading = bookingsLoading || vehiclesLoading;

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthBookings = bookings.filter((b) => {
      const bd = new Date(b.createdAt);
      return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear();
    });
    return {
      month: d.toLocaleString("default", { month: "short" }),
      bookings: monthBookings.length,
      revenue: monthBookings.reduce((sum, b) => sum + b.totalCost, 0),
    };
  });

  const totalRevenue = monthlyData.reduce((s, m) => s + m.revenue, 0);
  const totalBookingCount = monthlyData.reduce((s, m) => s + m.bookings, 0);

  // Simple activity items from recent bookings
  const recentActivity = bookings.slice(0, 4).map((b) => ({
    id: b.id,
    text: `${b.status === "completed" ? "Completed" : b.status === "confirmed" ? "Confirmed" : b.status === "cancelled" ? "Cancelled" : "Created"} booking for ${b.vehicle?.displayName ?? "a vehicle"}`,
    time: new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    icon: b.status === "completed" ? CheckCircle2 : b.status === "cancelled" ? Clock : Calendar,
    color: b.status === "completed" ? "text-success" : b.status === "cancelled" ? "text-destructive" : "text-primary",
  }));

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl gradient-primary p-8 lg:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(120,80,255,0.2),transparent_50%)]" />
          {/* Animated mesh dots */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-primary-foreground"
                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary-foreground/80" />
              <span className="text-sm text-primary-foreground/70 font-medium">Welcome back</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-primary-foreground mb-2">
              Hello, {profile?.full_name || "there"}! 👋
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              Ready for your next ride? Browse our premium fleet and book your perfect vehicle today.
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <motion.div key={action.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={() => navigate(action.to)}
                className={`rounded-xl h-11 gap-2 border-border/40 font-medium ${action.color === "gradient-primary text-primary-foreground" ? "gradient-primary text-primary-foreground border-0 glow-sm" : action.color.replace("bg-", "hover:bg-").replace("/10", "/20")}`}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <SkeletonStat key={i} />)}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StaggerItem>
              <AnimatedStat label="Active Bookings" value={activeBookings.length} icon={Calendar} color="gradient-primary-soft text-primary" trend={{ value: "+2 this week", positive: true }} />
            </StaggerItem>
            <StaggerItem>
              <AnimatedStat label="Total Bookings" value={bookings.length} icon={TrendingUp} color="gradient-primary-soft text-primary" trend={{ value: "+12%", positive: true }} />
            </StaggerItem>
            <StaggerItem>
              <AnimatedStat label="Available Vehicles" value={availableVehicles} icon={Car} color="gradient-primary-soft text-primary" trend={{ value: `${availableVehicles} ready`, positive: true }} />
            </StaggerItem>
            <StaggerItem>
              <AnimatedStat label="Total Spent" value={Math.round(totalSpent)} icon={CreditCard} color="gradient-primary-soft text-primary" suffix="₹" trend={{ value: "+8%", positive: true }} />
            </StaggerItem>
          </StaggerContainer>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card border-border/40">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg gradient-primary-soft flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  Booking Activity
                </CardTitle>
                <span className="text-2xl font-heading font-bold gradient-text">{totalBookingCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total bookings in last 6 months</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(225, 12%, 50%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(225, 12%, 50%)" />
                  <Tooltip contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid hsl(225, 15%, 90%)", borderRadius: "12px", fontSize: "13px" }} />
                  <Bar dataKey="bookings" fill="hsl(230, 80%, 60%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-accent" />
                  </div>
                  Revenue Trend
                </CardTitle>
                <span className="text-2xl font-heading font-bold gradient-text">₹{totalRevenue}</span>
              </div>
              <p className="text-xs text-muted-foreground">Revenue generated in last 6 months</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(270, 70%, 58%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(270, 70%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(225, 12%, 50%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(225, 12%, 50%)" />
                  <Tooltip contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid hsl(225, 15%, 90%)", borderRadius: "12px", fontSize: "13px" }} formatter={(value: number) => [`₹${value}`, "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(270, 70%, 58%)" fill="url(#revenueGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Timeline */}
        {recentActivity.length > 0 && (
          <Card className="glass-card border-border/40">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/30 via-accent/20 to-transparent" />
                <StaggerContainer className="space-y-4">
                  {recentActivity.map((activity) => (
                    <StaggerItem key={activity.id}>
                      <div className="flex items-start gap-4 pl-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-card border border-border/50 ${activity.color} z-10`}>
                          <activity.icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 flex items-center justify-between pt-1">
                          <p className="text-sm">{activity.text}</p>
                          <span className="text-xs text-muted-foreground flex-shrink-0 ml-3">{activity.time}</span>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <Card className="glass-card border-border/40">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-primary-soft flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                Active Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaggerContainer className="space-y-3">
                {activeBookings.slice(0, 5).map((booking) => (
                  <StaggerItem key={booking.id}>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/30 hover-lift group">
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">{booking.vehicle?.displayName ?? "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.startTime).toLocaleDateString()} → {new Date(booking.endTime).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full font-semibold gradient-primary text-primary-foreground">
                        {booking.status}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}
