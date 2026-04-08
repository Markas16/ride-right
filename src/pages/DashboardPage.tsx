import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookings } from "@/dal/bookingDAL";
import { getVehicles } from "@/dal/vehicleDAL";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Calendar, CreditCard, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: bookings = [] } = useQuery({
    queryKey: ["user-bookings", user?.id],
    queryFn: () => getUserBookings(user!.id),
    enabled: !!user,
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehicles(),
  });

  const activeBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "pending");
  const totalSpent = bookings
    .filter((b) => b.payments?.status === "completed")
    .reduce((sum, b) => sum + (b.payments?.amount ?? 0), 0);
  const availableVehicles = vehicles.filter((v) => v.status === "available").length;

  const stats = [
    { label: "Active Bookings", value: activeBookings.length, icon: Calendar, color: "text-primary" },
    { label: "Total Bookings", value: bookings.length, icon: TrendingUp, color: "text-primary" },
    { label: "Available Vehicles", value: availableVehicles, icon: Car, color: "text-primary" },
    { label: "Total Spent", value: `₹${totalSpent.toFixed(2)}`, icon: CreditCard, color: "text-primary" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your rental overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-heading font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">
                      {booking.vehicles.make} {booking.vehicles.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.start_time).toLocaleDateString()} → {new Date(booking.end_time).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium capitalize">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
