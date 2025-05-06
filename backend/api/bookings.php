<?php
require_once  '../config.php';

header('Content-Type: application/json');

// Create a new booking
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get JSON data from request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid JSON data'
            ]);
            exit;
        }
        
        // Validate required fields
        $requiredFields = ['flightId', 'passengers', 'passengerDetails'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => "Missing required field: $field"
                ]);
                exit;
            }
        }
        
        // Begin transaction
        $pdo->beginTransaction();
        
        // First check if the flight exists and has enough seats
        $flightQuery = "SELECT id, price, available_seats FROM flights WHERE id = ?";
        $flightStmt = $pdo->prepare($flightQuery);
        $flightStmt->execute([$data['flightId']]);
        $flight = $flightStmt->fetch();
        
        if (!$flight) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Flight not found'
            ]);
            exit;
        }
        
        if ($flight['available_seats'] < $data['passengers']) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Not enough seats available'
            ]);
            exit;
        }
        
        // Calculate total price
        $totalPrice = $flight['price'] * $data['passengers'];
        
        // Generate unique booking reference
        $referenceNumber = generateBookingReference();
        
        // Create booking record
        $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
        
        $bookingQuery = "INSERT INTO bookings (reference_number, user_id, flight_id, passengers, total_price) 
                          VALUES (?, ?, ?, ?, ?)";
        $bookingStmt = $pdo->prepare($bookingQuery);
        $bookingStmt->execute([
            $referenceNumber,
            $userId,
            $data['flightId'],
            $data['passengers'],
            $totalPrice
        ]);
        
        $bookingId = $pdo->lastInsertId();
        
        // Create passenger details
        $passengerQuery = "INSERT INTO passengers (booking_id, first_name, last_name, email, phone, 
                          date_of_birth, nationality, passport_number, passport_expiry) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $passengerStmt = $pdo->prepare($passengerQuery);
        
        foreach ($data['passengerDetails'] as $passenger) {
            $passengerStmt->execute([
                $bookingId,
                sanitize($passenger['firstName']),
                sanitize($passenger['lastName']),
                sanitize($passenger['email']),
                sanitize($passenger['phone']),
                sanitize($passenger['dateOfBirth']),
                sanitize($passenger['nationality']),
                sanitize($passenger['passportNumber']),
                sanitize($passenger['passportExpiry'])
            ]);
        }
        
        // Update available seats on the flight
        $updateFlightQuery = "UPDATE flights SET available_seats = available_seats - ? WHERE id = ?";
        $updateFlightStmt = $pdo->prepare($updateFlightQuery);
        $updateFlightStmt->execute([$data['passengers'], $data['flightId']]);
        
        // Commit transaction
        $pdo->commit();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Booking created successfully',
            'data' => [
                'bookingId' => $bookingId,
                'referenceNumber' => $referenceNumber,
                'totalPrice' => $totalPrice
            ]
        ]);
        
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
}

// Get booking by reference number
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['reference'])) {
    try {
        $reference = sanitize($_GET['reference']);
        
        $sql = "SELECT b.id, b.reference_number, b.passengers, b.total_price, b.booking_date, b.status,
                f.id as flight_id, a.name as airline, f.flight_number, 
                from_airport.city as from_city, from_airport.iata_code as from_code,
                to_airport.city as to_city, to_airport.iata_code as to_code,
                f.departure_time, f.arrival_time, f.duration, f.departure_date
                FROM bookings b
                JOIN flights f ON b.flight_id = f.id
                JOIN airlines a ON f.airline_id = a.id
                JOIN airports from_airport ON f.from_airport_id = from_airport.id
                JOIN airports to_airport ON f.to_airport_id = to_airport.id
                WHERE b.reference_number = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$reference]);
        
        $booking = $stmt->fetch();
        
        if (!$booking) {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Booking not found'
            ]);
            exit;
        }
        
        // Get passenger details
        $passengerSql = "SELECT first_name, last_name, email, phone, nationality, passport_number
                         FROM passengers WHERE booking_id = ?";
        $passengerStmt = $pdo->prepare($passengerSql);
        $passengerStmt->execute([$booking['id']]);
        $passengers = $passengerStmt->fetchAll();
        
        // Get payment information
        $paymentSql = "SELECT amount, payment_method, status, payment_date 
                       FROM payments WHERE booking_id = ?";
        $paymentStmt = $pdo->prepare($paymentSql);
        $paymentStmt->execute([$booking['id']]);
        $payment = $paymentStmt->fetch();
        
        // Format flight information
        $booking['flight'] = [
            'id' => $booking['flight_id'],
            'airline' => $booking['airline'],
            'flightNumber' => $booking['flight_number'],
            'from' => $booking['from_city'] . ' (' . $booking['from_code'] . ')',
            'to' => $booking['to_city'] . ' (' . $booking['to_code'] . ')',
            'departureTime' => $booking['departure_time'],
            'arrivalTime' => $booking['arrival_time'],
            'duration' => $booking['duration'],
            'departureDate' => $booking['departure_date']
        ];
        
        // Clean up the response
        unset($booking['flight_id'], $booking['airline'], $booking['flight_number']);
        unset($booking['from_city'], $booking['from_code'], $booking['to_city'], $booking['to_code']);
        unset($booking['departure_time'], $booking['arrival_time'], $booking['duration'], $booking['departure_date']);
        
        $booking['passengers'] = $passengers;
        $booking['payment'] = $payment ?: null;
        $booking['total_price'] = floatval($booking['total_price']);
        
        echo json_encode([
            'status' => 'success',
            'data' => $booking
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
}
?>
 