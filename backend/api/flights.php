<?php
require_once  '../config.php';

header('Content-Type: application/json');

// Get all flights with optional search parameters
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = "SELECT f.id, a.name as airline, f.flight_number, 
                from_airport.city as from_city, from_airport.iata_code as from_code,
                to_airport.city as to_city, to_airport.iata_code as to_code,
                f.departure_time, f.arrival_time, f.duration, f.price, 
                f.available_seats, f.departure_date, f.return_date
                FROM flights f
                JOIN airlines a ON f.airline_id = a.id
                JOIN airports from_airport ON f.from_airport_id = from_airport.id
                JOIN airports to_airport ON f.to_airport_id = to_airport.id
                WHERE 1=1";
        
        $params = [];
        
        // Optional search filters
        if (isset($_GET['from']) && !empty($_GET['from'])) {
            $sql .= " AND from_airport.city LIKE ? OR from_airport.iata_code LIKE ?";
            $params[] = '%' . $_GET['from'] . '%';
            $params[] = '%' . $_GET['from'] . '%';
        }
        
        if (isset($_GET['to']) && !empty($_GET['to'])) {
            $sql .= " AND to_airport.city LIKE ? OR to_airport.iata_code LIKE ?";
            $params[] = '%' . $_GET['to'] . '%';
            $params[] = '%' . $_GET['to'] . '%';
        }
        
        if (isset($_GET['departDate']) && !empty($_GET['departDate'])) {
            $sql .= " AND f.departure_date = ?";
            $params[] = $_GET['departDate'];
        }
        
        if (isset($_GET['minPrice']) && is_numeric($_GET['minPrice'])) {
            $sql .= " AND f.price >= ?";
            $params[] = $_GET['minPrice'];
        }
        
        if (isset($_GET['maxPrice']) && is_numeric($_GET['maxPrice'])) {
            $sql .= " AND f.price <= ?";
            $params[] = $_GET['maxPrice'];
        }
        
        if (isset($_GET['airline']) && !empty($_GET['airline'])) {
            $sql .= " AND a.name LIKE ?";
            $params[] = '%' . $_GET['airline'] . '%';
        }
        
        // Sort results
        $sort = isset($_GET['sort']) ? $_GET['sort'] : 'price_asc';
        
        switch ($sort) {
            case 'price_desc':
                $sql .= " ORDER BY f.price DESC";
                break;
            case 'duration':
                $sql .= " ORDER BY f.duration ASC";
                break;
            case 'departure':
                $sql .= " ORDER BY f.departure_time ASC";
                break;
            case 'arrival':
                $sql .= " ORDER BY f.arrival_time ASC";
                break;
            default:
                $sql .= " ORDER BY f.price ASC";
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        $flights = $stmt->fetchAll();
        
        foreach ($flights as &$flight) {
            $flight['from'] = $flight['from_city'] . ' (' . $flight['from_code'] . ')';
            $flight['to'] = $flight['to_city'] . ' (' . $flight['to_code'] . ')';
            unset($flight['from_city'], $flight['from_code'], $flight['to_city'], $flight['to_code']);
            
            // Format price for display
            $flight['price'] = floatval($flight['price']);
            $flight['available_seats'] = intval($flight['available_seats']);
        }
        
        echo json_encode([
            'status' => 'success',
            'count' => count($flights),
            'data' => $flights
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
}

// Get a specific flight by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    try {
        $id = sanitize($_GET['id']);
        
        $sql = "SELECT f.id, a.name as airline, f.flight_number, 
                from_airport.city as from_city, from_airport.iata_code as from_code,
                to_airport.city as to_city, to_airport.iata_code as to_code,
                f.departure_time, f.arrival_time, f.duration, f.price, 
                f.available_seats, f.departure_date, f.return_date
                FROM flights f
                JOIN airlines a ON f.airline_id = a.id
                JOIN airports from_airport ON f.from_airport_id = from_airport.id
                JOIN airports to_airport ON f.to_airport_id = to_airport.id
                WHERE f.id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        
        $flight = $stmt->fetch();
        
        if (!$flight) {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Flight not found'
            ]);
            exit;
        }
        
        $flight['from'] = $flight['from_city'] . ' (' . $flight['from_code'] . ')';
        $flight['to'] = $flight['to_city'] . ' (' . $flight['to_code'] . ')';
        unset($flight['from_city'], $flight['from_code'], $flight['to_city'], $flight['to_code']);
        
        // Format price and available seats
        $flight['price'] = floatval($flight['price']);
        $flight['available_seats'] = intval($flight['available_seats']);
        
        echo json_encode([
            'status' => 'success',
            'data' => $flight
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
 