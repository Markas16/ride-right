// Controller: Vehicle Controller Hook
// Bridges UI components to VehicleService — no direct DB or business logic here

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VehicleService } from "@/services/VehicleService";
import { toast } from "sonner";
import type { VehicleType, VehicleInsert, VehicleStatus } from "@/types/rental";

const vehicleService = VehicleService.getInstance();

export function useVehicles(filters?: { type?: string; status?: string }) {
  return useQuery({
    queryKey: ["vehicles", filters?.type, filters?.status],
    queryFn: () => vehicleService.getAllVehicles(filters),
  });
}

export function useVehicle(id: string | undefined) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehicleService.getVehicleById(id!),
    enabled: !!id,
  });
}

export function useSaveVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      editId,
      type,
      make,
      model,
      year,
      overrides,
    }: {
      editId: string | null;
      type: VehicleType;
      make: string;
      model: string;
      year: number;
      overrides?: Partial<VehicleInsert>;
    }) => {
      if (editId) {
        const { createVehicle } = await import("@/services/vehicleFactory");
        const vehicleData = createVehicle(type, make, model, year, overrides);
        return vehicleService.updateVehicle(editId, vehicleData);
      }
      return vehicleService.addVehicle(type, make, model, year, overrides);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success(vars.editId ? "Vehicle updated!" : "Vehicle added!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehicleService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle deleted.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useToggleVehicleMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: VehicleStatus }) =>
      vehicleService.toggleMaintenance(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle status updated.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
