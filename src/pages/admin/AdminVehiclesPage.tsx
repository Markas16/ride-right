import { useState } from "react";
import { useVehicles, useSaveVehicle, useDeleteVehicle, useToggleVehicleMaintenance } from "@/controllers/useVehicleController";
import { getVehicleImage } from "@/services/vehicleImages";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import type { VehicleType, VehicleStatus } from "@/types/rental";

export default function AdminVehiclesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "car" as VehicleType,
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price_per_hour: 15,
    price_per_day: 120,
    description: "",
    image_url: "",
  });

  const { data: vehicles = [], isLoading } = useVehicles();
  const saveMutation = useSaveVehicle();
  const deleteMutation = useDeleteVehicle();
  const maintenanceMutation = useToggleVehicleMaintenance();

  function resetForm() {
    setEditId(null);
    setForm({ type: "car", make: "", model: "", year: new Date().getFullYear(), price_per_hour: 15, price_per_day: 120, description: "", image_url: "" });
  }

  function openEdit(v: (typeof vehicles)[0]) {
    setEditId(v.id);
    setForm({
      type: v.type, make: v.make, model: v.model, year: v.year,
      price_per_hour: v.pricePerHour, price_per_day: v.pricePerDay,
      description: v.description ?? "", image_url: v.imageUrl ?? "",
    });
    setDialogOpen(true);
  }

  const statusBadge = (status: string) => {
    if (status === "available") return "bg-success/10 text-success border border-success/20";
    if (status === "maintenance") return "bg-warning/10 text-warning border border-warning/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">
              Manage <span className="gradient-text">Fleet</span>
            </h1>
            <p className="text-muted-foreground mt-1">Add, edit, and manage your vehicles</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl gradient-primary text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4" /> Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl glass-card">
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">{editId ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate({
                  editId,
                  type: form.type,
                  make: form.make,
                  model: form.model,
                  year: form.year,
                  overrides: {
                    price_per_hour: form.price_per_hour,
                    price_per_day: form.price_per_day,
                    description: form.description,
                    image_url: form.image_url,
                  },
                }, { onSuccess: () => { setDialogOpen(false); resetForm(); } });
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as VehicleType })}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} className="rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Make</Label>
                    <Input value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required className="rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price/Hour (₹)</Label>
                    <Input type="number" step="0.01" value={form.price_per_hour} onChange={(e) => setForm({ ...form, price_per_hour: parseFloat(e.target.value) })} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Price/Day (₹)</Label>
                    <Input type="number" step="0.01" value={form.price_per_day} onChange={(e) => setForm({ ...form, price_per_day: parseFloat(e.target.value) })} className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl" />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 font-semibold" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Saving..." : editId ? "Update Vehicle" : "Add Vehicle"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <StaggerContainer className="space-y-3">
            {vehicles.map((v) => (
              <StaggerItem key={v.id}>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Card className="glass-card rounded-2xl border-border/30 hover:neon-border transition-all duration-300">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={getVehicleImage(v.type)} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold">{v.displayName} ({v.year})</p>
                        <p className="text-sm text-muted-foreground">₹{v.pricePerHour}/hr · ₹{v.pricePerDay}/day</p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusBadge(v.status)}`}>
                        {v.status}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(v)} className="rounded-xl hover:bg-primary/10">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() =>
                          maintenanceMutation.mutate({ id: v.id, currentStatus: v.status as VehicleStatus })
                        } className="rounded-xl hover:bg-warning/10">
                          <Wrench className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(v.id)} className="rounded-xl hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
