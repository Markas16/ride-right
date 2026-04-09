import { useAuth } from "@/contexts/AuthContext";
import { useUserBookings } from "@/controllers/useBookingController";
import { useVehicles } from "@/controllers/useVehicleController";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Calendar, CreditCard, TrendingUp, Sparkles } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { SkeletonStat } from "@/components/ui/skeleton-cards";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

function AnimatedStat({ label, value, icon: Icon, color, suffix = "" }: {
  label: string; value: number; icon: any; color: string; suffix?: string;
}) {
  const animatedValue = useCountUp(value);
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="glass-card hover:glow-sm transition-all duration-300 border-border/40">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
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

export default function DashboardPage() {
  const { user, profile } = useAuth();

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

  return (
    <PageTransition>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl gradient-primary p-8 lg:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(120,80,255,0.2),transparent_50%)]" />
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

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <SkeletonStat key={i} />)}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StaggerItem>
              <AnimatedStat label="Active Bookings" value={activeBookings.length} icon={Calendar} color="gradient-primary-soft text-primary" />
            </StaggerItem>
            <StaggerItem>
              <AnimatedStat label="Total Bookings" value={bookings.length} icon={TrendingUp} color="gradient-primary-soft text-primary" />
            </StaggerItem>
            <StaggerItem>
              <AnimatedStat label="Available Vehicles" value={availableVehicles} icon={Car} color="gradient-primary-soft text-primary" />
            </StaggerItem>
            <StaggerItem>
              <AnimatedStat label="Total Spent" value={Math.round(totalSpent)} icon={CreditCard} color="gradient-primary-soft text-primary" suffix="₹" />
            </StaggerItem>
          </StaggerContainer>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card border-border/40">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Booking Activity
              </CardTitle>
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
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent" />
                Revenue Trend
              </CardTitle>
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

        {activeBookings.length > 0 && (
          <Card className="glass-card border-border/40">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Active Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <StaggerContainer className="space-y-3">
                {activeBookings.slice(0, 5).map((booking) => (
                  <StaggerItem key={booking.id}>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/30 hover-lift">
                      <div>
                        <p className="font-semibold">{booking.vehicle?.displayName ?? "Unknown"}</p>
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
