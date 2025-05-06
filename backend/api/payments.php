<?php
require_once  '../config.php';

header('Content-Type: application/json');

// Process a payment for a booking
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
        $requiredFields = ['bookingId', 'paymentMethod', 'cardDetails'];
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
        
        // Validate card details
        $cardDetails = $data['cardDetails'];
        $requiredCardFields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
        
        foreach ($requiredCardFields as $field) {
            if (!isset($cardDetails[$field]) || empty($cardDetails[$field])) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => "Missing required card detail: $field"
                ]);
                exit;
            }
        }
        
        // Begin transaction
        $pdo->beginTransaction();
        
        // Check if booking exists and payment is not already processed
        $bookingQuery = "SELECT b.id, b.total_price, b.status, 
                         (SELECT COUNT(*) FROM payments WHERE booking_id = b.id) as payment_exists
                         FROM bookings b WHERE b.id = ?";
        $bookingStmt = $pdo->prepare($bookingQuery);
        $bookingStmt->execute([$data['bookingId']]);
        $booking = $bookingStmt->fetch();
        
        if (!$booking) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Booking not found'
            ]);
            exit;
        }
        
        if ($booking['payment_exists'] > 0) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Payment already processed for this booking'
            ]);
            exit;
        }
        
        // In a real application, you would integrate with a payment gateway here
        // For this example, we'll simulate a payment process
        
        // Generate a transaction ID
        $transactionId = 'TXN' . strtoupper(substr(uniqid(), -8));
        
        // Get the last 4 digits of the card number
        $cardLastFour = substr(str_replace(' ', '', $cardDetails['cardNumber']), -4);
        
        // Determine payment method based on card number
        $paymentMethod = 'credit_card'; // Default
        
        // Insert payment record
        $paymentQuery = "INSERT INTO payments (booking_id, amount, payment_method, transaction_id, 
                        card_last_four, status) VALUES (?, ?, ?, ?, ?, ?)";
        $paymentStmt = $pdo->prepare($paymentQuery);
        $paymentStmt->execute([
            $data['bookingId'],
            $booking['total_price'],
            $paymentMethod,
            $transactionId,
            $cardLastFour,
            'completed' // In a real app, this would depend on the payment gateway response
        ]);
        
        // Update booking status
        $updateBookingQuery = "UPDATE bookings SET status = 'confirmed' WHERE id = ?";
        $updateBookingStmt = $pdo->prepare($updateBookingQuery);
        $updateBookingStmt->execute([$data['bookingId']]);
        
        // Commit transaction
        $pdo->commit();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Payment processed successfully',
            'data' => [
                'transactionId' => $transactionId,
                'amount' => floatval($booking['total_price']),
                'paymentMethod' => $data['paymentMethod'],
                'cardLastFour' => $cardLastFour,
                'status' => 'completed',
                'paymentDate' => date('Y-m-d H:i:s')
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
?>
 