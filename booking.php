<?php
session_start();

//  Check if flight number is provided
if (!isset($_GET['flight']) || empty($_GET['flight'])) {
    header("Location: index.html");
    exit;
}

$flightNumber = $_GET['flight'];

// In a real application, you would fetch flight details from the database
// For demo, we'll create a sample flight based on the flight number
$flight = [
    'flight_number' => $flightNumber,
    'airline' => strpos($flightNumber, 'SA') === 0 ? 'SkyAir' : 
                (strpos($flightNumber, 'GW') === 0 ? 'Global Wings' : 
                (strpos($flightNumber, 'BH') === 0 ? 'Blue Horizon' : 
                (strpos($flightNumber, 'ST') === 0 ? 'Star Airlines' : 'Royal Jets'))),
    'from' => isset($_SESSION['search_data']['fromLocation']) ? $_SESSION['search_data']['fromLocation'] : 'New York',
    'to' => isset($_SESSION['search_data']['toLocation']) ? $_SESSION['search_data']['toLocation'] : 'London',
    'depart_time' => date('Y-m-d H:i:s', strtotime('+3 days 10:00')),
    'arrival_time' => date('Y-m-d H:i:s', strtotime('+3 days 17:30')),
    'duration' => 450, // 7.5 hours in minutes
    'price' => rand(350, 750),
    'class' => isset($_SESSION['search_data']['travelClass']) ? ucfirst($_SESSION['search_data']['travelClass']) : 'Economy',
    'passengers' => isset($_SESSION['search_data']['passengers']) ? (int)$_SESSION['search_data']['passengers'] : 1
];

// Calculate total price
$flight['total_price'] = $flight['price'] * $flight['passengers'];

// Process booking form
$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate form data
    $firstName = $_POST['firstName'] ?? '';
    $lastName = $_POST['lastName'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $address = $_POST['address'] ?? '';
    $city = $_POST['city'] ?? '';
    $country = $_POST['country'] ?? '';
    $zipCode = $_POST['zipCode'] ?? '';
    $paymentMethod = $_POST['paymentMethod'] ?? '';
    $cardNumber = $_POST['cardNumber'] ?? '';
    $cardHolder = $_POST['cardHolder'] ?? '';
    $expiryDate = $_POST['expiryDate'] ?? '';
    $cvv = $_POST['cvv'] ?? '';
    
    if (empty($firstName)) {
        $errors[] = "First name is required.";
    }
    
    if (empty($lastName)) {
        $errors[] = "Last name is required.";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required.";
    }
    
    if (empty($phone)) {
        $errors[] = "Phone number is required.";
    }
    
    // Add more validation as needed
    
    // If no errors, process booking
    if (empty($errors)) {
        // In a real app, save booking to database
        // For demo, just set success flag
        $success = true;
        $bookingReference = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        $_SESSION['booking_reference'] = $bookingReference;
        
        // Redirect to confirmation page
        header("Location: confirmation.php?ref=$bookingReference");
        exit;
    }
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
  <meta name="description" content="Built with jdoodle.ai - Complete your flight booking with SkyJourney">
  <meta property="og:title" content="Flight Booking - SkyJourney">
  <meta property="og:description" content="Built with jdoodle.ai - Secure your flight reservation with SkyJourney's easy booking process">
  <meta property="og:image" content="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/7d53e3f3ja602j4070j925aj8c26cb20ea62/public">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="Flight Booking - SkyJourney">
  <meta property="twitter:description" content="Built with jdoodle.ai - Secure your flight reservation with SkyJourney's easy booking process">
  <meta property="twitter:image" content="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/7d53e3f3ja602j4070j925aj8c26cb20ea62/public">
  <title>Flight Booking - SkyJourney</title>
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

  <!-- Booking Section -->
  <section class="py-5 bg-light">
    <div class="container">
      <div class="booking-progress mb-5">
        <div class="row justify-content-center text-center">
          <div class="col-md-3 mb-3 mb-md-0">
            <div class="progress-step completed">
              <div class="progress-icon">
                <i class="bi bi-search"></i>
              </div>
              <div class="progress-text mt-2">Search</div>
            </div>
          </div>
          <div class="col-md-3 mb-3 mb-md-0">
            <div class="progress-step active">
              <div class="progress-icon">
                <i class="bi bi-credit-card"></i>
              </div>
              <div class="progress-text mt-2">Book & Pay</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="progress-step">
              <div class="progress-icon">
                <i class="bi bi-check-circle"></i>
              </div>
              <div class="progress-text mt-2">Confirmation</div>
            </div>
          </div>
        </div>
      </div>
      
      <?php if (!empty($errors)): ?>
      <div class="alert alert-danger mb-4">
        <ul class="mb-0">
          <?php foreach ($errors as $error): ?>
            <li><?php echo htmlspecialchars($error); ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <?php endif; ?>
      
      <div class="row">
        <!-- Booking Form -->
        <div class="col-lg-8">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h4 class="mb-0">Flight Details</h4>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4 mb-4 mb-md-0">
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
                
                <div class="col-md-6 mb-4 mb-md-0">
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
                      <small class="text-muted">Nonstop</small>
                    </div>
                    
                    <div class="text-center">
                      <h5 class="mb-0"><?php echo date('H:i', strtotime($flight['arrival_time'])); ?></h5>
                      <small class="text-muted"><?php echo htmlspecialchars($flight['to']); ?></small>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-2 text-md-end">
                  <h5 class="text-primary mb-0">$<?php echo $flight['price']; ?></h5>
                  <small class="text-muted">per person</small>
                </div>
              </div>
              
              <div class="row mt-3">
                <div class="col-md-6">
                  <p class="mb-1"><strong>Date:</strong> <?php echo date('M d, Y', strtotime($flight['depart_time'])); ?></p>
                  <p class="mb-1"><strong>Class:</strong> <?php echo $flight['class']; ?></p>
                </div>
                <div class="col-md-6">
                  <p class="mb-1"><strong>Passengers:</strong> <?php echo $flight['passengers']; ?> Adult(s)</p>
                  <p class="mb-1"><strong>Baggage:</strong> 1 checked bag included</p>
                </div>
              </div>
            </div>
          </div>
          
          <form id="booking-form" method="post" action="">
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-white py-3">
                <h4 class="mb-0">Passenger Information</h4>
              </div>
              <div class="card-body">
                <h5 class="mb-3">Primary Passenger</h5>
                
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="firstName" class="form-label">First Name *</label>
                    <input type="text" class="form-control" id="firstName" name="firstName" required>
                  </div>
                  <div class="col-md-6">
                    <label for="lastName" class="form-label">Last Name *</label>
                    <input type="text" class="form-control" id="lastName" name="lastName" required>
                  </div>
                  <div class="col-md-6">
                    <label for="email" class="form-label">Email *</label>
                    <input type="email" class="form-control" id="email" name="email" required>
                  </div>
                  <div class="col-md-6">
                    <label for="phone" class="form-label">Phone *</label>
                    <input type="tel" class="form-control" id="phone" name="phone" required>
                  </div>
                  <div class="col-12">
                    <label for="address" class="form-label">Address</label>
                    <input type="text" class="form-control" id="address" name="address">
                  </div>
                  <div class="col-md-6">
                    <label for="city" class="form-label">City</label>
                    <input type="text" class="form-control" id="city" name="city">
                  </div>
                  <div class="col-md-3">
                    <label for="country" class="form-label">Country</label>
                    <select class="form-select" id="country" name="country">
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="India">India</option>
                      <option value="Japan">Japan</option>
                      <option value="China">China</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Spain">Spain</option>
                      <option value="Italy">Italy</option>
                      <option value="Russia">Russia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label for="zipCode" class="form-label">Zip/Postal Code</label>
                    <input type="text" class="form-control" id="zipCode" name="zipCode">
                  </div>
                </div>
                
                <?php if ($flight['passengers'] > 1): ?>
                <hr class="my-4">
                <h5 class="mb-3">Additional Passengers</h5>
                
                <?php for ($i = 2; $i <= $flight['passengers']; $i++): ?>
                <div class="row g-3 mb-4">
                  <div class="col-12">
                    <h6>Passenger <?php echo $i; ?></h6>
                  </div>
                  <div class="col-md-6">
                    <label for="firstName<?php echo $i; ?>" class="form-label">First Name *</label>
                    <input type="text" class="form-control" id="firstName<?php echo $i; ?>" name="firstName<?php echo $i; ?>" required>
                  </div>
                  <div class="col-md-6">
                    <label for="lastName<?php echo $i; ?>" class="form-label">Last Name *</label>
                    <input type="text" class="form-control" id="lastName<?php echo $i; ?>" name="lastName<?php echo $i; ?>" required>
                  </div>
                </div>
                <?php endfor; ?>
                <?php endif; ?>
              </div>
            </div>
            
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-white py-3">
                <h4 class="mb-0">Payment Information</h4>
              </div>
              <div class="card-body">
                <div class="mb-4">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="paymentMethod" id="creditCard" value="creditCard" checked>
                    <label class="form-check-label" for="creditCard">Credit Card</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="paymentMethod" id="paypal" value="paypal">
                    <label class="form-check-label" for="paypal">PayPal</label>
                  </div>
                </div>
                
                <div id="creditCardForm">
                  <div class="row g-3">
                    <div class="col-12">
                      <label for="cardNumber" class="form-label">Card Number *</label>
                      <input type="text" class="form-control" id="cardNumber" name="cardNumber" placeholder="XXXX XXXX XXXX XXXX" required>
                    </div>
                    <div class="col-12">
                      <label for="cardHolder" class="form-label">Cardholder Name *</label>
                      <input type="text" class="form-control" id="cardHolder" name="cardHolder" required>
                    </div>
                    <div class="col-md-6">
                      <label for="expiryDate" class="form-label">Expiry Date *</label>
                      <input type="text" class="form-control" id="expiryDate" name="expiryDate" placeholder="MM/YY" required>
                    </div>
                    <div class="col-md-6">
                      <label for="cvv" class="form-label">CVV *</label>
                      <input type="text" class="form-control" id="cvv" name="cvv" placeholder="XXX" required>
                    </div>
                  </div>
                </div>
                
                <div id="paypalForm" class="d-none mt-3">
                  <p>You will be redirected to PayPal to complete your payment.</p>
                </div>
              </div>
            </div>
            
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-white py-3">
                <h4 class="mb-0">Additional Services</h4>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="travelInsurance">
                      <label class="form-check-label" for="travelInsurance">
                        Travel Insurance - $25 per passenger
                      </label>
                      <p class="text-muted small mt-1">Protection for trip cancellation, medical emergencies, and more.</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="priorityBoarding">
                      <label class="form-check-label" for="priorityBoarding">
                        Priority Boarding - $15 per passenger
                      </label>
                      <p class="text-muted small mt-1">Be among the first to board the aircraft.</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="extraLegroom">
                      <label class="form-check-label" for="extraLegroom">
                        Extra Legroom Seats - $30 per passenger
                      </label>
                      <p class="text-muted small mt-1">More comfortable seating with additional legroom.</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="airportPickup">
                      <label class="form-check-label" for="airportPickup">
                        Airport Pickup - $45
                      </label>
                      <p class="text-muted small mt-1">Convenient transportation from the airport to your hotel.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-white py-3">
                <h4 class="mb-0">Terms and Conditions</h4>
              </div>
              <div class="card-body">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="termsConditions" required>
                  <label class="form-check-label" for="termsConditions">
                    I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg">Complete Booking</button>
            </div>
          </form>
        </div>
        
        <!-- Booking Summary -->
        <div class="col-lg-4 mt-4 mt-lg-0">
          <div class="card shadow-sm booking-summary position-sticky" style="top: 20px;">
            <div class="card-header bg-white py-3">
              <h4 class="mb-0">Booking Summary</h4>
            </div>
            <div class="card-body">
              <div class="mb-4">
                <div class="d-flex justify-content-between mb-2">
                  <span><?php echo $flight['passengers']; ?> x Ticket(s)</span>
                  <span>$<?php echo $flight['price']; ?> x <?php echo $flight['passengers']; ?></span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Taxes & Fees</span>
                  <span>$<?php echo round($flight['total_price'] * 0.12); ?></span>
                </div>
                <div id="insuranceCost" class="d-flex justify-content-between mb-2 d-none">
                  <span>Travel Insurance</span>
                  <span>$<?php echo 25 * $flight['passengers']; ?></span>
                </div>
                <div id="priorityBoardingCost" class="d-flex justify-content-between mb-2 d-none">
                  <span>Priority Boarding</span>
                  <span>$<?php echo 15 * $flight['passengers']; ?></span>
                </div>
                <div id="extraLegroomCost" class="d-flex justify-content-between mb-2 d-none">
                  <span>Extra Legroom Seats</span>
                  <span>$<?php echo 30 * $flight['passengers']; ?></span>
                </div>
                <div id="airportPickupCost" class="d-flex justify-content-between mb-2 d-none">
                  <span>Airport Pickup</span>
                  <span>$45</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span id="totalPrice">$<?php echo $flight['total_price'] + round($flight['total_price'] * 0.12); ?></span>
                </div>
              </div>
              
              <div class="alert alert-primary mb-0">
                <h6><i class="bi bi-info-circle me-2"></i>Booking Information</h6>
                <ul class="mb-0 ps-3">
                  <li>Prices include all taxes and fees</li>
                  <li>Free cancellation up to 24 hours before departure</li>
                  <li>1 checked bag (23kg) included per passenger</li>
                  <li>Receive e-tickets via email after booking</li>
                </ul>
              </div>
            </div>
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
  