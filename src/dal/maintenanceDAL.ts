// Data Access Layer for maintenance
import { supabase } from "@/integrations/supabase/client";
import type { Maintenance, MaintenanceInsert } from "@/types/rental";

export async function getMaintenanceRecords(): Promise<Maintenance[]> {
  const { data, error } = await supabase
    .from("maintenance")
    .select("*")
    .order("service_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Maintenance[];
}

export async function createMaintenanceRecord(record: MaintenanceInsert): Promise<Maintenance> {
  const { data, error } = await supabase.from("maintenance").insert(record).select().single();
  if (error) throw error;
  return data as Maintenance;
}

export async function updateMaintenanceStatus(id: string, status: Maintenance["status"]) {
  const { data, error } = await supabase.from("maintenance").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data as Maintenance;
}
