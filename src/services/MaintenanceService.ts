// Service Layer: Maintenance Service (Singleton Pattern)

import { MaintenanceRepository } from "@/repositories/MaintenanceRepository";
import { MaintenanceModel } from "@/models/Maintenance";
import type { MaintenanceInsert } from "@/types/rental";

export class MaintenanceService {
  private static _instance: MaintenanceService;
  private readonly _repository: MaintenanceRepository;

  private constructor() {
    this._repository = MaintenanceRepository.getInstance();
  }

  static getInstance(): MaintenanceService {
    if (!MaintenanceService._instance) {
      MaintenanceService._instance = new MaintenanceService();
    }
    return MaintenanceService._instance;
  }

  async getAllRecords(): Promise<MaintenanceModel[]> {
    const data = await this._repository.findAll();
    return data.map((r) => new MaintenanceModel(r));
  }

  async scheduleMaintenanceRecord(record: MaintenanceInsert): Promise<MaintenanceModel> {
    const data = await this._repository.create({ ...record, status: "scheduled" });
    return new MaintenanceModel(data);
  }

  async advanceStatus(id: string, currentStatus: string): Promise<MaintenanceModel> {
    const nextStatus = currentStatus === "scheduled" ? "in_progress" : "completed";
    const data = await this._repository.updateStatus(id, nextStatus as MaintenanceModel["status"]);
    return new MaintenanceModel(data);
  }
}
