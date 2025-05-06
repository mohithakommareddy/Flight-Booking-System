<?php
require_once  '../config.php';

// Set header to JSON
header('Content-Type: application/json');

// Handle API root - Return available endpoints
echo json_encode([
    'status' => 'success',
    'message' => 'Welcome to the Flight Booking API',
    'endpoints' => [
        'flights' => API_BASE . '/flights.php',
        'flights/{id}' => API_BASE . '/flights.php?id={id}',
        'bookings' => API_BASE . '/bookings.php',
        'bookings/{reference}' => API_BASE . '/bookings.php?reference={reference}',
        'payments' => API_BASE . '/payments.php',
    ]
]);
?>
 