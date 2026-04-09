import { useAllBookings } from "@/controllers/useBookingController";
import { getVehicleImage } from "@/services/vehicleImages";
import { Card, CardContent } from "@/components/ui/card";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { SkeletonRow } from "@/components/ui/skeleton-cards";
import { motion } from "framer-motion";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning border border-warning/20",
  confirmed: "bg-primary/10 text-primary border border-primary/20",
  completed: "bg-success/10 text-success border border-success/20",
  cancelled: "bg-destructive/10 text-destructive border border-destructive/20",
};

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading } = useAllBookings();

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">
            All <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-muted-foreground mt-1">Overview of all customer bookings</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <SkeletonRow key={i} />)}</div>
        ) : bookings.length === 0 ? (
          <Card className="glass-card rounded-2xl border-border/30">
            <CardContent className="p-16 text-center text-muted-foreground">No bookings yet.</CardContent>
          </Card>
        ) : (
          <StaggerContainer className="space-y-3">
            {bookings.map((b) => (
              <StaggerItem key={b.id}>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Card className="glass-card rounded-2xl border-border/30 hover:neon-border transition-all duration-300">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        {b.vehicle && <img src={getVehicleImage(b.vehicle.type)} alt="" className="w-full h-full object-cover" loading="lazy" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold">{b.vehicle?.displayName ?? "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{b.formattedDateRange}</p>
                      </div>
                      <span className="font-heading font-bold gradient-text">{b.formattedCost}</span>
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusStyles[b.status]}`}>
                        {b.status}
                      </span>
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
