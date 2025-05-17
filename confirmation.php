<?php
session_start();

//  Check if booking reference is provided
if (!isset($_GET['ref']) || empty($_GET['ref'])) {
    header("Location: index.html");
    exit;
}

$bookingReference = $_GET['ref'];

// In a real application, you would fetch booking details from the database
// For demo, we'll create a sample booking
$booking = [
    'reference' => $bookingReference,
    'flight_number' => 'SA' . rand(100, 999),
    'airline' => 'SkyAir',
    'from' => 'New York',
    'to' => 'London',
    'depart_date' => date('Y-m-d', strtotime('+3 days')),
    'depart_time' => '10:00',
    'arrival_time' => '17:30',
    'passengers' => 1,
    'class' => 'Economy',
    'total_price' => 599.99,
    'status' => 'Confirmed'
];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Built with jdoodle.ai - Booking confirmation for your flight with SkyJourney">
  <meta property="og:title" content="Booking Confirmation - SkyJourney">
  <meta property="og:description" content="Built with jdoodle.ai - Your flight booking is confirmed. View your flight details">
  <meta property="og:image" content="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/7d53e3f3ja602j4070j925aj8c26cb20ea62/public">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="Booking Confirmation - SkyJourney">
  <meta property="twitter:description" content="Built with jdoodle.ai - Your flight booking is confirmed. View your flight details">
  <meta property="twitter:image" content="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/7d53e3f3ja602j4070j925aj8c26cb20ea62/public">
  <title>Booking Confirmation - SkyJourney</title>
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
            <a class="nav-link" href="index.html#flights">Flights</a>
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

  <!-- Confirmation Section -->
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
            <div class="progress-step completed">
              <div class="progress-icon">
                <i class="bi bi-credit-card"></i>
              </div>
              <div class="progress-text mt-2">Book & Pay</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="progress-step active">
              <div class="progress-icon">
                <i class="bi bi-check-circle"></i>
              </div>
              <div class="progress-text mt-2">Confirmation</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Success Message -->
          <div class="alert alert-success text-center p-4 mb-5">
            <i class="bi bi-check-circle-fill fs-1 mb-3"></i>
            <h3>Booking Confirmed!</h3>
            <p class="lead mb-0">Thank you for booking with SkyJourney. Your reservation has been confirmed.</p>
          </div>
          
          <!-- Booking Info -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h4 class="mb-0">Booking Information</h4>
              <div>
                <button class="btn btn-outline-primary me-2">
                  <i class="bi bi-printer me-2"></i>Print
                </button>
                <button class="btn btn-outline-primary">
                  <i class="bi bi-envelope me-2"></i>Email
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="row mb-4">
                <div class="col-md-6">
                  <p class="mb-1"><strong>Booking Reference:</strong> <?php echo $booking['reference']; ?></p>
                  <p class="mb-1"><strong>Booking Status:</strong> <span class="badge bg-success"><?php echo $booking['status']; ?></span></p>
                  <p class="mb-1"><strong>Payment:</strong> Completed</p>
                </div>
                <div class="col-md-6 text-md-end">
                  <p class="mb-1"><strong>Booking Date:</strong> <?php echo date('M d, Y'); ?></p>
                  <p class="mb-1"><strong>Total Amount:</strong> $<?php echo number_format($booking['total_price'], 2); ?></p>
                </div>
              </div>
              
              <div class="flight-details mb-4">
                <h5 class="mb-3">Flight Details</h5>
                <div class="card p-3 border">
                  <div class="row">
                    <div class="col-md-4 mb-3 mb-md-0">
                      <div class="d-flex align-items-center">
                        <div class="airline-logo me-3 bg-light rounded p-2 text-center" style="width: 60px; height: 60px">
                          <i class="bi bi-airplane fs-3 text-primary"></i>
                        </div>
                        <div>
                          <h6 class="mb-0"><?php echo $booking['airline']; ?></h6>
                          <small class="text-muted"><?php echo $booking['flight_number']; ?></small>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-8">
                      <div class="row">
                        <div class="col-md-6 mb-3 mb-md-0">
                          <div class="d-flex justify-content-between align-items-center">
                            <div>
                              <p class="mb-1 fw-bold"><?php echo $booking['from']; ?></p>
                              <p class="mb-0"><?php echo date('M d, Y', strtotime($booking['depart_date'])); ?> - <?php echo $booking['depart_time']; ?></p>
                            </div>
                            <div class="d-none d-md-block">
                              <i class="bi bi-arrow-right fs-4"></i>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <p class="mb-1 fw-bold"><?php echo $booking['to']; ?></p>
                          <p class="mb-0"><?php echo date('M d, Y', strtotime($booking['depart_date'])); ?> - <?php echo $booking['arrival_time']; ?></p>
                        </div>
                      </div>
                      <div class="row mt-3">
                        <div class="col-md-6">
                          <p class="mb-0"><small class="text-muted">Class: <?php echo $booking['class']; ?></small></p>
                        </div>
                        <div class="col-md-6">
                          <p class="mb-0"><small class="text-muted">Passengers: <?php echo $booking['passengers']; ?></small></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="next-steps mb-4">
                <h5 class="mb-3">Next Steps</h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="card h-100 p-3 border">
                      <div class="d-flex align-items-center mb-3">
                        <i class="bi bi-clock fs-4 text-primary me-3"></i>
                        <h6 class="mb-0">Check-In Information</h6>
                      </div>
                      <p class="mb-0">Online check-in will be available 24 hours before your flight departure. You will receive a check-in reminder via email.</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card h-100 p-3 border">
                      <div class="d-flex align-items-center mb-3">
                        <i class="bi bi-suitcase fs-4 text-primary me-3"></i>
                        <h6 class="mb-0">Baggage Policy</h6>
                      </div>
                      <p class="mb-0">Your ticket includes 1 checked bag (up to 23kg) and 1 carry-on bag (up to 7kg). Additional baggage can be purchased online before your flight.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="travel-info">
                <h5 class="mb-3">Important Travel Information</h5>
                <div class="alert alert-info mb-0">
                  <ul class="mb-0">
                    <li>Please arrive at the airport at least 2 hours before your scheduled departure time.</li>
                    <li>Don't forget to bring a valid government-issued photo ID or passport for identification.</li>
                    <li>Check local COVID-19 guidelines and requirements before your travel date.</li>
                    <li>If you need to modify your booking, please contact our customer service at least 24 hours before departure.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Additional Services -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h4 class="mb-0">Additional Services</h4>
            </div>
            <div class="card-body">
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="text-center p-3">
                    <i class="bi bi-car-front fs-1 text-primary mb-3"></i>
                    <h5>Car Rental</h5>
                    <p>Rent a car at your destination for convenience during your trip.</p>
                    <a href="#" class="btn btn-outline-primary">Book Now</a>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center p-3">
                    <i class="bi bi-building fs-1 text-primary mb-3"></i>
                    <h5>Hotel Booking</h5>
                    <p>Find and book hotels at your destination with special discounts.</p>
                    <a href="#" class="btn btn-outline-primary">Book Now</a>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center p-3">
                    <i class="bi bi-pin-map fs-1 text-primary mb-3"></i>
                    <h5>Airport Transfer</h5>
                    <p>Book a comfortable transfer service to and from the airport.</p>
                    <a href="#" class="btn btn-outline-primary">Book Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-center mb-4">
            <a href="index.html" class="btn btn-primary">Return to Home</a>
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
  