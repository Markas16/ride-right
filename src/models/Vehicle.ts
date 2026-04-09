// Domain Model: Vehicle
// Encapsulates vehicle data with private fields, getters/setters, and domain logic

import type { Vehicle, VehicleType, VehicleStatus } from "@/types/rental";

export class VehicleModel {
  private _id: string;
  private _type: VehicleType;
  private _make: string;
  private _model: string;
  private _year: number;
  private _pricePerHour: number;
  private _pricePerDay: number;
  private _status: VehicleStatus;
  private _description: string | null;
  private _imageUrl: string | null;
  private _createdAt: string;
  private _updatedAt: string;

  constructor(data: Vehicle) {
    this._id = data.id;
    this._type = data.type;
    this._make = data.make;
    this._model = data.model;
    this._year = data.year;
    this._pricePerHour = data.price_per_hour;
    this._pricePerDay = data.price_per_day;
    this._status = data.status;
    this._description = data.description;
    this._imageUrl = data.image_url;
    this._createdAt = data.created_at;
    this._updatedAt = data.updated_at;
  }

  // Getters
  get id(): string { return this._id; }
  get type(): VehicleType { return this._type; }
  get make(): string { return this._make; }
  get model(): string { return this._model; }
  get year(): number { return this._year; }
  get pricePerHour(): number { return this._pricePerHour; }
  get pricePerDay(): number { return this._pricePerDay; }
  get status(): VehicleStatus { return this._status; }
  get description(): string | null { return this._description; }
  get imageUrl(): string | null { return this._imageUrl; }
  get createdAt(): string { return this._createdAt; }
  get updatedAt(): string { return this._updatedAt; }

  // Setters
  set status(status: VehicleStatus) { this._status = status; }
  set description(desc: string | null) { this._description = desc; }

  // Domain methods
  get displayName(): string {
    return `${this._make} ${this._model}`;
  }

  isAvailable(): boolean {
    return this._status === "available";
  }

  isUnderMaintenance(): boolean {
    return this._status === "maintenance";
  }

  // Convert back to plain object for DB operations
  toRaw(): Vehicle {
    return {
      id: this._id,
      type: this._type,
      make: this._make,
      model: this._model,
      year: this._year,
      price_per_hour: this._pricePerHour,
      price_per_day: this._pricePerDay,
      status: this._status,
      description: this._description,
      image_url: this._imageUrl,
      created_at: this._createdAt,
      updated_at: this._updatedAt,
    };
  }
}
