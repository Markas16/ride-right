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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus } from "lucide-react";

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

  const statusColors: Record<string, string> = {
    scheduled: "bg-warning/10 text-warning",
    in_progress: "bg-primary/10 text-primary",
    completed: "bg-success/10 text-success",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Maintenance</h1>
          <p className="text-muted-foreground">Track vehicle service records</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Record</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Schedule Maintenance</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select value={form.vehicle_id} onValueChange={(v) => setForm({ ...form, vehicle_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.make} {v.model} ({v.year})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Service Date</Label>
                <Input type="date" value={form.service_date} onChange={(e) => setForm({ ...form, service_date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Oil change, tire rotation..." />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {records.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No maintenance records.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {records.map((r) => {
            const vehicle = vehicles.find((v) => v.id === r.vehicle_id);
            return (
              <Card key={r.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-heading font-bold">{vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">{r.service_date} · {r.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[r.status]}`}>
                      {r.status.replace("_", " ")}
                    </span>
                    {r.status === "scheduled" && (
                      <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: r.id, status: "in_progress" })}>
                        Start
                      </Button>
                    )}
                    {r.status === "in_progress" && (
                      <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: r.id, status: "completed" })}>
                        Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
