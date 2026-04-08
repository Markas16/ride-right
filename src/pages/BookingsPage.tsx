import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookings, updateBookingStatus } from "@/dal/bookingDAL";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function BookingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["user-bookings", user?.id],
    queryFn: () => getUserBookings(user!.id),
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => updateBookingStatus(bookingId, "cancelled"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast.success("Booking cancelled.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your rental bookings</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-24" />
            </Card>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No bookings yet. Browse vehicles to make your first rental!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-bold">
                        {booking.vehicles.make} {booking.vehicles.model}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.start_time).toLocaleString()} → {new Date(booking.end_time).toLocaleString()}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>Total: <strong>${booking.total_cost.toFixed(2)}</strong></span>
                      {booking.payments && (
                        <span>
                          Payment:{" "}
                          <span className={booking.payments.status === "completed" ? "text-success" : "text-warning"}>
                            {booking.payments.status}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelMutation.mutate(booking.id)}
                      disabled={cancelMutation.isPending}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
