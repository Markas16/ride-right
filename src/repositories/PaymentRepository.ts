// Repository Layer: Payment Repository (Singleton Pattern)

import { supabase } from "@/integrations/supabase/client";
import type { Payment, PaymentInsert } from "@/types/rental";

export class PaymentRepository {
  private static _instance: PaymentRepository;

  private constructor() {}

  static getInstance(): PaymentRepository {
    if (!PaymentRepository._instance) {
      PaymentRepository._instance = new PaymentRepository();
    }
    return PaymentRepository._instance;
  }

  async create(payment: PaymentInsert): Promise<Payment> {
    const { data, error } = await supabase.from("payments").insert(payment).select().single();
    if (error) throw error;
    return data as Payment;
  }

  async updateStatus(id: string, status: Payment["status"]): Promise<Payment> {
    const { data, error } = await supabase.from("payments").update({ status }).eq("id", id).select().single();
    if (error) throw error;
    return data as Payment;
  }

  async findByBookingId(bookingId: string): Promise<Payment | null> {
    const { data, error } = await supabase.from("payments").select("*").eq("booking_id", bookingId).maybeSingle();
    if (error) throw error;
    return data as Payment | null;
  }
}
