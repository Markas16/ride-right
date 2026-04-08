import { useQuery } from "@tanstack/react-query";
import { getAllBookings } from "@/dal/bookingDAL";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminBookingsPage() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: getAllBookings,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold">All Bookings</h1>
        <p className="text-muted-foreground">Overview of all customer bookings</p>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : bookings.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No bookings yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-heading font-bold">{b.vehicles.make} {b.vehicles.model}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(b.start_time).toLocaleString()} → {new Date(b.end_time).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">${b.total_cost.toFixed(2)}</span>
                  <Badge variant={b.status === "confirmed" ? "default" : "secondary"}>{b.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
