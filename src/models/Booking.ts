// Domain Model: Booking
// Encapsulates booking data with relationships to Vehicle and Payment

import type { Booking, BookingStatus, BookingFull, BookingWithVehicle } from "@/types/rental";
import { VehicleModel } from "./Vehicle";
import { PaymentModel } from "./Payment";

export class BookingModel {
  private _id: string;
  private _customerId: string;
  private _vehicleId: string;
  private _startTime: string;
  private _endTime: string;
  private _totalCost: number;
  private _status: BookingStatus;
  private _createdAt: string;
  private _updatedAt: string;

  // Relationships (HAS ONE Vehicle, HAS ONE Payment)
  private _vehicle: VehicleModel | null = null;
  private _payment: PaymentModel | null = null;

  constructor(data: Booking) {
    this._id = data.id;
    this._customerId = data.customer_id;
    this._vehicleId = data.vehicle_id;
    this._startTime = data.start_time;
    this._endTime = data.end_time;
    this._totalCost = data.total_cost;
    this._status = data.status;
    this._createdAt = data.created_at;
    this._updatedAt = data.updated_at;
  }

  // Factory: create from full booking data (with vehicle + payment joined)
  static fromFull(data: BookingFull): BookingModel {
    const model = new BookingModel(data);
    if (data.vehicles) model._vehicle = new VehicleModel(data.vehicles);
    if (data.payments) model._payment = new PaymentModel(data.payments);
    return model;
  }

  static fromWithVehicle(data: BookingWithVehicle): BookingModel {
    const model = new BookingModel(data);
    if (data.vehicles) model._vehicle = new VehicleModel(data.vehicles);
    return model;
  }

  // Getters
  get id(): string { return this._id; }
  get customerId(): string { return this._customerId; }
  get vehicleId(): string { return this._vehicleId; }
  get startTime(): string { return this._startTime; }
  get endTime(): string { return this._endTime; }
  get totalCost(): number { return this._totalCost; }
  get status(): BookingStatus { return this._status; }
  get createdAt(): string { return this._createdAt; }
  get updatedAt(): string { return this._updatedAt; }
  get vehicle(): VehicleModel | null { return this._vehicle; }
  get payment(): PaymentModel | null { return this._payment; }

  // Setters
  set status(status: BookingStatus) { this._status = status; }

  // Domain methods
  isCancellable(): boolean {
    return this._status === "pending" || this._status === "confirmed";
  }

  isActive(): boolean {
    return this._status === "confirmed" || this._status === "pending";
  }

  get formattedDateRange(): string {
    return `${new Date(this._startTime).toLocaleString()} → ${new Date(this._endTime).toLocaleString()}`;
  }

  get formattedCost(): string {
    return `₹${this._totalCost.toFixed(2)}`;
  }
}
