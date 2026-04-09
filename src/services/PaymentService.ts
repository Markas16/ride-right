// Service Layer: Payment Service (Singleton Pattern)
// Handles payment processing and status management

import { PaymentRepository } from "@/repositories/PaymentRepository";
import { PaymentModel } from "@/models/Payment";
import type { PaymentStatus } from "@/types/rental";

export class PaymentService {
  private static _instance: PaymentService;
  private readonly _repository: PaymentRepository;

  private constructor() {
    this._repository = PaymentRepository.getInstance();
  }

  static getInstance(): PaymentService {
    if (!PaymentService._instance) {
      PaymentService._instance = new PaymentService();
    }
    return PaymentService._instance;
  }

  async getPaymentForBooking(bookingId: string): Promise<PaymentModel | null> {
    const data = await this._repository.findByBookingId(bookingId);
    return data ? new PaymentModel(data) : null;
  }

  async updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<PaymentModel> {
    const data = await this._repository.updateStatus(paymentId, status);
    return new PaymentModel(data);
  }
}
