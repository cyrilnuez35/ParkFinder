<?php /* Map page served as PHP */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ParkingFinder - Davao City Interactive Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
    <link rel="stylesheet" href="map.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <i class="fas fa-parking"></i>
                    <span class="title">ParkingFinder</span>
                </div>
                <div class="nav-menu">
                    <a href="../index.php#home" class="nav-link"><span class="nav-text">Home</span></a>
                    <a href="../index.php#about" class="nav-link"><span class="nav-text">About</span></a>
                    <a href="../index.php#contact" class="nav-link"><span class="nav-text">Contact</span></a>
                    <a href="../admin.php" class="nav-link" id="adminLink" style="display: none;">Admin</a>
                    <!-- Auth buttons removed per request -->
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
                                <a href="#notifications" class="dropdown-item" onclick="openNotificationsModal(); return false;">
                                    <i class="fas fa-bell"></i>
                                    Notifications
                                </a>
                                <a href="#history" class="dropdown-item" onclick="openSearchHistoryModal(); return false;">
                                    <i class="fas fa-history"></i>
                                    History
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
                <div class="hamburger" id="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    </header>

    <!-- Main Content -->
    <main class="main-content" id="home">
        <!-- Floating Toggle Button (hidden by default) -->
        <button class="floating-toggle-btn" id="floatingToggleBtn" style="display: none;">
            <i class="fas fa-chevron-right"></i>
        </button>
        
        <!-- Search Panel -->
        <div class="search-panel" id="searchPanel">
            <div class="search-header">
                <h2>Find Parking</h2>
                <button class="btn-toggle-panel" id="togglePanel">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>
            <div class="search-form-container">
                <form class="search-form" id="searchForm">
                    <div class="search-input-group">
                        <i class="fas fa-map-marker-alt search-icon"></i>
                        <input type="text" id="locationInput" placeholder="Enter Davao City location or address" class="search-input" data-city="Davao City">
                        <button type="button" class="btn-current-location" id="currentLocationBtn" title="Use current location">
                            <i class="fas fa-crosshairs"></i>
                        </button>
                    </div>
                    <div class="search-filters"></div>
                    <button type="submit" class="btn-search">
                        <i class="fas fa-search"></i>
                        Search Parking
                    </button>
                </form>
                <div class="quick-search">
                    <h4>Available Parking Slot</h4>
                    <div class="quick-search-buttons">
                        <button class="quick-search-btn" onclick="quickSearch('Bankerohan')">Bankerohan</button>
                        <button class="quick-search-btn" onclick="quickSearch('Pitchon St.')">Pitchon St.</button>
                        <button class="quick-search-btn" onclick="quickSearch('Pelayo St.')">Pelayo St.</button>
                        <button class="quick-search-btn" onclick="quickSearch('Anda')">Anda</button>
                        <button class="quick-search-btn" onclick="quickSearch('C. M. Recto')">C. M. Recto</button>
                        <button class="quick-search-btn" onclick="quickSearch('Bolton St.')">Bolton St.</button>
                        <button class="quick-search-btn" onclick="quickSearch('San Pedro St.')">San Pedro St.</button>
                        <button class="quick-search-btn" onclick="quickSearch('Illustre St.')">Illustre St.</button>
                        <button class="quick-search-btn" onclick="quickSearch('Duterte St.')">Duterte St.</button>
                        <button class="quick-search-btn" onclick="quickSearch('Villa Abrille')">Villa Abrille</button>
                        <button class="quick-search-btn" onclick="quickSearch('Monteverde St.')">Monteverde St.</button>
                    </div>
                </div>
            </div>
            <div class="results-container" id="resultsContainer">
                <div class="results-list" id="resultsList"></div>
            </div>
        </div>
        <!-- Map Container -->
        <div class="map-container" id="mapContainer">
            <div class="map-controls">
                <button class="map-control-btn" id="centerMapBtn" title="Center on search area">
                    <i class="fas fa-crosshairs"></i>
                </button>
                <button class="map-control-btn" id="toggleTrafficBtn" title="Toggle traffic">
                    <i class="fas fa-car"></i>
                </button>
                <button class="map-control-btn" id="toggleSatelliteBtn" title="Toggle satellite view">
                    <i class="fas fa-satellite"></i>
                </button>
                <button class="map-control-btn" id="enableCompassBtn" title="Enable/Disable compass">
                    <i class="fas fa-compass"></i>
                </button>
                <button class="map-control-btn" id="clearRouteBtn" title="Clear route" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="map-loading" id="mapLoading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading map...</p>
            </div>

        </div>
    </main>

    <!-- Parking Details Modal -->
    <div class="modal-overlay" id="parkingModalOverlay">
        <div class="modal" id="parkingModal">
            <div class="modal-header">
                <h3 id="parkingModalTitle">Parking Details</h3>
                <button class="close-btn" id="closeParkingModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content" id="parkingModalContent"></div>
        </div>
    </div>

    <!-- Authentication Modals -->
    <div class="auth-modal-overlay" id="authModalOverlay">
        <div class="auth-modal" id="authModal">
            <div class="auth-modal-header">
                <h2 id="authModalTitle">Sign In</h2>
                <button class="close-btn" id="closeAuthModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
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
                <div class="auth-switch">
                    <p>Don't have an account? <a href="#" id="switchToSignup">Sign up</a></p>
                </div>
            </form>
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
                <div class="auth-switch">
                    <p>Already have an account? <a href="#" id="switchToLogin">Sign in</a></p>
                </div>
            </form>
        </div>
    </div>

    <!-- Settings Modal -->
    <div class="modal-overlay" id="settingsModalOverlay">
        <div class="modal" id="settingsModal">
            <div class="modal-header">
                <h3>Account Settings</h3>
                <button class="close-btn" id="closeSettingsModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                <div class="settings-modal">
                    <div class="settings-tabs">
                        <button class="tab-btn active" onclick="switchSettingsTab('password')">Change Password</button>
                        <button class="tab-btn" onclick="switchSettingsTab('delete')">Delete Account</button>
                    </div>
                    
                    <div id="passwordTab" class="settings-tab active">
                        <div class="settings-form">
                            <label>Current Password</label>
                            <input type="password" id="currentPassword" placeholder="Enter current password">
                            <label>New Password</label>
                            <input type="password" id="newPassword" placeholder="Enter new password">
                            <label>Confirm New Password</label>
                            <input type="password" id="confirmPassword" placeholder="Confirm new password">
                        </div>
                        <div class="modal-actions">
                            <button class="btn-secondary" onclick="closeSettingsModal()">Cancel</button>
                            <button class="btn-primary" onclick="changePassword()">Change Password</button>
                        </div>
                    </div>
                    
                    <div id="deleteTab" class="settings-tab">
                        <div class="delete-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h4>Delete Account</h4>
                            <p>This action cannot be undone. All your data will be permanently deleted.</p>
                        </div>
                        <div class="settings-form">
                            <label>Current Password</label>
                            <input type="password" id="deletePassword" placeholder="Enter current password to confirm">
                        </div>
                        <div class="modal-actions">
                            <button class="btn-secondary" onclick="closeSettingsModal()">Cancel</button>
                            <button class="btn-danger" onclick="deleteAccount()">Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
    <script src="map.js"></script>
</body>
</html>

