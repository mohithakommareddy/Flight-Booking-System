<?php
//  Database connection settings
$host = 'localhost';
$dbname = 'flight_booking';
$username = 'root';
$password = '';

// Establish database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Session configuration
session_start();

// Application settings
define('APP_NAME', 'SkyWay Flight Booking');
define('APP_URL', 'http://localhost/flight-booking');
define('API_BASE', '/api');

// Function to sanitize user input
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to generate a unique booking reference
function generateBookingReference() {
    return 'SKY' . strtoupper(substr(uniqid(), -6));
}

// Function to format price
function formatPrice($price) {
    return number_format($price, 2);
}
?>
 