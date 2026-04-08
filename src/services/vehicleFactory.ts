// Factory Pattern: Vehicle factory for creating vehicle objects with defaults
import type { VehicleType, VehicleInsert } from "@/types/rental";

interface VehicleDefaults {
  pricePerHour: number;
  pricePerDay: number;
  description: string;
}

const VEHICLE_DEFAULTS: Record<VehicleType, VehicleDefaults> = {
  car: { pricePerHour: 15, pricePerDay: 120, description: "Comfortable car for city and highway driving" },
  bike: { pricePerHour: 5, pricePerDay: 35, description: "Agile bike perfect for urban commuting" },
  truck: { pricePerHour: 25, pricePerDay: 200, description: "Heavy-duty truck for hauling and transport" },
};

export function createVehicle(
  type: VehicleType,
  make: string,
  model: string,
  year: number,
  overrides?: Partial<VehicleInsert>
): VehicleInsert {
  const defaults = VEHICLE_DEFAULTS[type];
  return {
    type,
    make,
    model,
    year,
    price_per_hour: overrides?.price_per_hour ?? defaults.pricePerHour,
    price_per_day: overrides?.price_per_day ?? defaults.pricePerDay,
    description: overrides?.description ?? defaults.description,
    image_url: overrides?.image_url ?? "",
    status: overrides?.status ?? "available",
  };
}

export function getVehicleIcon(type: VehicleType): string {
  switch (type) {
    case "car": return "🚗";
    case "bike": return "🏍️";
    case "truck": return "🚛";
  }
}

export function getVehicleLabel(type: VehicleType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
