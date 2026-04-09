// Repository Layer: Maintenance Repository (Singleton Pattern)

import { supabase } from "@/integrations/supabase/client";
import type { Maintenance, MaintenanceInsert } from "@/types/rental";

export class MaintenanceRepository {
  private static _instance: MaintenanceRepository;

  private constructor() {}

  static getInstance(): MaintenanceRepository {
    if (!MaintenanceRepository._instance) {
      MaintenanceRepository._instance = new MaintenanceRepository();
    }
    return MaintenanceRepository._instance;
  }

  async findAll(): Promise<Maintenance[]> {
    const { data, error } = await supabase
      .from("maintenance")
      .select("*")
      .order("service_date", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Maintenance[];
  }

  async create(record: MaintenanceInsert): Promise<Maintenance> {
    const { data, error } = await supabase.from("maintenance").insert(record).select().single();
    if (error) throw error;
    return data as Maintenance;
  }

  async updateStatus(id: string, status: Maintenance["status"]): Promise<Maintenance> {
    const { data, error } = await supabase.from("maintenance").update({ status }).eq("id", id).select().single();
    if (error) throw error;
    return data as Maintenance;
  }
}
