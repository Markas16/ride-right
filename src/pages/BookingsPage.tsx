import { useAuth } from "@/contexts/AuthContext";
import { useUserBookings, useCancelBooking } from "@/controllers/useBookingController";
import { getVehicleImage } from "@/services/vehicleImages";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { SkeletonRow } from "@/components/ui/skeleton-cards";
import { motion } from "framer-motion";
import { Calendar, X } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "gradient-primary-soft text-primary border border-primary/20",
  confirmed: "bg-primary/10 text-primary border border-primary/20",
  completed: "bg-success/10 text-success border border-success/20",
  cancelled: "bg-destructive/10 text-destructive border border-destructive/20",
};

export default function BookingsPage() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useUserBookings(user?.id);
  const cancelMutation = useCancelBooking();

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-muted-foreground mt-1">View and manage your rental history</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <SkeletonRow key={i} />)}</div>
        ) : bookings.length === 0 ? (
          <Card className="glass-card rounded-2xl border-border/30">
            <CardContent className="p-16 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No bookings yet.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Browse vehicles to make your first rental!</p>
            </CardContent>
          </Card>
        ) : (
          <StaggerContainer className="space-y-4">
            {bookings.map((booking) => (
              <StaggerItem key={booking.id}>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Card className="glass-card rounded-2xl border-border/30 hover:neon-border transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 hidden sm:block">
                          {booking.vehicle && (
                            <img src={getVehicleImage(booking.vehicle.type)} alt="" className="w-full h-full object-cover" loading="lazy" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-heading font-bold text-lg">{booking.vehicle?.displayName ?? "Unknown"}</h3>
                              <p className="text-sm text-muted-foreground">{booking.formattedDateRange}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusStyles[booking.status]}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex gap-4 text-sm">
                              <span>Total: <strong className="gradient-text">{booking.formattedCost}</strong></span>
                              {booking.payment && (
                                <span className={`font-medium ${booking.payment.isCompleted() ? "text-success" : "text-warning"}`}>
                                  Payment: {booking.payment.status}
                                </span>
                              )}
                            </div>
                            {booking.isCancellable() && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelMutation.mutate(booking.id)}
                                disabled={cancelMutation.isPending}
                                className="rounded-xl gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                              >
                                <X className="h-3.5 w-3.5" /> Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </PageTransition>
  );
}
