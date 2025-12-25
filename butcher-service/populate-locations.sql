-- Populate location data for existing butchers
-- Run this AFTER the columns have been created (by Hibernate or migration script)

USE meathub_butcher;

-- Update existing butchers with sample location data (Hyderabad coordinates)
-- This will add random locations around Hyderabad (17.3850° N, 78.4867° E)
-- within approximately 5km radius
UPDATE butchers
SET
    latitude = 17.3850 + (RAND() - 0.5) * 0.1,  -- Randomize within ~5km radius
    longitude = 78.4867 + (RAND() - 0.5) * 0.1,
    service_radius_km = COALESCE(service_radius_km, 10.0),
    is_available = COALESCE(is_available, TRUE)
WHERE (latitude IS NULL OR longitude IS NULL)
  AND status = 'APPROVED';

-- Show results
SELECT 
    id,
    shop_name,
    latitude,
    longitude,
    service_radius_km,
    is_available,
    status
FROM butchers
WHERE latitude IS NOT NULL AND longitude IS NOT NULL
ORDER BY id;

SELECT CONCAT('Updated ', ROW_COUNT(), ' butchers with location data.') AS Result;

