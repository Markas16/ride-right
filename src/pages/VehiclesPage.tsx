import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "@/dal/vehicleDAL";
import { getVehicleIcon, getVehicleLabel } from "@/services/vehicleFactory";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { VehicleType } from "@/types/rental";

export default function VehiclesPage() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles", typeFilter, statusFilter],
    queryFn: () =>
      getVehicles({
        type: typeFilter === "all" ? undefined : typeFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Available Vehicles</h1>
          <p className="text-muted-foreground">Browse and book from our fleet</p>
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="bike">Bike</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 bg-muted rounded-lg" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No vehicles found matching your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{getVehicleIcon(vehicle.type)}</span>
                  <Badge
                    variant={vehicle.status === "available" ? "default" : "secondary"}
                    className={vehicle.status === "available" ? "bg-success text-success-foreground" : ""}
                  >
                    {vehicle.status}
                  </Badge>
                </div>
                <h3 className="font-heading font-bold text-lg">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {getVehicleLabel(vehicle.type)} · {vehicle.year}
                </p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{vehicle.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary">${vehicle.price_per_hour}/hr</p>
                    <p className="text-xs text-muted-foreground">${vehicle.price_per_day}/day</p>
                  </div>
                  <Button
                    size="sm"
                    disabled={vehicle.status !== "available"}
                    onClick={() => navigate(`/book/${vehicle.id}`)}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
