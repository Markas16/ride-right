import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserBookings } from "@/controllers/useBookingController";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, Camera, Calendar, CreditCard, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const { data: bookings = [] } = useUserBookings(user?.id);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [saving, setSaving] = useState(false);

  const totalSpent = bookings
    .filter((b) => b.payment?.isCompleted())
    .reduce((sum, b) => sum + (b.payment?.amount ?? 0), 0);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone })
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageTransition>
      <div className="max-w-lg mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">
            My <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account information</p>
        </div>

        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 p-6 glass-card rounded-2xl border-border/30"
        >
          <div className="relative group">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-2xl glow-sm">
              {(profile?.full_name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <p className="font-heading font-bold text-xl">{profile?.full_name || "User"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </motion.div>

        {/* Stats summary */}
        <StaggerContainer className="grid grid-cols-3 gap-3">
          {[
            { icon: Calendar, label: "Bookings", value: bookings.length },
            { icon: CreditCard, label: "Spent", value: `₹${Math.round(totalSpent)}` },
            { icon: TrendingUp, label: "Active", value: bookings.filter((b) => b.isActive()).length },
          ].map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="glass-card rounded-xl p-4 text-center border-border/30">
                <stat.icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                <p className="text-lg font-heading font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Card className="glass-card rounded-2xl border-border/30">
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" /> Email
                </Label>
                <Input value={user?.email ?? ""} disabled className="h-12 rounded-xl bg-muted/30 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" /> Full Name
                </Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-card focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" /> Phone
                </Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-card focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="w-full h-12 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 font-semibold gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
