import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getVehicleById } from "@/dal/vehicleDAL";
import { createBooking, checkVehicleAvailability } from "@/dal/bookingDAL";
import { createPayment } from "@/dal/paymentDAL";
import { calculateRentalCost } from "@/services/pricing";
import { getVehicleIcon } from "@/services/vehicleFactory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function BookingPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");
  const [bookingResult, setBookingResult] = useState<{ bookingId: string; amount: number } | null>(null);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => getVehicleById(vehicleId!),
    enabled: !!vehicleId,
  });

  const pricing = useMemo(() => {
    if (!vehicle || !startTime || !endTime) return null;
    const s = new Date(startTime);
    const e = new Date(endTime);
    if (e <= s) return null;
    return calculateRentalCost(vehicle.price_per_hour, vehicle.price_per_day, s, e);
  }, [vehicle, startTime, endTime]);

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!user || !vehicle || !pricing) throw new Error("Missing data");
      const s = new Date(startTime).toISOString();
      const e = new Date(endTime).toISOString();

      const available = await checkVehicleAvailability(vehicle.id, s, e);
      if (!available) throw new Error("Vehicle not available for the selected time period.");

      const booking = await createBooking({
        customer_id: user.id,
        vehicle_id: vehicle.id,
        start_time: s,
        end_time: e,
        total_cost: pricing.cost,
        status: "pending",
      });

      // Mock payment
      const payment = await createPayment({
        booking_id: booking.id,
        amount: pricing.cost,
        payment_method: "card",
        status: "completed",
      });

      // Update booking to confirmed after payment
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("bookings").update({ status: "confirmed" }).eq("id", booking.id);

      return { bookingId: booking.id, amount: pricing.cost };
    },
    onSuccess: (result) => {
      setBookingResult(result);
      setStep("done");
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Booking confirmed!");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  }

  if (!vehicle) {
    return <div className="text-center py-12 text-muted-foreground">Vehicle not found.</div>;
  }

  const now = new Date().toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      {step === "done" && bookingResult ? (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <h2 className="text-2xl font-heading font-bold">Booking Confirmed!</h2>
            <p className="text-muted-foreground">
              Your {vehicle.make} {vehicle.model} has been booked successfully.
            </p>
            <p className="text-lg font-bold text-primary">${bookingResult.amount.toFixed(2)} paid</p>
            <Button onClick={() => navigate("/bookings")}>View My Bookings</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Vehicle Info */}
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <span className="text-4xl">{getVehicleIcon(vehicle.type)}</span>
              <div>
                <h2 className="text-xl font-heading font-bold">
                  {vehicle.make} {vehicle.model}
                </h2>
                <p className="text-muted-foreground">{vehicle.year} · ${vehicle.price_per_hour}/hr · ${vehicle.price_per_day}/day</p>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Select Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date & Time</Label>
                  <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} min={now} />
                </div>
                <div className="space-y-2">
                  <Label>End Date & Time</Label>
                  <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} min={startTime || now} />
                </div>
              </div>

              {pricing && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pricing Strategy</span>
                    <span className="font-medium">{pricing.strategy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Cost</span>
                    <span className="text-xl font-heading font-bold text-primary">${pricing.cost.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {startTime && endTime && !pricing && (
                <p className="text-sm text-destructive">End time must be after start time.</p>
              )}
            </CardContent>
          </Card>

          {/* Payment / Confirm */}
          {step === "select" && pricing && (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Mock Payment Method</p>
                  <p className="font-medium">💳 **** **** **** 4242</p>
                </div>
                <Button className="w-full" size="lg" onClick={() => bookMutation.mutate()} disabled={bookMutation.isPending}>
                  {bookMutation.isPending ? "Processing..." : `Pay $${pricing.cost.toFixed(2)} & Confirm`}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
