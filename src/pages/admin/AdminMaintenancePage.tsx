import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMaintenanceRecords, createMaintenanceRecord, updateMaintenanceStatus } from "@/dal/maintenanceDAL";
import { getVehicles } from "@/dal/vehicleDAL";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { Plus, Play, CheckCircle } from "lucide-react";

const statusStyles: Record<string, string> = {
  scheduled: "bg-warning/10 text-warning border border-warning/20",
  in_progress: "bg-primary/10 text-primary border border-primary/20",
  completed: "bg-success/10 text-success border border-success/20",
};

export default function AdminMaintenancePage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ vehicle_id: "", service_date: "", description: "" });

  const { data: records = [] } = useQuery({
    queryKey: ["maintenance"],
    queryFn: getMaintenanceRecords,
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehicles(),
  });

  const createMutation = useMutation({
    mutationFn: () => createMaintenanceRecord({
      vehicle_id: form.vehicle_id,
      service_date: form.service_date,
      description: form.description,
      status: "scheduled",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      setDialogOpen(false);
      setForm({ vehicle_id: "", service_date: "", description: "" });
      toast.success("Maintenance record created.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "scheduled" | "in_progress" | "completed" }) =>
      updateMaintenanceStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      toast.success("Status updated.");
    },
  });

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">
              <span className="gradient-text">Maintenance</span>
            </h1>
            <p className="text-muted-foreground mt-1">Track vehicle service records</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl gradient-primary text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4" /> Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl glass-card">
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">Schedule Maintenance</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Vehicle</Label>
                  <Select value={form.vehicle_id} onValueChange={(v) => setForm({ ...form, vehicle_id: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>{v.make} {v.model} ({v.year})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Service Date</Label>
                  <Input type="date" value={form.service_date} onChange={(e) => setForm({ ...form, service_date: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Oil change, tire rotation..." className="rounded-xl" />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 font-semibold" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Record"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {records.length === 0 ? (
          <Card className="glass-card rounded-2xl border-border/30">
            <CardContent className="p-16 text-center text-muted-foreground">No maintenance records.</CardContent>
          </Card>
        ) : (
          <StaggerContainer className="space-y-3">
            {records.map((r) => {
              const vehicle = vehicles.find((v) => v.id === r.vehicle_id);
              return (
                <StaggerItem key={r.id}>
                  <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <Card className="glass-card rounded-2xl border-border/30 hover:neon-border transition-all duration-300">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-heading font-bold">{vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{r.service_date} · {r.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusStyles[r.status]}`}>
                            {r.status.replace("_", " ")}
                          </span>
                          {r.status === "scheduled" && (
                            <Button size="sm" variant="outline" className="rounded-xl gap-1" onClick={() => statusMutation.mutate({ id: r.id, status: "in_progress" })}>
                              <Play className="h-3.5 w-3.5" /> Start
                            </Button>
                          )}
                          {r.status === "in_progress" && (
                            <Button size="sm" variant="outline" className="rounded-xl gap-1" onClick={() => statusMutation.mutate({ id: r.id, status: "completed" })}>
                              <CheckCircle className="h-3.5 w-3.5" /> Complete
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </PageTransition>
  );
}
