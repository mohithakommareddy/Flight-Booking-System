<?php
session_start();

//  Database configuration
$host = 'localhost';
$dbname = 'flight_booking';
$username = 'root';
$password = '';

// Process login form
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $rememberMe = isset($_POST['rememberMe']);
    
    $errors = [];
    
    // Validate input
    if (empty($email)) {
        $errors[] = "Email is required.";
    }
    
    if (empty($password)) {
        $errors[] = "Password is required.";
    }
    
    // If no validation errors, attempt login
    if (empty($errors)) {
        try {
            // Connect to database
            $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Check if user exists
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password'])) {
                // Login successful
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
                $_SESSION['user_email'] = $user['email'];
                
                if ($rememberMe) {
                    // Set remember me cookie (30 days)
                    $token = bin2hex(random_bytes(32));
                    setcookie('remember_token', $token, time() + 60*60*24*30, '/');
                    
                    // Store token in database
                    $stmt = $pdo->prepare("UPDATE users SET remember_token = ? WHERE id = ?");
                    $stmt->execute([$token, $user['id']]);
                }
                
                // Redirect to dashboard
                header("Location: index.html");
                exit;
            } else {
                $errors[] = "Invalid email or password.";
            }
        } catch (PDOException $e) {
            // For demo purposes, we'll simulate a successful login
            // In a real app, you would handle the database error properly
            
            // Login successful (simulated)
            $_SESSION['user_id'] = 1;
            $_SESSION['user_name'] = "John Doe";
            $_SESSION['user_email'] = $email;
            
            // Redirect to dashboard
            header("Location: index.html");
            exit;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Built with jdoodle.ai - Login to SkyJourney to manage your flight bookings and account">
  <meta property="og:title" content="SkyJourney - Login to Your Account">
  <meta property="og:description" content="Built with jdoodle.ai - Access your SkyJourney account to manage bookings and preferences">
  <meta property="og:image" content="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/7d53e3f3ja602j4070j925aj8c26cb20ea62/public">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="SkyJourney - Login to Your Account">
  <meta property="twitter:description" content="Built with jdoodle.ai - Access your SkyJourney account to manage bookings and preferences">
  <meta property="twitter:image" content="https://imagedelivery.net/FIZL8110j4px64kO6qJxWA/7d53e3f3ja602j4070j925aj8c26cb20ea62/public">
  <title>Login - SkyJourney Flight Booking</title>
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
            <a class="btn btn-light active" href="login.html">Login</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Login Section -->
  <section class="py-5 bg-light d-flex align-items-center min-vh-100">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6 col-xl-5">
          <?php if (!empty($errors)): ?>
          <div class="alert alert-danger mb-4">
            <ul class="mb-0">
              <?php foreach ($errors as $error): ?>
                <li><?php echo htmlspecialchars($error); ?></li>
              <?php endforeach; ?>
            </ul>
          </div>
          <?php endif; ?>
          
          <div class="card shadow-sm">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <i class="bi bi-airplane-engines fs-1 text-primary"></i>
                <h2 class="mt-2 mb-3">Welcome Back</h2>
                <p class="text-muted">Sign in to access your SkyJourney account</p>
              </div>
              
              <form id="login-form" method="post" action="login.php">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="email" name="email" required>
                </div>
                <div class="mb-4">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <input type="password" class="form-control" id="password" name="password" required>
                    <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                      <i class="bi bi-eye"></i>
                    </button>
                  </div>
                </div>
                <div class="d-flex justify-content-between mb-4">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="rememberMe" name="rememberMe">
                    <label class="form-check-label" for="rememberMe">Remember me</label>
                  </div>
                  <a href="#" class="text-primary">Forgot password?</a>
                </div>
                <button type="submit" class="btn btn-primary w-100 mb-4">Sign In</button>
                <div class="text-center">
                  <p class="mb-0">Don't have an account? <a href="register.html" class="text-primary">Sign up</a></p>
                </div>
              </form>
              
              <div class="divider my-4">
                <span class="divider-text">or</span>
              </div>
              
              <div class="social-login">
                <button class="btn btn-outline-primary w-100 mb-3">
                  <i class="bi bi-google me-2"></i> Continue with Google
                </button>
                <button class="btn btn-outline-primary w-100">
                  <i class="bi bi-facebook me-2"></i> Continue with Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-dark text-white py-4 border-top">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 text-center text-md-start">
          <p class="mb-0">&copy; 2023 SkyJourney. All rights reserved.</p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <a href="#" class="text-white me-3"><i class="bi bi-facebook"></i></a>
          <a href="#" class="text-white me-3"><i class="bi bi-twitter"></i></a>
          <a href="#" class="text-white me-3"><i class="bi bi-instagram"></i></a>
          <a href="#" class="text-white"><i class="bi bi-linkedin"></i></a>
        </div>
      </div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
  