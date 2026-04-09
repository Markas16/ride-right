// Domain Model: Payment
// Encapsulates payment data with HAS ONE relationship to Booking

import type { Payment, PaymentStatus } from "@/types/rental";

export class PaymentModel {
  private _id: string;
  private _bookingId: string;
  private _amount: number;
  private _paymentMethod: string;
  private _status: PaymentStatus;
  private _createdAt: string;

  constructor(data: Payment) {
    this._id = data.id;
    this._bookingId = data.booking_id;
    this._amount = data.amount;
    this._paymentMethod = data.payment_method;
    this._status = data.status;
    this._createdAt = data.created_at;
  }

  // Getters
  get id(): string { return this._id; }
  get bookingId(): string { return this._bookingId; }
  get amount(): number { return this._amount; }
  get paymentMethod(): string { return this._paymentMethod; }
  get status(): PaymentStatus { return this._status; }
  get createdAt(): string { return this._createdAt; }

  // Setters
  set status(status: PaymentStatus) { this._status = status; }

  // Domain methods
  isCompleted(): boolean {
    return this._status === "completed";
  }

  get formattedAmount(): string {
    return `₹${this._amount.toFixed(2)}`;
  }
}
