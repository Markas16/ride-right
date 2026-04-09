import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useVehicle } from "@/controllers/useVehicleController";
import { useCreateBooking } from "@/controllers/useBookingController";
import { calculateRentalCost } from "@/services/pricing";
import { getVehicleImage } from "@/services/vehicleImages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTransition } from "@/components/animations/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Calendar, CreditCard, Clock, ArrowRight } from "lucide-react";

const steps = [
  { id: 1, label: "Select Dates", icon: Calendar },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Confirmed", icon: CheckCircle },
];

export default function BookingPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [step, setStep] = useState(1);
  const [bookingResult, setBookingResult] = useState<{ bookingId: string; amount: number } | null>(null);

  const { data: vehicle, isLoading } = useVehicle(vehicleId);

  const pricing = useMemo(() => {
    if (!vehicle || !startTime || !endTime) return null;
    const s = new Date(startTime);
    const e = new Date(endTime);
    if (e <= s) return null;
    return calculateRentalCost(vehicle.pricePerHour, vehicle.pricePerDay, s, e);
  }, [vehicle, startTime, endTime]);

  const bookMutation = useCreateBooking();

  const handleBook = () => {
    if (!user || !vehicle || !pricing) return;
    bookMutation.mutate(
      {
        customerId: user.id,
        vehicleId: vehicle.id,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        pricePerHour: vehicle.pricePerHour,
        pricePerDay: vehicle.pricePerDay,
      },
      {
        onSuccess: (result) => {
          setBookingResult(result);
          setStep(3);
        },
      }
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  }

  if (!vehicle) {
    return <div className="text-center py-12 text-muted-foreground">Vehicle not found.</div>;
  }

  const now = new Date().toISOString().slice(0, 16);

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 rounded-xl hover:bg-muted/50">
          <ArrowLeft className="h-4 w-4" /> Back to vehicles
        </Button>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <motion.div
                animate={{ scale: step >= s.id ? 1 : 0.9, opacity: step >= s.id ? 1 : 0.4 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step >= s.id ? "gradient-primary text-primary-foreground glow-sm" : "bg-muted text-muted-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </motion.div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 rounded ${step > s.id ? "gradient-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Vehicle hero */}
        <Card className="glass-card rounded-2xl overflow-hidden border-border/30">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 h-40 sm:h-auto">
              <img src={getVehicleImage(vehicle.type)} alt={vehicle.displayName} className="w-full h-full object-cover" />
            </div>
            <CardContent className="flex-1 p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-heading font-bold mb-1">{vehicle.displayName}</h2>
              <p className="text-muted-foreground mb-3">{vehicle.year} · {vehicle.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-primary font-semibold">
                  <Clock className="h-4 w-4" /> ₹{vehicle.pricePerHour}/hr
                </span>
                <span className="flex items-center gap-1.5 text-accent font-semibold">
                  <Calendar className="h-4 w-4" /> ₹{vehicle.pricePerDay}/day
                </span>
              </div>
            </CardContent>
          </div>
        </Card>

        <AnimatePresence mode="wait">
          {step === 3 && bookingResult ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <Card className="glass-card rounded-2xl border-border/30">
                <CardContent className="p-10 text-center space-y-5">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}>
                    <div className="h-20 w-20 rounded-full gradient-primary mx-auto flex items-center justify-center glow">
                      <CheckCircle className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </motion.div>
                  <h2 className="text-3xl font-heading font-bold">Booking Confirmed!</h2>
                  <p className="text-muted-foreground text-lg">Your {vehicle.displayName} has been booked successfully.</p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-2xl font-heading font-bold gradient-text">
                    ₹{bookingResult.amount.toFixed(2)} paid
                  </motion.p>
                  <Button onClick={() => navigate("/bookings")} className="rounded-xl gradient-primary text-primary-foreground hover:opacity-90 gap-2 px-8">
                    View My Bookings <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : step === 1 ? (
            <motion.div key="dates" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Card className="glass-card rounded-2xl border-border/30">
                <CardHeader>
                  <CardTitle className="font-heading text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" /> Select Dates & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Start Date & Time</Label>
                      <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} min={now} className="h-12 rounded-xl border-border/50 bg-muted/30" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">End Date & Time</Label>
                      <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} min={startTime || now} className="h-12 rounded-xl border-border/50 bg-muted/30" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {pricing && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="p-5 rounded-xl neon-border bg-muted/20 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pricing Strategy</span>
                            <span className="font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">{pricing.strategy}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Cost</span>
                            <motion.span key={pricing.cost} initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl font-heading font-bold gradient-text">
                              ₹{pricing.cost.toFixed(2)}
                            </motion.span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {startTime && endTime && !pricing && (
                    <p className="text-sm text-destructive">End time must be after start time.</p>
                  )}

                  <Button className="w-full h-12 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 gap-2 font-semibold" disabled={!pricing} onClick={() => setStep(2)}>
                    Continue to Payment <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : step === 2 && pricing ? (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Card className="glass-card rounded-2xl border-border/30">
                <CardHeader>
                  <CardTitle className="font-heading text-xl flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="p-5 rounded-xl neon-border bg-muted/20">
                    <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded-lg gradient-primary flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">•••• •••• •••• 4242</p>
                        <p className="text-xs text-muted-foreground">Mock Visa Card</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-muted/30 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rental Cost ({pricing.strategy})</span>
                      <span>₹{pricing.cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="border-t border-border/30 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-xl gradient-text font-heading font-bold">₹{pricing.cost.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl">Back</Button>
                    <Button
                      className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 font-semibold gap-2 animate-pulse-glow"
                      onClick={handleBook}
                      disabled={bookMutation.isPending}
                    >
                      {bookMutation.isPending ? (
                        <span className="animate-pulse">Processing...</span>
                      ) : (
                        <>Pay ₹{pricing.cost.toFixed(2)} <ArrowRight className="h-4 w-4" /></>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
