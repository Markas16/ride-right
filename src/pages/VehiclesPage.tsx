import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { ArrowRight, Car, Bike, Star } from "lucide-react";

// Car images
import swiftImg from "@/assets/vehicles/swift.jpg";
import dzireImg from "@/assets/vehicles/dzire.jpg";
import indigoImg from "@/assets/vehicles/indigo.jpg";
import innovaImg from "@/assets/vehicles/innova.jpg";
import bmwSedanImg from "@/assets/vehicles/bmw-sedan.jpg";
import audiRs7Img from "@/assets/vehicles/audi-rs7.jpg";

// Bike images
import splendorImg from "@/assets/vehicles/splendor.jpg";
import pulsarImg from "@/assets/vehicles/pulsar.jpg";
import yamahaMtImg from "@/assets/vehicles/yamaha-mt.jpg";
import yamahaR15Img from "@/assets/vehicles/yamaha-r15.jpg";
import ktmDukeImg from "@/assets/vehicles/ktm-duke.jpg";
import ktmRcImg from "@/assets/vehicles/ktm-rc.jpg";
import bmwG310Img from "@/assets/vehicles/bmw-g310rr.jpg";
import harley883Img from "@/assets/vehicles/harley-883.jpg";

type VehicleTier = "Budget" | "Standard" | "Premium" | "Luxury";

interface StaticVehicle {
  id: string;
  name: string;
  price: number;
  image: string;
  tier: VehicleTier;
  rating: number;
}

const tierColors: Record<VehicleTier, string> = {
  Budget: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Standard: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Premium: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Luxury: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const cars: StaticVehicle[] = [
  { id: "swift", name: "Maruti Suzuki Swift", price: 95, image: swiftImg, tier: "Budget", rating: 4.6 },
  { id: "dzire", name: "Maruti Suzuki Swift Dzire", price: 100, image: dzireImg, tier: "Budget", rating: 4.5 },
  { id: "indigo", name: "Tata Indigo", price: 75, image: indigoImg, tier: "Budget", rating: 4.3 },
  { id: "innova", name: "Toyota Innova Crysta", price: 200, image: innovaImg, tier: "Premium", rating: 4.8 },
  { id: "bmw-sedan", name: "BMW Sedan", price: 300, image: bmwSedanImg, tier: "Luxury", rating: 4.9 },
  { id: "audi-rs7", name: "Audi RS7", price: 350, image: audiRs7Img, tier: "Luxury", rating: 4.9 },
];

const bikes: StaticVehicle[] = [
  { id: "splendor", name: "Hero Honda Splendor", price: 35, image: splendorImg, tier: "Budget", rating: 4.4 },
  { id: "pulsar", name: "Bajaj Pulsar", price: 45, image: pulsarImg, tier: "Budget", rating: 4.5 },
  { id: "yamaha-mt", name: "Yamaha MT", price: 70, image: yamahaMtImg, tier: "Standard", rating: 4.6 },
  { id: "yamaha-r15", name: "Yamaha R15", price: 170, image: yamahaR15Img, tier: "Premium", rating: 4.7 },
  { id: "ktm-duke", name: "KTM Duke 390", price: 160, image: ktmDukeImg, tier: "Premium", rating: 4.7 },
  { id: "ktm-rc", name: "KTM RC 390", price: 200, image: ktmRcImg, tier: "Premium", rating: 4.8 },
  { id: "bmw-g310rr", name: "BMW G 310 RR", price: 280, image: bmwG310Img, tier: "Luxury", rating: 4.8 },
  { id: "harley-883", name: "Harley Davidson Iron 883", price: 300, image: harley883Img, tier: "Luxury", rating: 4.9 },
];

function VehicleCard({ vehicle }: { vehicle: StaticVehicle }) {
  const navigate = useNavigate();

  return (
    <StaggerItem>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group"
      >
        <div className="glass-card rounded-2xl overflow-hidden border-border/30 hover:glow transition-all duration-300">
          <div className="relative h-48 overflow-hidden bg-muted/20">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              width={800}
              height={600}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
            <Badge
              className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${tierColors[vehicle.tier]}`}
            >
              {vehicle.tier}
            </Badge>
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="text-xs font-semibold">{vehicle.rating}</span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-heading font-bold text-base mb-3 line-clamp-1">{vehicle.name}</h3>

            <div className="flex items-center justify-between pt-3 border-t border-border/30">
              <p className="text-xl font-heading font-bold gradient-text">
                ₹{vehicle.price}<span className="text-sm font-normal text-muted-foreground">/hr</span>
              </p>
              <Button
                size="sm"
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
}

function SectionHeader({ icon: Icon, title, count }: { icon: typeof Car; title: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div>
        <h2 className="text-2xl font-heading font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{count} vehicles available</p>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <PageTransition>
      <div className="space-y-12">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold">
            Our <span className="gradient-text">Fleet</span>
          </h1>
          <p className="text-muted-foreground mt-1">Browse and book from our premium collection</p>
        </div>

        {/* Cars Section */}
        <section>
          <SectionHeader icon={Car} title="Cars" count={cars.length} />
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </StaggerContainer>
        </section>

        {/* Bikes Section */}
        <section>
          <SectionHeader icon={Bike} title="Bikes" count={bikes.length} />
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bikes.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </StaggerContainer>
        </section>
      </div>
    </PageTransition>
  );
}
