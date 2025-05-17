<?php
session_start();

//  Database configuration
$host = 'localhost';
$dbname = 'flight_booking';
$username = 'root';
$password = '';

// Connect to database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Process search form
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tripType = $_POST['tripType'] ?? '';
    $fromLocation = $_POST['fromLocation'] ?? '';
    $toLocation = $_POST['toLocation'] ?? '';
    $departDate = $_POST['departDate'] ?? '';
    $returnDate = $_POST['returnDate'] ?? '';
    $passengers = (int)($_POST['passengers'] ?? 1);
    $travelClass = $_POST['travelClass'] ?? 'economy';
    
    // Validate input data
    $errors = [];
    
    if (empty($fromLocation)) {
        $errors[] = "Departure location is required.";
    }
    
    if (empty($toLocation)) {
        $errors[] = "Destination location is required.";
    }
    
    if (empty($departDate)) {
        $errors[] = "Departure date is required.";
    }
    
    if ($tripType === 'roundTrip' && empty($returnDate)) {
        $errors[] = "Return date is required for round trips.";
    }
    
    // If there are errors, store them in session and redirect back
    if (!empty($errors)) {
        $_SESSION['search_errors'] = $errors;
        $_SESSION['search_data'] = $_POST;
        header("Location: index.html#search-form");
        exit;
    }
    
    // For demo purposes, generate some sample flight results
    $flights = generateSampleFlights($fromLocation, $toLocation, $departDate, $returnDate, $tripType);
}

// Function to generate sample flights for demo
function generateSampleFlights($from, $to, $departDate, $returnDate, $tripType) {
    $airlines = ['SkyAir', 'Global Wings', 'Blue Horizon', 'Star Airlines', 'Royal Jets'];
    $flights = [];
    
    // Generate 5-8 outbound flights
    $numOutbound = rand(5, 8);
    for ($i = 0; $i < $numOutbound; $i++) {
        $departTime = strtotime($departDate) + rand(7, 20) * 3600; // Between 7 AM and 8 PM
        $flightDuration = rand(120, 600); // 2-10 hours in minutes
        $arrivalTime = $departTime + $flightDuration * 60;
        
        $flights['outbound'][] = [
            'flight_number' => strtoupper(substr($airlines[$i % count($airlines)], 0, 2)) . rand(100, 999),
            'airline' => $airlines[$i % count($airlines)],
            'from' => $from,
            'to' => $to,
            'depart_time' => date('Y-m-d H:i:s', $departTime),
            'arrival_time' => date('Y-m-d H:i:s', $arrivalTime),
            'duration' => $flightDuration,
            'price' => rand(150, 800),
            'stops' => rand(0, 2)
        ];
    }
    
    // Generate return flights for round trips
    if ($tripType === 'roundTrip' && !empty($returnDate)) {
        $numReturn = rand(5, 8);
        for ($i = 0; $i < $numReturn; $i++) {
            $departTime = strtotime($returnDate) + rand(7, 20) * 3600;
            $flightDuration = rand(120, 600);
            $arrivalTime = $departTime + $flightDuration * 60;
            
            $flights['return'][] = [
                'flight_number' => strtoupper(substr($airlines[$i % count($airlines)], 0, 2)) . rand(100, 999),
                'airline' => $airlines[$i % count($airlines)],
                'from' => $to,
                'to' => $from,
                'depart_time' => date('Y-m-d H:i:s', $departTime),
                'arrival_time' => date('Y-m-d H:i:s', $arrivalTime),
                'duration' => $flightDuration,
                'price' => rand(150, 800),
                'stops' => rand(0, 2)
            ];
        }
    }
    
    return $flights;
}

// Format duration as hours and minutes
function formatDuration($minutes) {
    $hours = floor($minutes / 60);
    $mins = $minutes % 60;
    return $hours . 'h ' . $mins . 'm';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Built with jdoodle.ai - View and book available flights on SkyJourney">
  <meta property="og:title" content="Flight Search Results - SkyJourney">
  <meta property="og:description" content="Built with jdoodle.ai - Compare flights and book your next journey with SkyJourney">
  <meta property="og:image" content="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/7d53e3f3ja602j4070j925aj8c26cb20ea62/public">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="Flight Search Results - SkyJourney">
  <meta property="twitter:description" content="Built with jdoodle.ai - Compare flights and book your next journey with SkyJourney">
  <meta property="twitter:image" content="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/7d53e3f3ja602j4070j925aj8c26cb20ea62/public">
  <title>Flight Search Results - SkyJourney</title>
  <link rel="icon" href="favicon.ico">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="index.html">
        <i class="bi bi-airplane fs-3 me-2"></i>
        <span class="fw-bold">SkyJourney</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="index.html#flights">Flights</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="index.html#deals">Deals</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="index.html#about">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="index.html#contact">Contact</a>
          </li>
          <li class="nav-item ms-lg-3">
            <a class="btn btn-light" href="login.html">Login</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Search Results Section -->
  <section class="py-5 bg-light">
    <div class="container">
      <!-- Search Summary -->
      <div class="search-summary bg-white p-4 rounded shadow-sm mb-4">
        <div class="row">
          <div class="col-md-8">
            <h5 class="mb-3">
              <?php echo htmlspecialchars($fromLocation); ?> → <?php echo htmlspecialchars($toLocation); ?>
              <?php if ($tripType === 'roundTrip'): ?>
                → <?php echo htmlspecialchars($fromLocation); ?>
              <?php endif; ?>
            </h5>
            <div class="d-flex flex-wrap">
              <div class="me-4 mb-2">
                <small class="text-muted d-block">Departure</small>
                <span><?php echo date('M d, Y', strtotime($departDate)); ?></span>
              </div>
              <?php if ($tripType === 'roundTrip'): ?>
              <div class="me-4 mb-2">
                <small class="text-muted d-block">Return</small>
                <span><?php echo date('M d, Y', strtotime($returnDate)); ?></span>
              </div>
              <?php endif; ?>
              <div class="me-4 mb-2">
                <small class="text-muted d-block">Passengers</small>
                <span><?php echo $passengers; ?> <?php echo $passengers > 1 ? 'Adults' : 'Adult'; ?></span>
              </div>
              <div class="mb-2">
                <small class="text-muted d-block">Class</small>
                <span><?php echo ucfirst($travelClass); ?></span>
              </div>
            </div>
          </div>
          <div class="col-md-4 text-md-end mt-3 mt-md-0">
            <a href="index.html#search-form" class="btn btn-outline-primary">Modify Search</a>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-lg-3">
          <div class="bg-white p-4 rounded shadow-sm">
            <h5 class="mb-3">Filters</h5>
            
            <div class="mb-4">
              <h6>Price Range</h6>
              <div class="range-slider">
                <input type="range" class="form-range" id="priceRange" min="0" max="1000" value="800">
                <div class="d-flex justify-content-between">
                  <span>$0</span>
                  <span id="priceRangeValue">$800</span>
                  <span>$1000</span>
                </div>
              </div>
            </div>
            
            <div class="mb-4">
              <h6>Stops</h6>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="nonstop" checked>
                <label class="form-check-label" for="nonstop">Non-stop</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="oneStop" checked>
                <label class="form-check-label" for="oneStop">1 Stop</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="twoStops" checked>
                <label class="form-check-label" for="twoStops">2+ Stops</label>
              </div>
            </div>
            
            <div class="mb-4">
              <h6>Airlines</h6>
              <?php foreach (array_unique(array_column($flights['outbound'], 'airline')) as $airline): ?>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="<?php echo str_replace(' ', '', $airline); ?>" checked>
                <label class="form-check-label" for="<?php echo str_replace(' ', '', $airline); ?>">
                  <?php echo htmlspecialchars($airline); ?>
                </label>
              </div>
              <?php endforeach; ?>
            </div>
            
            <div>
              <h6>Departure Time</h6>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="morning" checked>
                <label class="form-check-label" for="morning">Morning (6am - 12pm)</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="afternoon" checked>
                <label class="form-check-label" for="afternoon">Afternoon (12pm - 6pm)</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="evening" checked>
                <label class="form-check-label" for="evening">Evening (6pm - 6am)</label>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-9 mt-4 mt-lg-0">
          <!-- Sorting options -->
          <div class="d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm mb-4">
            <div>
              <span class="fw-bold"><?php echo count($flights['outbound']); ?> flights found</span>
            </div>
            <div class="d-flex align-items-center">
              <label for="sortOptions" class="me-2">Sort by:</label>
              <select class="form-select form-select-sm" id="sortOptions" style="width: auto">
                <option value="price">Price (Lowest first)</option>
                <option value="duration">Duration (Shortest first)</option>
                <option value="departure">Departure (Earliest first)</option>
                <option value="arrival">Arrival (Earliest first)</option>
              </select>
            </div>
          </div>
          
          <!-- Flight results -->
          <div class="flights-container">
            <h5 class="mb-3">Outbound Flights</h5>
            
            <?php foreach ($flights['outbound'] as $flight): ?>
            <div class="flight-card bg-white p-3 rounded shadow-sm mb-3">
              <div class="row align-items-center">
                <div class="col-md-3 mb-3 mb-md-0">
                  <div class="d-flex align-items-center">
                    <div class="airline-logo me-3 bg-light rounded p-2 text-center" style="width: 60px; height: 60px">
                      <i class="bi bi-airplane fs-3 text-primary"></i>
                    </div>
                    <div>
                      <h6 class="mb-0"><?php echo htmlspecialchars($flight['airline']); ?></h6>
                      <small class="text-muted"><?php echo htmlspecialchars($flight['flight_number']); ?></small>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-5 mb-3 mb-md-0">
                  <div class="flight-times d-flex justify-content-between align-items-center">
                    <div class="text-center">
                      <h5 class="mb-0"><?php echo date('H:i', strtotime($flight['depart_time'])); ?></h5>
                      <small class="text-muted"><?php echo htmlspecialchars($flight['from']); ?></small>
                    </div>
                    
                    <div class="flight-duration text-center flex-grow-1 px-2">
                      <div class="flight-line position-relative">
                        <span class="flight-stops position-absolute top-50 start-50 translate-middle bg-white px-2">
                          <?php echo formatDuration($flight['duration']); ?>
                        </span>
                      </div>
                      <small class="text-muted">
                        <?php if ($flight['stops'] === 0): ?>
                          Nonstop
                        <?php else: ?>
                          <?php echo $flight['stops']; ?> stop<?php echo $flight['stops'] > 1 ? 's' : ''; ?>
                        <?php endif; ?>
                      </small>
                    </div>
                    
                    <div class="text-center">
                      <h5 class="mb-0"><?php echo date('H:i', strtotime($flight['arrival_time'])); ?></h5>
                      <small class="text-muted"><?php echo htmlspecialchars($flight['to']); ?></small>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-2 mb-3 mb-md-0 text-center">
                  <h5 class="text-primary mb-0">$<?php echo $flight['price']; ?></h5>
                  <small class="text-muted"><?php echo $passengers > 1 ? "per person" : ""; ?></small>
                </div>
                
                <div class="col-md-2 text-center">
                  <a href="booking.php?flight=<?php echo $flight['flight_number']; ?>" class="btn btn-primary w-100">Select</a>
                </div>
              </div>
              
              <div class="row mt-3">
                <div class="col-12">
                  <button class="btn btn-link btn-sm p-0 text-decoration-none flight-details-btn" type="button" data-bs-toggle="collapse" data-bs-target="#details<?php echo $flight['flight_number']; ?>">
                    Flight details <i class="bi bi-chevron-down"></i>
                  </button>
                  
                  <div class="collapse mt-3" id="details<?php echo $flight['flight_number']; ?>">
                    <div class="card card-body">
                      <div class="row">
                        <div class="col-md-6">
                          <h6>Flight Details</h6>
                          <p class="mb-1"><strong>Flight:</strong> <?php echo $flight['flight_number']; ?></p>
                          <p class="mb-1"><strong>Aircraft:</strong> Boeing 737-800</p>
                          <p class="mb-1"><strong>Class:</strong> <?php echo ucfirst($travelClass); ?></p>
                          <p class="mb-1"><strong>Duration:</strong> <?php echo formatDuration($flight['duration']); ?></p>
                          <p class="mb-0"><strong>In-flight:</strong> Wi-Fi, Meals, Entertainment</p>
                        </div>
                        <div class="col-md-6">
                          <h6>Baggage Information</h6>
                          <p class="mb-1"><strong>Cabin:</strong> 1 personal item + 1 carry-on bag</p>
                          <p class="mb-0"><strong>Checked:</strong> 1 bag included (23kg)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <?php endforeach; ?>
            
            <?php if ($tripType === 'roundTrip' && !empty($flights['return'])): ?>
            <h5 class="mb-3 mt-5">Return Flights</h5>
            
            <?php foreach ($flights['return'] as $flight): ?>
            <div class="flight-card bg-white p-3 rounded shadow-sm mb-3">
              <div class="row align-items-center">
                <div class="col-md-3 mb-3 mb-md-0">
                  <div class="d-flex align-items-center">
                    <div class="airline-logo me-3 bg-light rounded p-2 text-center" style="width: 60px; height: 60px">
                      <i class="bi bi-airplane fs-3 text-primary"></i>
                    </div>
                    <div>
                      <h6 class="mb-0"><?php echo htmlspecialchars($flight['airline']); ?></h6>
                      <small class="text-muted"><?php echo htmlspecialchars($flight['flight_number']); ?></small>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-5 mb-3 mb-md-0">
                  <div class="flight-times d-flex justify-content-between align-items-center">
                    <div class="text-center">
                      <h5 class="mb-0"><?php echo date('H:i', strtotime($flight['depart_time'])); ?></h5>
                      <small class="text-muted"><?php echo htmlspecialchars($flight['from']); ?></small>
                    </div>
                    
                    <div class="flight-duration text-center flex-grow-1 px-2">
                      <div class="flight-line position-relative">
                        <span class="flight-stops position-absolute top-50 start-50 translate-middle bg-white px-2">
                          <?php echo formatDuration($flight['duration']); ?>
                        </span>
                      </div>
                      <small class="text-muted">
                        <?php if ($flight['stops'] === 0): ?>
                          Nonstop
                        <?php else: ?>
                          <?php echo $flight['stops']; ?> stop<?php echo $flight['stops'] > 1 ? 's' : ''; ?>
                        <?php endif; ?>
                      </small>
                    </div>
                    
                    <div class="text-center">
                      <h5 class="mb-0"><?php echo date('H:i', strtotime($flight['arrival_time'])); ?></h5>
                      <small class="text-muted"><?php echo htmlspecialchars($flight['to']); ?></small>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-2 mb-3 mb-md-0 text-center">
                  <h5 class="text-primary mb-0">$<?php echo $flight['price']; ?></h5>
                  <small class="text-muted"><?php echo $passengers > 1 ? "per person" : ""; ?></small>
                </div>
                
                <div class="col-md-2 text-center">
                  <a href="booking.php?flight=<?php echo $flight['flight_number']; ?>" class="btn btn-primary w-100">Select</a>
                </div>
              </div>
              
              <div class="row mt-3">
                <div class="col-12">
                  <button class="btn btn-link btn-sm p-0 text-decoration-none flight-details-btn" type="button" data-bs-toggle="collapse" data-bs-target="#details<?php echo $flight['flight_number']; ?>">
                    Flight details <i class="bi bi-chevron-down"></i>
                  </button>
                  
                  <div class="collapse mt-3" id="details<?php echo $flight['flight_number']; ?>">
                    <div class="card card-body">
                      <div class="row">
                        <div class="col-md-6">
                          <h6>Flight Details</h6>
                          <p class="mb-1"><strong>Flight:</strong> <?php echo $flight['flight_number']; ?></p>
                          <p class="mb-1"><strong>Aircraft:</strong> Boeing 737-800</p>
                          <p class="mb-1"><strong>Class:</strong> <?php echo ucfirst($travelClass); ?></p>
                          <p class="mb-1"><strong>Duration:</strong> <?php echo formatDuration($flight['duration']); ?></p>
                          <p class="mb-0"><strong>In-flight:</strong> Wi-Fi, Meals, Entertainment</p>
                        </div>
                        <div class="col-md-6">
                          <h6>Baggage Information</h6>
                          <p class="mb-1"><strong>Cabin:</strong> 1 personal item + 1 carry-on bag</p>
                          <p class="mb-0"><strong>Checked:</strong> 1 bag included (23kg)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-dark text-white py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4 mb-4 mb-lg-0">
          <h5 class="mb-4">SkyJourney</h5>
          <p>Your trusted partner for booking flights to destinations worldwide. Discover the world with us!</p>
          <div class="social-links mt-4">
            <a href="#" class="text-white me-3"><i class="bi bi-facebook fs-5"></i></a>
            <a href="#" class="text-white me-3"><i class="bi bi-twitter fs-5"></i></a>
            <a href="#" class="text-white me-3"><i class="bi bi-instagram fs-5"></i></a>
            <a href="#" class="text-white"><i class="bi bi-linkedin fs-5"></i></a>
          </div>
        </div>
        <div class="col-md-4 col-lg-2 mb-4 mb-md-0">
          <h6 class="text-uppercase mb-4">Company</h6>
          <ul class="list-unstyled mb-0">
            <li class="mb-2"><a href="#" class="text-white text-decoration-none">About Us</a></li>
            <li class="mb-2"><a href="#" class="text-white text-decoration-none">Careers</a></li>
            <li class="mb-2"><a href="#" class="text-white text-decoration-none">Blog</a></li>
            <li class="mb-2"><a href="#" class="text-white text-decoration-none">Press</a></li>
          </ul>
        </div>
        <div class="col-md-4 col-lg-2 mb-4 mb-md-0">
          <h6 class="text-uppercase mb-4">Support</h6>
          <ul class="list-unstyled mb-0">
            <li class="mb-2"><a href="#" class="text-white text-decoration-none">Help Center</a></li>
            <li class="mb-2"><a href="#" class="text-white text-decoration-none">Contact Us</a></li>
            <li class="mb-2"><a href="#" class="text-white text-decoration-none">Privacy Policy</a></li>
            <li class="mb-2"><a href="#" class="text-white text-decoration-none">Terms of Service</a></li>
          </ul>
        </div>
        <div class="col-md-4 col-lg-4">
          <h6 class="text-uppercase mb-4">Newsletter</h6>
          <p>Subscribe to our newsletter to get updates on our latest offers!</p>
          <div class="input-group mb-3">
            <input type="email" class="form-control" placeholder="Your Email" aria-label="Your Email" aria-describedby="subscribe-btn">
            <button class="btn btn-primary" type="button" id="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
      <hr class="my-4">
      <div class="row">
        <div class="col-md-6 text-center text-md-start">
          <p class="mb-0">&copy; 2023 SkyJourney. All rights reserved.</p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <p class="mb-0">
            <a href="#" class="text-white">Privacy Policy</a> | 
            <a href="#" class="text-white">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
  