import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, GitBranch, Users, ArrowRightLeft, Activity } from "lucide-react";
import MermaidDiagram from "@/components/diagrams/MermaidDiagram";

const classDiagram = `classDiagram
    direction TB

    class CustomerModel {
        -_id: string
        -_userId: string
        -_fullName: string
        -_phone: string
        +get id() string
        +get fullName() string
        +getDisplayName() string
        +toJSON() object
    }

    class VehicleModel {
        -_id: string
        -_type: VehicleType
        -_make: string
        -_model: string
        -_year: number
        -_pricePerHour: number
        -_pricePerDay: number
        -_status: VehicleStatus
        +get displayName() string
        +isAvailable() boolean
        +isUnderMaintenance() boolean
        +toRaw() Vehicle
    }

    class BookingModel {
        -_id: string
        -_customerId: string
        -_vehicleId: string
        -_startTime: string
        -_endTime: string
        -_totalCost: number
        -_status: BookingStatus
        -_vehicle: VehicleModel
        -_payment: PaymentModel
        +isCancellable() boolean
        +isActive() boolean
        +get formattedCost() string
        +static fromFull() BookingModel
    }

    class PaymentModel {
        -_id: string
        -_bookingId: string
        -_amount: number
        -_paymentMethod: string
        -_status: PaymentStatus
        +isCompleted() boolean
        +get formattedAmount() string
    }

    class MaintenanceModel {
        -_id: string
        -_vehicleId: string
        -_description: string
        -_serviceDate: string
        -_status: MaintenanceStatus
        +isCompleted() boolean
        +get formattedDate() string
    }

    class VehicleFactory {
        +static createVehicle(type) object
        +static getDefaults(type) object
    }

    class BookingService {
        -static instance: BookingService
        +static getInstance() BookingService
        +createBooking() BookingModel
        +cancelBooking() void
        +validateBooking() boolean
    }

    class PricingStrategy {
        <<interface>>
        +calculate() number
        +label: string
    }

    class HourlyPricing {
        +calculate() number
        +label: "Hourly"
    }

    class DailyPricing {
        +calculate() number
        +label: "Daily"
    }

    CustomerModel "1" --> "*" BookingModel : has many
    VehicleModel "1" --> "*" BookingModel : has many
    BookingModel "1" --> "1" PaymentModel : has one
    VehicleModel "1" --> "*" MaintenanceModel : has many
    VehicleFactory ..> VehicleModel : creates
    BookingService ..> PricingStrategy : uses
    PricingStrategy <|.. HourlyPricing : implements
    PricingStrategy <|.. DailyPricing : implements
`;

const useCaseDiagram = `flowchart LR
    subgraph Actors
        C((Customer))
        A((Admin))
    end

    subgraph Customer Actions
        UC1[Register / Login]
        UC2[View Vehicles]
        UC3[Book Vehicle]
        UC4[Make Payment]
        UC5[View Booking History]
    end

    subgraph Admin Actions
        UA1[Manage Vehicles]
        UA2[Manage Bookings]
        UA3[Manage Maintenance]
    end

    subgraph Shared
        US1[View Dashboard]
    end

    C --> UC1
    C --> UC2
    C --> UC3
    C --> UC4
    C --> UC5
    C --> US1

    A --> UA1
    A --> UA2
    A --> UA3
    A --> US1
    A --> UC1
`;

const sequenceDiagram = `sequenceDiagram
    participant U as Customer UI
    participant Ctrl as BookingController
    participant Svc as BookingService
    participant PS as PricingStrategy
    participant BR as BookingRepository
    participant PR as PaymentRepository
    participant DB as Database

    U->>Ctrl: submitBooking(dates, vehicleId)
    Ctrl->>Svc: createBooking(params)

    Note over Svc: Validate booking dates
    Svc->>BR: checkOverlap(vehicleId, start, end)
    BR->>DB: SELECT conflicting bookings
    DB-->>BR: results
    BR-->>Svc: no conflicts

    Note over Svc: Calculate price (Strategy Pattern)
    Svc->>PS: calculate(pricePerHour, pricePerDay, start, end)
    PS-->>Svc: totalCost

    Svc->>BR: insert(bookingData)
    BR->>DB: INSERT INTO bookings
    DB-->>BR: booking row
    BR-->>Svc: BookingModel

    Note over Svc: Create payment record
    Svc->>PR: insert(paymentData)
    PR->>DB: INSERT INTO payments
    DB-->>PR: payment row
    PR-->>Svc: PaymentModel

    Svc-->>Ctrl: BookingModel (with payment)
    Ctrl-->>U: Booking confirmed
`;

const activityDiagram = `stateDiagram-v2
    [*] --> Pending : Customer submits booking
    Pending --> Confirmed : Admin confirms / Auto-confirm
    Pending --> Cancelled : Customer cancels
    Confirmed --> Completed : Rental period ends
    Confirmed --> Cancelled : Customer or Admin cancels
    Completed --> [*]
    Cancelled --> [*]

    state Pending {
        [*] --> ValidatingDates
        ValidatingDates --> CheckingOverlap
        CheckingOverlap --> CalculatingPrice : No conflicts
        CheckingOverlap --> Rejected : Overlap found
        CalculatingPrice --> CreatingPayment
        CreatingPayment --> AwaitingConfirmation
    }

    state Confirmed {
        [*] --> PaymentProcessed
        PaymentProcessed --> VehicleAssigned
        VehicleAssigned --> InProgress : Rental starts
    }
`;

const diagrams = [
  {
    id: "class",
    label: "Class Diagram",
    icon: Box,
    chart: classDiagram,
    title: "Class Diagram — Domain Models & Design Patterns",
    description:
      "Shows the five core domain models (Customer, Vehicle, Booking, Payment, Maintenance) with private fields and public methods. Highlights the Factory Pattern for vehicle creation, Singleton Pattern in BookingService, and Strategy Pattern for dynamic pricing.",
  },
  {
    id: "usecase",
    label: "Use Case",
    icon: Users,
    chart: useCaseDiagram,
    title: "Use Case Diagram — Actor Interactions",
    description:
      "Illustrates the two primary actors (Customer and Admin) and their interactions with the system. Customers can browse, book, pay, and track history. Admins manage vehicles, bookings, and maintenance schedules.",
  },
  {
    id: "sequence",
    label: "Sequence",
    icon: ArrowRightLeft,
    chart: sequenceDiagram,
    title: "Sequence Diagram — Booking Flow",
    description:
      "Traces the full booking lifecycle through the layered architecture: UI → Controller → Service → Repository → Database. Highlights overlap validation, strategy-based pricing, and payment creation.",
  },
  {
    id: "activity",
    label: "Activity",
    icon: Activity,
    chart: activityDiagram,
    title: "Activity Diagram — Booking State Machine",
    description:
      "Models the complete booking lifecycle as a state machine. A booking transitions from Pending (with internal validation, overlap checking, and price calculation) through Confirmed (payment processed, vehicle assigned) to either Completed or Cancelled.",
  },
];

export default function SystemDesignPage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <GitBranch className="h-7 w-7 text-primary" />
            System Design
          </h1>
          <p className="text-muted-foreground mt-1">
            OOAD architecture overview — class relationships, use cases, and interaction flows.
          </p>
        </div>

        <Tabs defaultValue="class" className="w-full">
          <TabsList className="glass-card border border-border/40 mb-6">
            {diagrams.map((d) => (
              <TabsTrigger key={d.id} value={d.id} className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <d.icon className="h-4 w-4" />
                {d.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {diagrams.map((d) => (
            <TabsContent key={d.id} value={d.id}>
              <StaggerContainer className="space-y-4">
                <StaggerItem>
                  <Card className="glass-card border-border/40">
                    <CardHeader>
                      <CardTitle className="font-heading text-lg">{d.title}</CardTitle>
                      <CardDescription>{d.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MermaidDiagram chart={d.chart} />
                    </CardContent>
                  </Card>
                </StaggerItem>
              </StaggerContainer>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageTransition>
  );
}
