--  Create the flight booking database
CREATE DATABASE IF NOT EXISTS flight_booking;
USE flight_booking;

-- Airlines table
CREATE TABLE airlines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL,
  logo VARCHAR(255)
);

-- Airports table
CREATE TABLE airports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  iata_code VARCHAR(3) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8)
);

-- Flights table
CREATE TABLE flights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  airline_id INT NOT NULL,
  flight_number VARCHAR(10) NOT NULL,
  from_airport_id INT NOT NULL,
  to_airport_id INT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration VARCHAR(10) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (airline_id) REFERENCES airlines(id),
  FOREIGN KEY (from_airport_id) REFERENCES airports(id),
  FOREIGN KEY (to_airport_id) REFERENCES airports(id)
);

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  nationality VARCHAR(50),
  passport_number VARCHAR(50),
  passport_expiry DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference_number VARCHAR(10) UNIQUE NOT NULL,
  user_id INT,
  flight_id INT NOT NULL,
  passengers INT NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (flight_id) REFERENCES flights(id)
);

-- Passenger details for each booking
CREATE TABLE passengers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE NOT NULL,
  nationality VARCHAR(50) NOT NULL,
  passport_number VARCHAR(50) NOT NULL,
  passport_expiry DATE NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('credit_card', 'debit_card', 'paypal') NOT NULL,
  transaction_id VARCHAR(100) UNIQUE,
  card_last_four VARCHAR(4),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Insert sample data for airlines
INSERT INTO airlines (name, code, logo) VALUES
('SkyWay Airlines', 'SW', '/images/airlines/skyway.png'),
('Global Airways', 'GA', '/images/airlines/global.png'),
('Atlantic Express', 'AE', '/images/airlines/atlantic.png'),
('Euro Connect', 'EC', '/images/airlines/euroconnect.png'),
('Pacific Air', 'PA', '/images/airlines/pacific.png');

-- Insert sample data for airports
INSERT INTO airports (name, city, country, iata_code, latitude, longitude) VALUES
('John F. Kennedy International Airport', 'New York', 'United States', 'JFK', 40.6413, -73.7781),
('Heathrow Airport', 'London', 'United Kingdom', 'LHR', 51.4700, -0.4543),
('Charles de Gaulle Airport', 'Paris', 'France', 'CDG', 49.0097, 2.5479),
('Tokyo Haneda Airport', 'Tokyo', 'Japan', 'HND', 35.5494, 139.7798),
('Sydney Airport', 'Sydney', 'Australia', 'SYD', -33.9399, 151.1753);

-- Insert sample data for flights
INSERT INTO flights (airline_id, flight_number, from_airport_id, to_airport_id, departure_time, arrival_time, duration, price, total_seats, available_seats, departure_date) VALUES
(1, 'SW101', 1, 2, '08:00:00', '20:00:00', '7h 00m', 549.00, 180, 12, '2023-07-15'),
(2, 'GA205', 1, 2, '12:30:00', '00:30:00', '7h 00m', 499.00, 160, 8, '2023-07-15'),
(3, 'AE310', 1, 2, '16:45:00', '04:45:00', '7h 00m', 475.00, 150, 3, '2023-07-15'),
(1, 'SW102', 1, 2, '21:15:00', '09:15:00', '7h 00m', 450.00, 180, 15, '2023-07-15'),
(1, 'SW205', 2, 3, '09:30:00', '11:45:00', '1h 15m', 199.00, 120, 22, '2023-07-20'),
(4, 'EC118', 2, 3, '14:15:00', '16:30:00', '1h 15m', 179.00, 100, 5, '2023-07-20'),
(2, 'GA330', 2, 4, '11:00:00', '06:45:00', '11h 45m', 899.00, 220, 10, '2023-08-05'),
(5, 'PA452', 4, 5, '19:30:00', '05:15:00', '9h 45m', 745.00, 200, 7, '2023-08-15');
 