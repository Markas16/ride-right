// Data Access Layer for vehicles
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle, VehicleInsert, VehicleStatus } from "@/types/rental";

export async function getVehicles(filters?: { type?: string; status?: string }) {
  let query = supabase.from("vehicles").select("*").order("created_at", { ascending: false });
  if (filters?.type) query = query.eq("type", filters.type as Vehicle["type"]);
  if (filters?.status) query = query.eq("status", filters.status as Vehicle["status"]);
  const { data, error } = await query;
  if (error) throw error;
  return data as Vehicle[];
}

export async function getVehicleById(id: string) {
  const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Vehicle;
}

export async function createVehicle(vehicle: VehicleInsert) {
  const { data, error } = await supabase.from("vehicles").insert(vehicle).select().single();
  if (error) throw error;
  return data as Vehicle;
}

export async function updateVehicle(id: string, updates: Partial<VehicleInsert>) {
  const { data, error } = await supabase.from("vehicles").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as Vehicle;
}

export async function deleteVehicle(id: string) {
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;
}

export async function updateVehicleStatus(id: string, status: VehicleStatus) {
  return updateVehicle(id, { status });
}
