import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "@/controllers/useVehicleController";
import { getVehicleLabel } from "@/services/vehicleFactory";
import { getVehicleImage } from "@/services/vehicleImages";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { SkeletonCard } from "@/components/ui/skeleton-cards";
import { motion } from "framer-motion";
import { ArrowRight, Car, Bike, Truck, Filter, Fuel, Clock } from "lucide-react";

const typeIcons: Record<string, any> = { car: Car, bike: Bike, truck: Truck };

export default function VehiclesPage() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: vehicles = [], isLoading } = useVehicles({
    type: typeFilter === "all" ? undefined : typeFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold">
              Our <span className="gradient-text">Fleet</span>
            </h1>
            <p className="text-muted-foreground mt-1">Browse and book from our premium collection</p>
          </div>
          <div className="flex gap-3 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 h-10 rounded-xl glass-card border-border/40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-10 rounded-xl glass-card border-border/40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center text-muted-foreground">
            No vehicles found matching your filters.
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => {
              const TypeIcon = typeIcons[vehicle.type] || Car;
              return (
                <StaggerItem key={vehicle.id}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="group"
                  >
                    <div className="glass-card rounded-2xl overflow-hidden border-border/30 hover:glow transition-all duration-300">
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={getVehicleImage(vehicle.type)}
                          alt={vehicle.displayName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                        <Badge
                          className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold ${
                            vehicle.isAvailable()
                              ? "bg-success/90 text-success-foreground backdrop-blur-sm"
                              : "bg-muted/90 text-muted-foreground backdrop-blur-sm"
                          }`}
                        >
                          {vehicle.status}
                        </Badge>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                            <TypeIcon className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <span className="text-primary-foreground text-sm font-medium">
                            {getVehicleLabel(vehicle.type)}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-heading font-bold text-lg mb-1">{vehicle.displayName}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{vehicle.description}</p>

                        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {vehicle.year}</span>
                          <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" /> Auto</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/30">
                          <div>
                            <p className="text-xl font-heading font-bold gradient-text">₹{vehicle.pricePerHour}<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
                            <p className="text-xs text-muted-foreground">₹{vehicle.pricePerDay}/day</p>
                          </div>
                          <Button
                            size="sm"
                            disabled={!vehicle.isAvailable()}
                            onClick={() => navigate(`/book/${vehicle.id}`)}
                            className="rounded-xl gradient-primary text-primary-foreground hover:opacity-90 transition-all group/btn gap-1"
                          >
                            Book Now
                            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </PageTransition>
  );
}
