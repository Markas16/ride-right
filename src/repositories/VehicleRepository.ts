// Repository Layer: Vehicle Repository (Singleton Pattern)
// Handles ALL database access for vehicles — no business logic here

import { supabase } from "@/integrations/supabase/client";
import type { Vehicle, VehicleInsert, VehicleStatus } from "@/types/rental";

export class VehicleRepository {
  private static _instance: VehicleRepository;

  private constructor() {}

  // Singleton access
  static getInstance(): VehicleRepository {
    if (!VehicleRepository._instance) {
      VehicleRepository._instance = new VehicleRepository();
    }
    return VehicleRepository._instance;
  }

  async findAll(filters?: { type?: string; status?: string }): Promise<Vehicle[]> {
    let query = supabase.from("vehicles").select("*").order("created_at", { ascending: false });
    if (filters?.type) query = query.eq("type", filters.type as Vehicle["type"]);
    if (filters?.status) query = query.eq("status", filters.status as Vehicle["status"]);
    const { data, error } = await query;
    if (error) throw error;
    return data as Vehicle[];
  }

  async findById(id: string): Promise<Vehicle> {
    const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single();
    if (error) throw error;
    return data as Vehicle;
  }

  async create(vehicle: VehicleInsert): Promise<Vehicle> {
    const { data, error } = await supabase.from("vehicles").insert(vehicle).select().single();
    if (error) throw error;
    return data as Vehicle;
  }

  async update(id: string, updates: Partial<VehicleInsert>): Promise<Vehicle> {
    const { data, error } = await supabase.from("vehicles").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data as Vehicle;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) throw error;
  }

  async updateStatus(id: string, status: VehicleStatus): Promise<Vehicle> {
    return this.update(id, { status });
  }
}
