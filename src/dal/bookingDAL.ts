// Data Access Layer for bookings
import { supabase } from "@/integrations/supabase/client";
import type { Booking, BookingInsert, BookingWithVehicle, BookingFull } from "@/types/rental";

export async function getUserBookings(userId: string): Promise<BookingFull[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(*), payments(*)")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as BookingFull[];
}

export async function getAllBookings(): Promise<BookingWithVehicle[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as BookingWithVehicle[];
}

export async function createBooking(booking: BookingInsert): Promise<Booking> {
  const { data, error } = await supabase.from("bookings").insert(booking).select().single();
  if (error) {
    if (error.message.includes("no_overlapping_bookings")) {
      throw new Error("This vehicle is already booked for the selected time period.");
    }
    throw error;
  }
  return data as Booking;
}

export async function updateBookingStatus(id: string, status: Booking["status"]) {
  const { data, error } = await supabase.from("bookings").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data as Booking;
}

export async function checkVehicleAvailability(
  vehicleId: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("vehicle_id", vehicleId)
    .neq("status", "cancelled")
    .lt("start_time", endTime)
    .gt("end_time", startTime);
  if (error) throw error;
  return (data?.length ?? 0) === 0;
}
