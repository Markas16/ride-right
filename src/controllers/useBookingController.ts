// Controller: Booking Controller Hook
// Bridges UI to BookingService

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingService, type BookingRequest } from "@/services/BookingService";
import { toast } from "sonner";

const bookingService = BookingService.getInstance();

export function useUserBookings(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-bookings", userId],
    queryFn: () => bookingService.getUserBookings(userId!),
    enabled: !!userId,
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: ["all-bookings"],
    queryFn: () => bookingService.getAllBookings(),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BookingRequest) => bookingService.createBooking(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Booking confirmed!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast.success("Booking cancelled.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
