// Repository Layer: Booking Repository (Singleton Pattern)
// Handles ALL database access for bookings

import { supabase } from "@/integrations/supabase/client";
import type { Booking, BookingInsert, BookingWithVehicle, BookingFull } from "@/types/rental";

export class BookingRepository {
  private static _instance: BookingRepository;

  private constructor() {}

  static getInstance(): BookingRepository {
    if (!BookingRepository._instance) {
      BookingRepository._instance = new BookingRepository();
    }
    return BookingRepository._instance;
  }

  async findByUserId(userId: string): Promise<BookingFull[]> {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, vehicles(*), payments(*)")
      .eq("customer_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as BookingFull[];
  }

  async findAll(): Promise<BookingWithVehicle[]> {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, vehicles(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as BookingWithVehicle[];
  }

  async create(booking: BookingInsert): Promise<Booking> {
    const { data, error } = await supabase.from("bookings").insert(booking).select().single();
    if (error) {
      if (error.message.includes("no_overlapping_bookings")) {
        throw new Error("This vehicle is already booked for the selected time period.");
      }
      throw error;
    }
    return data as Booking;
  }

  async updateStatus(id: string, status: Booking["status"]): Promise<Booking> {
    const { data, error } = await supabase.from("bookings").update({ status }).eq("id", id).select().single();
    if (error) throw error;
    return data as Booking;
  }

  async findOverlapping(vehicleId: string, startTime: string, endTime: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("vehicle_id", vehicleId)
      .neq("status", "cancelled")
      .lt("start_time", endTime)
      .gt("end_time", startTime);
    if (error) throw error;
    return (data ?? []).map((d) => d.id);
  }
}
