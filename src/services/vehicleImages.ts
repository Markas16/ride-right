import vehicleCarImg from "@/assets/vehicle-car.jpg";
import vehicleBikeImg from "@/assets/vehicle-bike.jpg";
import vehicleTruckImg from "@/assets/vehicle-truck.jpg";
import type { VehicleType } from "@/types/rental";

const vehicleImages: Record<VehicleType, string> = {
  car: vehicleCarImg,
  bike: vehicleBikeImg,
  truck: vehicleTruckImg,
};

export function getVehicleImage(type: VehicleType): string {
  return vehicleImages[type];
}
