// Service Layer: Booking Service (Singleton Pattern)
// Contains all booking business logic: validation, overlap prevention, pricing, payment orchestration

import { BookingRepository } from "@/repositories/BookingRepository";
import { PaymentRepository } from "@/repositories/PaymentRepository";
import { BookingModel } from "@/models/Booking";
import { calculateRentalCost } from "@/services/pricing";
import type { BookingFull, BookingWithVehicle } from "@/types/rental";

export interface BookingRequest {
  customerId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  pricePerDay: number;
}

export interface BookingResult {
  bookingId: string;
  amount: number;
}

export class BookingService {
  private static _instance: BookingService;
  private readonly _bookingRepo: BookingRepository;
  private readonly _paymentRepo: PaymentRepository;

  private constructor() {
    this._bookingRepo = BookingRepository.getInstance();
    this._paymentRepo = PaymentRepository.getInstance();
  }

  static getInstance(): BookingService {
    if (!BookingService._instance) {
      BookingService._instance = new BookingService();
    }
    return BookingService._instance;
  }

  // Core booking flow: validate → check availability → calculate price → create booking → process payment → confirm
  async createBooking(request: BookingRequest): Promise<BookingResult> {
    // 1. Validate dates
    const start = new Date(request.startTime);
    const end = new Date(request.endTime);
    if (end <= start) throw new Error("End time must be after start time.");

    // 2. Check availability (prevent double-booking)
    const isAvailable = await this.checkAvailability(request.vehicleId, request.startTime, request.endTime);
    if (!isAvailable) throw new Error("Vehicle not available for the selected time period.");

    // 3. Strategy Pattern: calculate cost using appropriate pricing strategy
    const pricing = calculateRentalCost(request.pricePerHour, request.pricePerDay, start, end);

    // 4. Create booking
    const booking = await this._bookingRepo.create({
      customer_id: request.customerId,
      vehicle_id: request.vehicleId,
      start_time: request.startTime,
      end_time: request.endTime,
      total_cost: pricing.cost,
      status: "pending",
    });

    // 5. Process payment (mock)
    await this._paymentRepo.create({
      booking_id: booking.id,
      amount: pricing.cost,
      payment_method: "card",
      status: "completed",
    });

    // 6. Confirm booking after successful payment
    await this._bookingRepo.updateStatus(booking.id, "confirmed");

    return { bookingId: booking.id, amount: pricing.cost };
  }

  async checkAvailability(vehicleId: string, startTime: string, endTime: string): Promise<boolean> {
    const overlapping = await this._bookingRepo.findOverlapping(vehicleId, startTime, endTime);
    return overlapping.length === 0;
  }

  async getUserBookings(userId: string): Promise<BookingModel[]> {
    const data = await this._bookingRepo.findByUserId(userId);
    return data.map((b: BookingFull) => BookingModel.fromFull(b));
  }

  async getAllBookings(): Promise<BookingModel[]> {
    const data = await this._bookingRepo.findAll();
    return data.map((b: BookingWithVehicle) => BookingModel.fromWithVehicle(b));
  }

  async cancelBooking(bookingId: string): Promise<void> {
    await this._bookingRepo.updateStatus(bookingId, "cancelled");
  }
}
