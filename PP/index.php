<?php /* Main landing page served as PHP for XAMPP */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parking Finder - Davao City</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>body { background: #D1D3D4; }</style>
</head>
<body>
    <!-- Mobile Auth Top Bar -->
    <div class="mobile-auth-bar">
        <div class="mobile-brand">
            <i class="fas fa-parking"></i>
            <span>ParkingFinder</span>
        </div>
        <div id="mobileAuthButtons" class="mobile-auth-buttons">
            <a class="btn-secondary" href="signin.php">Sign In</a>
            <a class="btn-primary" href="signup.php">Sign Up</a>
        </div>
        <a id="mobileAdminLink" class="btn-secondary" href="admin.php" style="display:none;">Admin</a>
        <div id="mobileUserMenu" class="mobile-user-menu" style="display:none;">
            <div class="user-dropdown">
                <button class="user-profile-btn" id="mobileUserProfileBtn">
                    <i class="fas fa-user-circle"></i>
                    <span id="mobileUserName">Profile</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu" id="mobileDropdownMenu">
                    <a href="#profile" class="dropdown-item" onclick="openProfileModal(); return false;">
                        <i class="fas fa-user"></i>
                        Profile
                    </a>
                    <a href="#notifications" class="dropdown-item" onclick="openNotificationsModal(); return false;">
                        <i class="fas fa-bell"></i>
                        Notifications
                    </a>
                    <a href="#settings" class="dropdown-item" onclick="openSettingsModal(); return false;">
                        <i class="fas fa-cog"></i>
                        Settings
                    </a>
                    <hr class="dropdown-divider">
                    <a href="#logout" class="dropdown-item" onclick="logout(); return false;">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </a>
                </div>
            </div>
        </div>
    </div>
    <?php /* Content copied from index.html */ ?>
    <!-- Header -->
    <header class="header">
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <i class="fas fa-parking"></i>
                    <span>ParkingFinder</span>
                </div>
                <div class="nav-menu">
                    <a href="#home" class="nav-link"><i class="fas fa-home"></i><span class="nav-text">Home</span></a>
                    <a href="#about" class="nav-link"><i class="fas fa-info-circle"></i><span class="nav-text">About</span></a>
                    <a href="#contact" class="nav-link"><i class="fas fa-envelope"></i><span class="nav-text">Contact</span></a>
                    <a href="pp-test/map.php" class="nav-link" id="mapLink" style="display: none;"><i class="fas fa-map"></i><span class="nav-text">Map</span></a>
                    <a href="admin.php" class="nav-link" id="adminLink" style="display: none;">Admin</a>
                    <div class="auth-buttons" id="authButtons">
                        <a class="btn-secondary" href="signin.php">Sign In</a>
                        <a class="btn-primary" href="signup.php">Sign Up</a>
                    </div>
                    <div class="user-menu" id="userMenu" style="display: none;">
                        <div class="user-dropdown">
                            <button class="user-profile-btn" id="userProfileBtn">
                                <i class="fas fa-user-circle"></i>
                                <span id="userName">John Doe</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdownMenu">
                                <a href="#profile" class="dropdown-item" onclick="openProfileModal(); return false;">
                                    <i class="fas fa-user"></i>
                                    Profile
                                </a>
                                <a href="#notifications" class="dropdown-item" onclick="openNotificationsModal(); return false;" style="position: relative;">
                                    <i class="fas fa-bell"></i>
                                    Notifications
                                    <span id="notifDot" style="display:none; width:8px; height:8px; background:#ef4444; border-radius:50%; position:absolute; right:12px; top:10px;"></span>
                                </a>
                                <a href="#settings" class="dropdown-item" onclick="openSettingsModal(); return false;">
                                    <i class="fas fa-cog"></i>
                                    Settings
                                </a>
                                <hr class="dropdown-divider">
                                <a href="#logout" class="dropdown-item" id="logoutBtn">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-bg">
            <div class="hero-slide slide1"></div>
            <div class="hero-slide slide2"></div>
            <div class="hero-slide slide3"></div>
        </div>
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">Find Parking in Davao City</h1>
                <p class="hero-subtitle">Discover public parking spaces across Davao City in real time</p>
                
                <!-- Hero CTAs: Create Account + Explore Map -->
                <div class="hero-actions">
                    <a class="btn-search" href="signup.php">
                        <i class="fas fa-user"></i>
                        Create Account
                    </a>
                    <a class="btn-secondary" href="pp-test/map.php">
                        <i class="fas fa-map"></i>
                        Explore Map
                    </a>
                </div>
                
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="about">
        <div class="container">
            <h2 class="section-title">Why Choose ParkingFinder?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3>Real-Time Availability</h3>
                    <p>Get up-to-date information about parking spot availability in real-time</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-peso-sign"></i>
                    </div>
                    <h3>Best Prices</h3>
                    <p>Compare prices across different parking options to find the best deals</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-map-marked-alt"></i>
                    </div>
                    <h3>Easy Navigation</h3>
                    <p>Get turn-by-turn directions to your selected parking spot</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="features" id="contact">
        <div class="container">
            <h2 class="section-title">Contact Us</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <h3>Email</h3>
                    <p>info@parkingfinder.tech</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <h3>Address</h3>
                    <p>123 Main St, Davao City</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Results Section -->
    <section class="results" id="resultsSection" style="display: none;">
        <div class="container">
            <div class="results-header">
                <h2>Available Parking Spots</h2>
                <div class="results-controls">
                    <button class="btn-filter" id="sortByPrice">Sort by Price</button>
                    <button class="btn-filter" id="sortByDistance">Sort by Distance</button>
                    <button class="btn-filter" id="viewToggle">
                        <i class="fas fa-th"></i>
                        <span>Grid View</span>
                    </button>
                </div>
            </div>
            <div class="results-content">
                <div class="results-list" id="resultsList"></div>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
        <div class="container">
            <h2 class="section-title">How It Works</h2>
            <div class="steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>Search</h3>
                        <p>Enter your destination and parking preferences</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>Compare</h3>
                        <p>View available options with prices and distances</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>Park</h3>
                        <p>Head to your chosen public parking and park safely</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <i class="fas fa-parking"></i>
                        <span>ParkingFinder</span>
                    </div>
                    <p>Making parking simple and accessible for everyone.</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-linkedin"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="#help">Help</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact Info</h4>
                    <ul>
                        <li><i class="fas fa-phone"></i> +1 (555) 123-4567</li>
                        <li><i class="fas fa-envelope"></i> info@parkingfinder.tech</li>
                        <li><i class="fas fa-map-marker-alt"></i> 123 Main St, City, State</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ParkingFinder. All rights reserved.</p>
                <div class="footer-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Authentication Modals -->
    <div class="auth-modal-overlay" id="authModalOverlay">
        <div class="auth-modal mode-login" id="authModal">
            <div class="auth-modal-header">
                <h2 id="authModalTitle">Sign In</h2>
                <button class="close-btn" id="closeAuthModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="auth-panel auth-brand">
                <h2 id="authBrandTitle">Hello, Friend!</h2>
                <p id="authBrandText">Enter your personal details and start journey with us</p>
                <a href="#" class="auth-cta" id="switchToSignupAlt">Sign Up</a>
            </div>
            <div class="auth-panel">
            
            <!-- Login Form -->
            <form class="auth-form" id="loginForm">
                <div class="form-group">
                    <label for="loginEmail">Email Address</label>
                    <div class="input-group">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="loginEmail" name="email" placeholder="Enter your email" required>
                    </div>
                    <div class="error-message" id="loginEmailError"></div>
                </div>
                
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="loginPassword" name="password" placeholder="Enter your password" required>
                        <button type="button" class="password-toggle" id="loginPasswordToggle">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="error-message" id="loginPasswordError"></div>
                </div>
                
                <div class="form-options">
                    <label class="checkbox-label">
                        <input type="checkbox" id="rememberMe">
                        <span class="checkmark"></span>
                        Remember me
                    </label>
                    <a href="#forgot-password" class="forgot-password">Forgot Password?</a>
                </div>
                
                <button type="submit" class="btn-auth-submit" id="loginSubmitBtn">
                    <span class="btn-text">Sign In</span>
                    <div class="btn-loading" style="display: none;">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                </button>
                
                <div class="auth-divider">
                    <span>or</span>
                </div>
                
                <div class="social-auth">
                    <button type="button" class="btn-social btn-google">
                        <i class="fab fa-google"></i>
                        Continue with Google
                    </button>
                    <button type="button" class="btn-social btn-facebook">
                        <i class="fab fa-facebook-f"></i>
                        Continue with Facebook
                    </button>
                </div>
                
                <div class="auth-switch">
                    <p>Don't have an account? <a href="#" id="switchToSignup">Sign up</a></p>
                </div>
            </form>
            
            <!-- Signup Form -->
            <form class="auth-form" id="signupForm" style="display: none;">
                <div class="form-group">
                    <label for="signupFirstName">First Name</label>
                    <div class="input-group">
                        <i class="fas fa-user"></i>
                        <input type="text" id="signupFirstName" name="firstName" placeholder="Enter your first name" required>
                    </div>
                    <div class="error-message" id="signupFirstNameError"></div>
                </div>
                
                <div class="form-group">
                    <label for="signupLastName">Last Name</label>
                    <div class="input-group">
                        <i class="fas fa-user"></i>
                        <input type="text" id="signupLastName" name="lastName" placeholder="Enter your last name" required>
                    </div>
                    <div class="error-message" id="signupLastNameError"></div>
                </div>
                
                <div class="form-group">
                    <label for="signupEmail">Email Address</label>
                    <div class="input-group">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="signupEmail" name="email" placeholder="Enter your email" required>
                    </div>
                    <div class="error-message" id="signupEmailError"></div>
                </div>
                
                <div class="form-group">
                    <label for="signupPhone">Phone Number</label>
                    <div class="input-group">
                        <i class="fas fa-phone"></i>
                        <input type="tel" id="signupPhone" name="phone" placeholder="Enter your phone number" required>
                    </div>
                    <div class="error-message" id="signupPhoneError"></div>
                </div>
                
                <div class="form-group">
                    <label for="signupPassword">Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="signupPassword" name="password" placeholder="Create a password" required>
                        <button type="button" class="password-toggle" id="signupPasswordToggle">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="error-message" id="signupPasswordError"></div>
                </div>
                
                <div class="form-group">
                    <label for="signupConfirmPassword">Confirm Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="signupConfirmPassword" name="confirmPassword" placeholder="Confirm your password" required>
                        <button type="button" class="password-toggle" id="signupConfirmPasswordToggle">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="error-message" id="signupConfirmPasswordError"></div>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="agreeTerms" required>
                        <span class="checkmark"></span>
                        I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                    </label>
                    <div class="error-message" id="agreeTermsError"></div>
                </div>
                
                <button type="submit" class="btn-auth-submit" id="signupSubmitBtn">
                    <span class="btn-text">Create Account</span>
                    <div class="btn-loading" style="display: none;">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                </button>
                
                <div class="auth-divider">
                    <span>or</span>
                </div>
                
                <div class="social-auth">
                    <button type="button" class="btn-social btn-google">
                        <i class="fab fa-google"></i>
                        Continue with Google
                    </button>
                    <button type="button" class="btn-social btn-facebook">
                        <i class="fab fa-facebook-f"></i>
                        Continue with Facebook
                    </button>
                </div>
                
                <div class="auth-switch">
                    <p>Already have an account? <a href="#" id="switchToLogin">Sign in</a></p>
                </div>
            </form>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>

