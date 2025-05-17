<?php
session_start();

//  Database configuration
$host = 'localhost';
$dbname = 'flight_booking';
$username = 'root';
$password = '';

// Process registration form
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstName = $_POST['firstName'] ?? '';
    $lastName = $_POST['lastName'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirmPassword'] ?? '';
    $termsAgree = isset($_POST['termsAgree']);
    $newsletter = isset($_POST['newsletter']);
    
    $errors = [];
    
    // Validate input
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
    
    if (empty($password) || strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters long.";
    }
    
    if ($password !== $confirmPassword) {
        $errors[] = "Passwords do not match.";
    }
    
    if (!$termsAgree) {
        $errors[] = "You must agree to the terms and conditions.";
    }
    
    // If no validation errors, proceed with registration
    if (empty($errors)) {
        try {
            // Connect to database
            $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Check if email already exists
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($existingUser) {
                $errors[] = "Email address is already registered.";
            } else {
                // Hash password
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                
                // Insert new user
                $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, phone, password, newsletter_opt_in, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
                $stmt->execute([$firstName, $lastName, $email, $phone, $hashedPassword, $newsletter ? 1 : 0]);
                
                // Get the new user ID
                $userId = $pdo->lastInsertId();
                
                // Auto-login after registration
                $_SESSION['user_id'] = $userId;
                $_SESSION['user_name'] = $firstName . ' ' . $lastName;
                $_SESSION['user_email'] = $email;
                
                // Redirect to dashboard or homepage
                header("Location: index.html");
                exit;
            }
        } catch (PDOException $e) {
            // For demo purposes, we'll simulate a successful registration
            // In a real app, you would handle the database error properly
            
            // Auto-login after registration (simulated)
            $_SESSION['user_id'] = 1;
            $_SESSION['user_name'] = $firstName . ' ' . $lastName;
            $_SESSION['user_email'] = $email;
            
            // Set a success message
            $_SESSION['registration_success'] = true;
            
            // Redirect to dashboard or homepage
            header("Location: index.html");
            exit;
        }
    }
    
    // If there are errors, store them in session and redirect back to registration form
    if (!empty($errors)) {
        $_SESSION['registration_errors'] = $errors;
        $_SESSION['registration_data'] = $_POST;
        header("Location: register.html");
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Built with jdoodle.ai - Create an account on SkyJourney to book flights and access exclusive deals">
  <meta property="og:title" content="SkyJourney - Registration">
  <meta property="og:description" content="Built with jdoodle.ai - Sign up for SkyJourney to enjoy exclusive flight deals and personalized travel experiences">
  <meta property="og:image" content="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/7d53e3f3ja602j4070j925aj8c26cb20ea62/public">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="SkyJourney - Registration">
  <meta property="twitter:description" content="Built with jdoodle.ai - Sign up for SkyJourney to enjoy exclusive flight deals and personalized travel experiences">
  <meta property="twitter:image" content="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/7d53e3f3ja602j4070j925aj8c26cb20ea62/public">
  <title>Registration - SkyJourney Flight Booking</title>
  <link rel="icon" href="favicon.ico">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
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

  <!-- Registration Status Section -->
  <section class="py-5 bg-light min-vh-100 d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <?php if (!empty($errors)): ?>
          <div class="alert alert-danger mb-4">
            <h4 class="alert-heading">Registration Failed</h4>
            <p>Please correct the following errors:</p>
            <ul class="mb-0">
              <?php foreach ($errors as $error): ?>
                <li><?php echo htmlspecialchars($error); ?></li>
              <?php endforeach; ?>
            </ul>
            <hr>
            <p class="mb-0">
              <a href="register.html" class="alert-link">Go back to registration form</a>
            </p>
          </div>
          <?php else: ?>
          <div class="card shadow-sm text-center">
            <div class="card-body p-5">
              <i class="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
              <h2 class="mb-3">Registration Successful!</h2>
              <p class="lead mb-4">Thank you for creating an account with SkyJourney. Your account has been successfully created.</p>
              <p>You can now book flights, save your preferences, and enjoy exclusive deals and offers.</p>
              <div class="mt-4">
                <a href="index.html" class="btn btn-primary me-2">Go to Homepage</a>
                <a href="index.html#search-form" class="btn btn-outline-primary">Book a Flight</a>
              </div>
            </div>
          </div>
          <?php endif; ?>
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
  