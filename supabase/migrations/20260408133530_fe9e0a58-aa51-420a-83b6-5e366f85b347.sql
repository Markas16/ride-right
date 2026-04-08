
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS no_overlapping_bookings;
DROP EXTENSION IF EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS btree_gist SCHEMA extensions;
ALTER TABLE public.bookings ADD CONSTRAINT no_overlapping_bookings
  EXCLUDE USING gist (
    vehicle_id WITH =,
    tstzrange(start_time, end_time) WITH &&
  ) WHERE (status != 'cancelled');
