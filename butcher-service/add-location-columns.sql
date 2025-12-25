-- Add location and availability columns to butchers table
-- Run this script if the columns don't exist yet

USE meathub_butcher;

-- Check and add latitude column
SET @dbname = DATABASE();
SET @tablename = 'butchers';
SET @columnname = 'latitude';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(10, 7) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add longitude column
SET @columnname = 'longitude';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(10, 7) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add service_radius_km column
SET @columnname = 'service_radius_km';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(5, 2) DEFAULT 10.0')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add is_available column
SET @columnname = 'is_available';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' BOOLEAN DEFAULT TRUE')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add indexes for location-based queries (ignore errors if they exist)
CREATE INDEX idx_location ON butchers(latitude, longitude);
CREATE INDEX idx_available ON butchers(is_available, status);

-- Update existing butchers with sample location data (Hyderabad coordinates)
-- This will add random locations around Hyderabad (17.3850° N, 78.4867° E)
UPDATE butchers
SET
    latitude = 17.3850 + (RAND() - 0.5) * 0.1,  -- Randomize within ~5km radius
    longitude = 78.4867 + (RAND() - 0.5) * 0.1,
    service_radius_km = 10.0,
    is_available = TRUE
WHERE latitude IS NULL OR longitude IS NULL;

SELECT 'Migration completed successfully! Butchers table updated with location columns and sample data.' AS Message;
SELECT COUNT(*) AS 'Butchers with location data' FROM butchers WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
