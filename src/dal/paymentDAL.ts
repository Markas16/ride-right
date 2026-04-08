// Data Access Layer for payments
import { supabase } from "@/integrations/supabase/client";
import type { Payment, PaymentInsert } from "@/types/rental";

export async function createPayment(payment: PaymentInsert): Promise<Payment> {
  const { data, error } = await supabase.from("payments").insert(payment).select().single();
  if (error) throw error;
  return data as Payment;
}

export async function updatePaymentStatus(id: string, status: Payment["status"]) {
  const { data, error } = await supabase.from("payments").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data as Payment;
}

export async function getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
  const { data, error } = await supabase.from("payments").select("*").eq("booking_id", bookingId).maybeSingle();
  if (error) throw error;
  return data as Payment | null;
}
