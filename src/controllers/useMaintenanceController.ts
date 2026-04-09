// Controller: Maintenance Controller Hook

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MaintenanceService } from "@/services/MaintenanceService";
import { toast } from "sonner";
import type { MaintenanceInsert } from "@/types/rental";

const maintenanceService = MaintenanceService.getInstance();

export function useMaintenanceRecords() {
  return useQuery({
    queryKey: ["maintenance"],
    queryFn: () => maintenanceService.getAllRecords(),
  });
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (record: MaintenanceInsert) => maintenanceService.scheduleMaintenanceRecord(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      toast.success("Maintenance record created.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAdvanceMaintenanceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: string }) =>
      maintenanceService.advanceStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      toast.success("Status updated.");
    },
  });
}
