// Strategy Pattern: Pricing strategies
import { differenceInHours, differenceInDays } from "date-fns";

export interface PricingStrategy {
  calculate(pricePerHour: number, pricePerDay: number, startTime: Date, endTime: Date): number;
  label: string;
}

class HourlyPricingStrategy implements PricingStrategy {
  label = "Hourly";
  calculate(pricePerHour: number, _pricePerDay: number, startTime: Date, endTime: Date): number {
    const hours = Math.max(1, Math.ceil(differenceInHours(endTime, startTime)));
    return hours * pricePerHour;
  }
}

class DailyPricingStrategy implements PricingStrategy {
  label = "Daily";
  calculate(_pricePerHour: number, pricePerDay: number, startTime: Date, endTime: Date): number {
    const days = Math.max(1, Math.ceil(differenceInDays(endTime, startTime)));
    return days * pricePerDay;
  }
}

// Factory for pricing strategies
export function getPricingStrategy(startTime: Date, endTime: Date): PricingStrategy {
  const hours = differenceInHours(endTime, startTime);
  return hours < 24 ? new HourlyPricingStrategy() : new DailyPricingStrategy();
}

export function calculateRentalCost(
  pricePerHour: number,
  pricePerDay: number,
  startTime: Date,
  endTime: Date
): { cost: number; strategy: string } {
  const strategy = getPricingStrategy(startTime, endTime);
  return {
    cost: strategy.calculate(pricePerHour, pricePerDay, startTime, endTime),
    strategy: strategy.label,
  };
}
