// Types for the Vehicle Rental System
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Vehicle = Tables<"vehicles">;
export type VehicleInsert = TablesInsert<"vehicles">;
export type Booking = Tables<"bookings">;
export type BookingInsert = TablesInsert<"bookings">;
export type Payment = Tables<"payments">;
export type PaymentInsert = TablesInsert<"payments">;
export type Maintenance = Tables<"maintenance">;
export type MaintenanceInsert = TablesInsert<"maintenance">;
export type Profile = Tables<"profiles">;
export type UserRole = Tables<"user_roles">;

export type VehicleType = "car" | "bike" | "truck";
export type VehicleStatus = "available" | "rented" | "maintenance";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "completed" | "failed";

// Vehicle with booking info for display
export interface VehicleWithAvailability extends Vehicle {
  isAvailable: boolean;
}

// Booking with related vehicle info
export interface BookingWithVehicle extends Booking {
  vehicles: Vehicle;
}

// Booking with vehicle and payment
export interface BookingFull extends Booking {
  vehicles: Vehicle;
  payments: Payment | null;
}
