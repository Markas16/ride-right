// Domain Model: Maintenance
// Encapsulates maintenance record data with HAS ONE relationship to Vehicle

import type { Maintenance } from "@/types/rental";

export type MaintenanceStatus = "scheduled" | "in_progress" | "completed";

export class MaintenanceModel {
  private _id: string;
  private _vehicleId: string;
  private _serviceDate: string;
  private _description: string | null;
  private _status: MaintenanceStatus;
  private _createdAt: string;

  constructor(data: Maintenance) {
    this._id = data.id;
    this._vehicleId = data.vehicle_id;
    this._serviceDate = data.service_date;
    this._description = data.description;
    this._status = data.status;
    this._createdAt = data.created_at;
  }

  // Getters
  get id(): string { return this._id; }
  get vehicleId(): string { return this._vehicleId; }
  get serviceDate(): string { return this._serviceDate; }
  get description(): string | null { return this._description; }
  get status(): MaintenanceStatus { return this._status; }
  get createdAt(): string { return this._createdAt; }

  // Setters
  set status(status: MaintenanceStatus) { this._status = status; }

  // Domain methods
  canStart(): boolean {
    return this._status === "scheduled";
  }

  canComplete(): boolean {
    return this._status === "in_progress";
  }

  get nextStatus(): MaintenanceStatus | null {
    if (this._status === "scheduled") return "in_progress";
    if (this._status === "in_progress") return "completed";
    return null;
  }
}
