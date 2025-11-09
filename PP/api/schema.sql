-- Create database (run once if not created)
-- CREATE DATABASE parkingfinder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE parkingfinder;

CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	phone VARCHAR(50) NULL,
	password_hash VARCHAR(255) NOT NULL,
	is_admin TINYINT(1) NOT NULL DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT PRIMARY KEY,
    vehicle_make VARCHAR(100) NULL,
    vehicle_plate VARCHAR(50) NULL,
    address VARCHAR(255) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Parking slots managed by admin dashboard
CREATE TABLE IF NOT EXISTS parking_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type ENUM('street','lot','garage','valet') NOT NULL DEFAULT 'street',
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration VARCHAR(50) NOT NULL DEFAULT '2 hours',
    capacity INT NOT NULL DEFAULT 0,
    occupied INT NOT NULL DEFAULT 0,
    features TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


