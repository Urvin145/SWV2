-- ============================================================================
-- Scrapwala — Fix Booking Triggers Migration
-- 
-- Fixes the foreign key constraint violation during booking creation by 
-- separating the status change trigger into:
-- 1. A BEFORE trigger for modifying timestamps on the bookings table.
-- 2. An AFTER trigger for inserting into the booking_status_logs table.
-- ============================================================================

-- Drop the old trigger that caused the foreign key violation
DROP TRIGGER IF EXISTS booking_status_change ON bookings;

-- 1. Create a function to handle timestamps BEFORE update
CREATE OR REPLACE FUNCTION set_booking_status_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NEW.status = 'confirmed' THEN
      NEW.confirmed_at = now();
    ELSIF NEW.status = 'completed' THEN
      NEW.completed_at = now();
    ELSIF NEW.status = 'cancelled' THEN
      NEW.cancelled_at = now();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger BEFORE update to adjust timestamps
CREATE OR REPLACE TRIGGER booking_status_timestamps
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_status_timestamps();

-- 2. Create a function to log status changes AFTER insert or update
CREATE OR REPLACE FUNCTION log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO booking_status_logs (booking_id, previous_status, new_status, notes)
    VALUES (NEW.id, NULL, NEW.status, 'Booking created');
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO booking_status_logs (booking_id, previous_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger AFTER insert or update to safely insert logs without violating foreign keys
CREATE OR REPLACE TRIGGER booking_status_change
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION log_booking_status_change();
