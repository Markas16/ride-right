// Service Layer: Vehicle Service (Singleton Pattern)
// Business logic for vehicle operations — delegates DB access to repository

import { VehicleRepository } from "@/repositories/VehicleRepository";
import { VehicleModel } from "@/models/Vehicle";
import { createVehicle as vehicleFactory } from "@/services/vehicleFactory";
import type { VehicleInsert, VehicleType, VehicleStatus } from "@/types/rental";

export class VehicleService {
  private static _instance: VehicleService;
  private readonly _repository: VehicleRepository;

  private constructor() {
    this._repository = VehicleRepository.getInstance();
  }

  static getInstance(): VehicleService {
    if (!VehicleService._instance) {
      VehicleService._instance = new VehicleService();
    }
    return VehicleService._instance;
  }

  async getAllVehicles(filters?: { type?: string; status?: string }): Promise<VehicleModel[]> {
    const data = await this._repository.findAll(filters);
    return data.map((v) => new VehicleModel(v));
  }

  async getVehicleById(id: string): Promise<VehicleModel> {
    const data = await this._repository.findById(id);
    return new VehicleModel(data);
  }

  // Factory Pattern: create vehicle with defaults from VehicleFactory
  async addVehicle(
    type: VehicleType,
    make: string,
    model: string,
    year: number,
    overrides?: Partial<VehicleInsert>
  ): Promise<VehicleModel> {
    const vehicleData = vehicleFactory(type, make, model, year, overrides);
    const data = await this._repository.create(vehicleData);
    return new VehicleModel(data);
  }

  async updateVehicle(id: string, updates: Partial<VehicleInsert>): Promise<VehicleModel> {
    const data = await this._repository.update(id, updates);
    return new VehicleModel(data);
  }

  async deleteVehicle(id: string): Promise<void> {
    await this._repository.delete(id);
  }

  async toggleMaintenance(id: string, currentStatus: VehicleStatus): Promise<VehicleModel> {
    const newStatus: VehicleStatus = currentStatus === "maintenance" ? "available" : "maintenance";
    const data = await this._repository.updateStatus(id, newStatus);
    return new VehicleModel(data);
  }
}
