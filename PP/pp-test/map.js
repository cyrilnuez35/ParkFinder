// Global variables
let map;
let parkingMarkers = [];
let currentResults = [];
let userLocation = null;
let userMarker = null;
let selectedParking = null;
let isAuthenticated = false;
let currentUser = null;
let userHeading = null;
let headingMarker = null;
let compassEnabled = false;
let locationWatchId = null;

// Real parking data with accurate coordinates (Davao City area)
let parkingData = [
    {
        id: 1,
        name: "Bankerohan Street Parking",
        type: "street",
        address: "Bankerohan Public Market, Davao City",
        coordinates: [7.067632, 125.603453], // Updated Bankerohan coordinates
        price: 15.00,
        duration: "2 hours",
        availability: "8 spots available",
        rating: 4.0,
        features: ["Metered", "Market Area", "Public Transport"],
        capacity: 25,
        occupied: 17
    },
    {
        id: 2,
        name: "Pitchon Street Parking",
        type: "street",
        address: "Pitchon Street, Davao City",
        coordinates: [7.064610, 125.606807], // Updated Pitchon Street coordinates
        price: 12.00,
        duration: "1 hour",
        availability: "5 spots available",
        rating: 3.8,
        features: ["Metered", "Residential Area"],
        capacity: 15,
        occupied: 10
    },
    {
        id: 3,
        name: "Pelayo Street Parking",
        type: "street",
        address: "Pelayo Street, Davao City",
        coordinates: [7.066761, 125.605295], // Updated Pelayo Street coordinates
        price: 18.00,
        duration: "3 hours",
        availability: "12 spots available",
        rating: 4.1,
        features: ["Metered", "Commercial Area", "Near City Center"],
        capacity: 30,
        occupied: 18
    },
    {
        id: 4,
        name: "Anda Street Parking",
        type: "street",
        address: "Anda Street, Davao City",
        coordinates: [7.065656, 125.606542], // Updated Anda Street coordinates
        price: 16.00,
        duration: "2 hours",
        availability: "6 spots available",
        rating: 3.9,
        features: ["Metered", "Downtown Area"],
        capacity: 20,
        occupied: 14
    },
    {
        id: 5,
        name: "C. M. Recto Street Parking",
        type: "street",
        address: "C. M. Recto Street, Davao City",
        coordinates: [7.070846, 125.611728], // Updated C. M. Recto Street coordinates
        price: 20.00,
        duration: "4 hours",
        availability: "15 spots available",
        rating: 4.2,
        features: ["Metered", "Main Street", "Business District"],
        capacity: 35,
        occupied: 20
    },
    {
        id: 6,
        name: "Bolton Street Parking",
        type: "street",
        address: "Bolton Street, Davao City",
        coordinates: [7.066880, 125.609680], // Updated Bolton Street coordinates
        price: 14.00,
        duration: "2 hours",
        availability: "4 spots available",
        rating: 3.7,
        features: ["Metered", "Residential Area"],
        capacity: 12,
        occupied: 8
    },
    {
        id: 7,
        name: "San Pedro Street Parking",
        type: "street",
        address: "San Pedro Street, Davao City",
        coordinates: [7.065595, 125.607725], // Updated San Pedro Street coordinates
        price: 22.00,
        duration: "3 hours",
        availability: "10 spots available",
        rating: 4.3,
        features: ["Metered", "Historic Area", "Tourist Spot"],
        capacity: 25,
        occupied: 15
    },
    {
        id: 8,
        name: "Illustre Street Parking",
        type: "street",
        address: "Illustre Street, Davao City",
        coordinates: [7.068760, 125.605007], // Updated Illustre Street coordinates
        price: 17.00,
        duration: "2 hours",
        availability: "7 spots available",
        rating: 4.0,
        features: ["Metered", "Commercial Area"],
        capacity: 18,
        occupied: 11
    },
    {
        id: 9,
        name: "Duterte Street Parking",
        type: "street",
        address: "Duterte Street, Davao City",
        coordinates: [7.068793, 125.605838], // Updated Duterte Street coordinates
        price: 19.00,
        duration: "3 hours",
        availability: "9 spots available",
        rating: 4.1,
        features: ["Metered", "Government Area", "Near City Hall"],
        capacity: 22,
        occupied: 13
    },
    {
        id: 10,
        name: "Villa Abrille Street Parking",
        type: "street",
        address: "Villa Abrille Street, Davao City",
        coordinates: [7.074843, 125.613956], // Updated Villa Abrille Street coordinates
        price: 21.00,
        duration: "4 hours",
        availability: "11 spots available",
        rating: 4.2,
        features: ["Metered", "Upscale Area", "Near Hotels"],
        capacity: 28,
        occupied: 17
    },
    {
        id: 11,
        name: "Monteverde Street Parking",
        type: "street",
        address: "Monteverde Street, Davao City",
        coordinates: [7.075311, 125.616710], // Updated Monteverde Street coordinates
        price: 13.00,
        duration: "1 hour",
        availability: "3 spots available",
        rating: 3.6,
        features: ["Metered", "Residential Area"],
        capacity: 10,
        occupied: 7
    },
    {
        id: 12,
        name: "Calinan Public Market Parking",
        type: "lot",
        address: "Calinan Public Market, Davao City",
        coordinates: [7.0269, 125.4092], // Accurate Calinan coordinates
        price: 10.00,
        duration: "2 hours",
        availability: "20 spots available",
        rating: 4.0,
        features: ["Open Lot", "Market Area", "Public Transport"],
        capacity: 40,
        occupied: 20
    },
    {
        id: 13,
        name: "Calinan Town Center Parking",
        type: "street",
        address: "Calinan Town Center, Davao City",
        coordinates: [7.0300, 125.4100], // Accurate Calinan Town Center coordinates
        price: 12.00,
        duration: "3 hours",
        availability: "15 spots available",
        rating: 4.1,
        features: ["Metered", "Town Center", "Government Services"],
        capacity: 30,
        occupied: 15
    },
    {
        id: 14,
        name: "Calinan Terminal Parking",
        type: "lot",
        address: "Calinan Terminal, Davao City",
        coordinates: [7.0250, 125.4080], // Accurate Calinan Terminal coordinates
        price: 8.00,
        duration: "1 hour",
        availability: "25 spots available",
        rating: 3.9,
        features: ["Open Lot", "Terminal Area", "Public Transport"],
        capacity: 50,
        occupied: 25
    },
    {
        id: 15,
        name: "New Parking Location",
        type: "street",
        address: "New Location, Davao City",
        coordinates: [7.063890, 125.570841],
        price: 15.00,
        duration: "2 hours",
        availability: "8 spots available",
        rating: 4.0,
        features: ["Metered", "Street Parking", "Nearby Amenities"],
        capacity: 20,
        occupied: 12
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeEventListeners();
    checkAuthState();
    // Prefer dynamic slots from API; fall back to embedded sample data
    if (typeof loadParkingDataFromApi === 'function') {
        loadParkingDataFromApi();
    } else {
        loadParkingData();
    }
    initializeMobileFeatures();
    setupSmoothScroll();

    // Poll server announcements periodically and show new ones
    startAnnouncementsPolling();

    // If redirected with a search query from main page, auto-run search
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        const decoded = decodeURIComponent(q);
        // Sanitize redundant Davao context from the incoming query
        const sanitized = decoded.replace(/\b(davao\s*city|davao)\b/gi, '').replace(/\s{2,}/g, ' ').trim();
        const input = document.getElementById('locationInput');
        if (input) {
            input.value = sanitized || decoded; // keep something visible if fully stripped
        }
        const form = document.getElementById('searchForm');
        if (form) {
            const norm = decoded.trim().toLowerCase();
            const isCityQuery = norm === 'davao' || norm === 'davao city';
            // Auto-run search for city queries OR when we have a meaningful term
            if (isCityQuery || sanitized) {
                handleSearch(new Event('submit'));
            }
        }
    }
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    // Make all X icons functional across overlays
    setupGlobalCloseButtons();
    
    // Add window resize listener to fix map resizing
    window.addEventListener('resize', function() {
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
            }
        }, 100);
    });

    // Listen for admin updates from other tabs/windows and refresh slots
    window.addEventListener('storage', function(e) {
        if (e.key === 'pf_slots_updated') {
            if (typeof loadParkingDataFromApi === 'function') {
                loadParkingDataFromApi();
            }
        }
        if (e.key === 'pf_slots_event' && e.newValue) {
            try {
                const evt = JSON.parse(e.newValue);
                if (evt && evt.type === 'add') {
                    const name = evt.name ? `: ${evt.name}` : '';
                    showNotification(`New parking slot added${name}`, 'success');
                    if (typeof loadParkingDataFromApi === 'function') {
                        loadParkingDataFromApi();
                    }
                }
            } catch (_) {}
        }
        if (e.key === 'pf_custom_notice' && e.newValue) {
            try {
                const notice = JSON.parse(e.newValue);
                if (notice && notice.type === 'notice') {
                    const type = notice.severity === 'closure' ? 'error' : (notice.severity === 'warning' ? 'warning' : 'info');
                    showNotification(`${notice.title}: ${notice.message}`, type);
                }
            } catch (_) {}
        }
        // Apply user updates broadcast from other pages
        if (e.key === 'pf_user_updated') {
            try {
                const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (raw) {
                    const u = JSON.parse(raw);
                    currentUser = u;
                    isAuthenticated = !!u;
                    updateAuthUI();
                }
            } catch (_) {}
        }
    });
});

// Poll announcements from server and show new ones
function startAnnouncementsPolling() {
    let timer = null;
    const intervalMs = 30000; // 30s
    async function fetchAnnouncements() {
        try {
            const res = await fetch(getApiUrl('/api/announcements.php'));
            const data = await res.json();
            const items = Array.isArray(data.items) ? data.items : [];
            const lastSeen = Number(localStorage.getItem('pf_ann_seen_ts') || '0');
            let newestTs = lastSeen;
            items.slice(0, 5).forEach(it => {
                const ts = new Date(it.created_at).getTime() || Date.now();
                if (ts > lastSeen) {
                    const type = it.severity === 'closure' ? 'error' : (it.severity === 'warning' ? 'warning' : 'info');
                    showNotification(`${it.title}: ${it.message}`, type);
                    if (ts > newestTs) newestTs = ts;
                }
            });
            if (newestTs > lastSeen) localStorage.setItem('pf_ann_seen_ts', String(newestTs));
        } catch (_) {}
    }
    try { fetchAnnouncements(); } catch (_) {}
    try { timer = setInterval(fetchAnnouncements, intervalMs); } catch (_) {}
}

// Initialize Leaflet Map
function initializeMap() {
    // Hide loading indicator
    setTimeout(() => {
        const mapLoading = document.getElementById('mapLoading');
        if (mapLoading) {
            mapLoading.style.display = 'none';
        }
    }, 1000);

    // Initialize map centered on Davao City
    map = L.map('mapContainer').setView([7.0700, 125.6100], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add satellite layer (hidden by default)
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19
    });

    // Store layers for toggling
    map.satelliteLayer = satelliteLayer;

    // Regular click: only clear selection
    map.on('click', function() {
        clearSelectedParking();
    });

    // Double-click: set "my location" and search nearby
    map.on('dblclick', async function(e) {
        try {
            clearSelectedParking();
            userLocation = [e.latlng.lat, e.latlng.lng];
            // Add/replace user marker
            if (userMarker) { try { map.removeLayer(userMarker); } catch (_) {} }
            userMarker = L.marker(userLocation, {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background-color: #2563eb; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                })
            }).addTo(map);

            // Label input with reverse-geocoded street/locality
            const label = await reverseGeocode(e.latlng.lat, e.latlng.lng).catch(() => 'Selected Location');
            const input = document.getElementById('locationInput');
            if (input) input.value = label || 'Selected Location';
            showSearchLocationMarker(userLocation, label || 'Selected Location');

            // Filter and show nearest parking around pressed location
            const nearby = filterParkingData('', '', '', userLocation, '');
            const sorted = nearby.sort((a, b) => a.distance - b.distance);
            displayResults(sorted);
            updateMapMarkers(sorted);
            map.setView(userLocation, 15);
            if (sorted.length > 0) {
                const d = sorted[0].distance;
                showNotification(`Showing ${sorted.length} parking spots near selected location. Nearest is ${d.toFixed(1)}km away.`, 'success');
            } else {
                showNotification('No parking spots found near selected location.', 'error');
            }
        } catch (err) {
            try { showNotification('Unable to update location from double-click.', 'error'); } catch (_) {}
        }
    });

    console.log('Map initialized successfully');
}

// Initialize event listeners
function initializeEventListeners() {
    try {
        // Search form
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', handleSearch);
        }

        // Panel toggle (robust for mobile)
        const togglePanel = document.getElementById('togglePanel');
        const floatingToggleBtn = document.getElementById('floatingToggleBtn');
        const searchHeader = document.querySelector('.search-header');
        const bindToggle = (el) => {
            if (!el) return;
            const handler = (e) => {
                // Allow keyboard accessibility
                if (e.type === 'keydown' && !(e.key === 'Enter' || e.key === ' ')) return;
                e.preventDefault();
                e.stopPropagation();
                toggleSearchPanel();
            };
            el.addEventListener('click', handler, { passive: false });
            el.addEventListener('touchstart', handler, { passive: false });
            el.addEventListener('keydown', handler);
        };
        bindToggle(togglePanel);
        bindToggle(floatingToggleBtn);
        bindToggle(searchHeader);

        // Map controls
        const centerMapBtn = document.getElementById('centerMapBtn');
        const toggleTrafficBtn = document.getElementById('toggleTrafficBtn');
        const toggleSatelliteBtn = document.getElementById('toggleSatelliteBtn');
        const enableCompassBtn = document.getElementById('enableCompassBtn');
        const clearRouteBtn = document.getElementById('clearRouteBtn');

        if (centerMapBtn) centerMapBtn.addEventListener('click', centerMapOnSearch);
        if (toggleTrafficBtn) toggleTrafficBtn.addEventListener('click', toggleTrafficLayer);
        if (toggleSatelliteBtn) toggleSatelliteBtn.addEventListener('click', toggleSatelliteView);
        if (enableCompassBtn) enableCompassBtn.addEventListener('click', toggleCompass);
        if (clearRouteBtn) clearRouteBtn.addEventListener('click', clearRoute);

        // If traffic button is pre-marked active (e.g., via server-side markup), initialize indicator
        if (toggleTrafficBtn && toggleTrafficBtn.classList.contains('active')) {
            try {
                startTrafficPolling();
                enableTrafficOverlay();
                setTrafficLevel(computeTrafficLevel());
            } catch (_) {}
        } else if (toggleTrafficBtn) {
            // Ensure default state shows gray icon
            setTrafficLevel('none');
        }

        // Current location
        const currentLocationBtn = document.getElementById('currentLocationBtn');
        if (currentLocationBtn) currentLocationBtn.addEventListener('click', getCurrentLocation);

        // Sort buttons (may be absent)
        const sortByDistanceBtn = document.getElementById('sortByDistance');
        const sortByRatingBtn = document.getElementById('sortByRating');

        if (sortByDistanceBtn) {
            sortByDistanceBtn.addEventListener('click', () => sortResults('distance'));
        }
        if (sortByRatingBtn) {
            sortByRatingBtn.addEventListener('click', () => sortResults('rating'));
        }

        // Authentication
        try { setupAuthEventListeners(); } catch (_) {}

        // Modal close
        const closeParkingModalBtn = document.getElementById('closeParkingModal');
        if (closeParkingModalBtn) closeParkingModalBtn.addEventListener('click', closeParkingModal);

        // Close modal on overlay click
        const parkingModalOverlay = document.getElementById('parkingModalOverlay');
        if (parkingModalOverlay) parkingModalOverlay.addEventListener('click', (e) => {
            if (e.target === parkingModalOverlay) {
                closeParkingModal();
            }
        });

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Removed: binding togglePanel to hide the top navbar.
    // togglePanel is now exclusively used to collapse the side search panel
    // via initializeEventListeners -> toggleSearchPanel.
    } catch (_) {}
}

// Compass controls
async function toggleCompass() {
    if (compassEnabled) {
        stopCompass();
        showNotification('Compass disabled', 'info');
        const btn = document.getElementById('enableCompassBtn');
        if (btn) btn.classList.remove('active');
        return;
    }

    // iOS permission flow
    try {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            const resp = await DeviceOrientationEvent.requestPermission();
            if (resp !== 'granted') throw new Error('Compass permission denied');
        }
    } catch (e) {
        showNotification('Compass permission denied', 'error');
        const btn = document.getElementById('enableCompassBtn');
        if (btn) {
            btn.classList.remove('active');
        }
        return;
    }

    // Ensure we have a current location to anchor the cone
    if (!userLocation) {
        try { getCurrentLocation(); } catch (_) {}
    }

    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    const btn = document.getElementById('enableCompassBtn');
    if (btn) btn.classList.add('active');
    // Optional: watch position to keep heading marker aligned
    try {
        if (navigator.geolocation && locationWatchId === null) {
            locationWatchId = navigator.geolocation.watchPosition((pos) => {
                userLocation = [pos.coords.latitude, pos.coords.longitude];
                updateHeadingMarker();
            }, () => {}, { enableHighAccuracy: true, maximumAge: 0 });
        }
    } catch (_) {}

    compassEnabled = true;
    showNotification('Compass enabled', 'success');
}

function stopCompass() {
    window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    compassEnabled = false;
}

function handleDeviceOrientation(e) {
    let heading = null;
    // iOS Safari provides webkitCompassHeading
    if (typeof e.webkitCompassHeading === 'number') {
        heading = e.webkitCompassHeading; // 0..360, clockwise from North
    } else if (typeof e.alpha === 'number') {
        // e.alpha is rotation around Z axis; for absolute true north, some browsers set e.absolute=true
        heading = 360 - e.alpha; // convert to compass heading (clockwise from North)
    }
    if (heading == null) return;
    userHeading = Math.round((heading + 360) % 360);
    updateHeadingMarker();
}

function updateHeadingMarker() {
    if (!map || !userLocation || userHeading == null) return;
    const html = '<div id="headingCone" class="heading-cone"></div>';
    if (!headingMarker) {
        headingMarker = L.marker(userLocation, {
            icon: L.divIcon({ className: 'heading-marker', html, iconSize: [40, 44], iconAnchor: [20, 36] })
        }).addTo(map);
    } else {
        try { headingMarker.setLatLng(userLocation); } catch (_) {}
    }
    const el = document.getElementById('headingCone');
    if (el) {
        el.style.transform = `rotate(${userHeading}deg)`;
    }
}

// Reuse profile UI from main by defining thin wrappers if not present
if (typeof openProfileModal !== 'function') {
    window.openProfileModal = function() {
        // Lightweight inline profile for test page
        if (!currentUser) {
            showNotification('Please sign in first', 'error');
            try { openAuthModal('login'); } catch (_) {}
            return;
        }
        const content = `
            <div class="profile-modal">
                <h3 class="profile-title"><i class="fas fa-user"></i> My Profile</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label>First Name</label>
                        <input type="text" id="pfFirstName" value="${currentUser.firstName || ''}">
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" id="pfLastName" value="${currentUser.lastName || ''}">
                    </div>
                    <div class="form-group full">
                        <label>Email</label>
                        <input type="email" id="pfEmail" value="${currentUser.email || ''}" disabled>
                    </div>
                    <div class="form-group full">
                        <label>Phone</label>
                        <input type="text" id="pfPhone" value="${currentUser.phone || ''}" inputmode="numeric" pattern="[0-9]*">
                        <div class="input-hint">Ex. 09123456789 or +639123456789</div>
                    </div>
                    <div class="form-group">
                        <label>Vehicle Make</label>
                        <input type="text" id="pfVehicleMake" value="">
                    </div>
                    <div class="form-group">
                        <label>Vehicle Plate</label>
                        <input type="text" id="pfVehiclePlate" value="">
                    </div>
                    <div class="form-group full">
                        <label>Address</label>
                        <input type="text" id="pfAddress" value="">
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="closeModal()">Close</button>
                    <button class="btn-primary" onclick="saveProfile()">Save</button>
                </div>
            </div>
        `;
        showModal(content);
        // Ensure phone input allows only digits
        try {
            const phoneEl = document.getElementById('pfPhone');
            if (phoneEl) {
                phoneEl.setAttribute('inputmode','numeric');
                phoneEl.setAttribute('pattern','[0-9]*');
                phoneEl.addEventListener('input', function(){
                    this.value = String(this.value || '').replace(/[^0-9]/g,'');
                });
            }
        } catch (_) {}
        fetch(getApiUrl(`/api/profile.php?user_id=${encodeURIComponent(currentUser.id)}`))
            .then(r => r.json()).then(data => {
                if (data && data.profile) {
                    if (document.getElementById('pfPhone')) {
                        document.getElementById('pfPhone').value = data.profile.phone || (currentUser.phone || '');
                    }
                    document.getElementById('pfVehicleMake').value = data.profile.vehicle_make || '';
                    document.getElementById('pfVehiclePlate').value = data.profile.vehicle_plate || '';
                    document.getElementById('pfAddress').value = data.profile.address || '';
                }
        }).catch(() => {});
    };
}

if (typeof saveProfile !== 'function') {
    window.saveProfile = function() {
        if (!currentUser) return;
        const payload = {
            user_id: currentUser.id,
            first_name: document.getElementById('pfFirstName') ? document.getElementById('pfFirstName').value.trim() : undefined,
            last_name: document.getElementById('pfLastName') ? document.getElementById('pfLastName').value.trim() : undefined,
            phone: document.getElementById('pfPhone') ? document.getElementById('pfPhone').value.trim() : undefined,
            vehicle_make: document.getElementById('pfVehicleMake').value.trim(),
            vehicle_plate: document.getElementById('pfVehiclePlate').value.trim(),
            address: document.getElementById('pfAddress').value.trim()
        };
        fetch(getApiUrl('/api/profile.php'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || 'Failed to save profile');
            try {
                if (payload.first_name) currentUser.firstName = payload.first_name;
                if (payload.last_name) currentUser.lastName = payload.last_name;
                if (payload.phone) currentUser.phone = payload.phone;
                updateAuthUI();
                // Persist to BOTH storages and broadcast so other pages update
                try {
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    sessionStorage.setItem('user', JSON.stringify(currentUser));
                    localStorage.setItem('pf_user_updated', String(Date.now()));
                } catch (_) {}
            } catch (_) {}
            showNotification('Profile saved', 'success');
            closeModal();
        }).catch(err => {
            showNotification(err.message || 'Failed to save profile', 'error');
        });
    };
}

// Generic modal helpers for inline pages
if (typeof showModal !== 'function') {
    window.showModal = function(contentHtml) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'genericModalOverlay';
        overlay.innerHTML = `
            <div class="modal" id="genericModal">
                <div class="modal-header">
                    <h3>Profile</h3>
                    <button class="close-btn" id="closeGenericModal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-content">${contentHtml}</div>
            </div>`;
        document.body.appendChild(overlay);
        // Show with fade
        requestAnimationFrame(() => overlay.classList.add('show'));
        // Close handlers
        const closeBtn = overlay.querySelector('#closeGenericModal');
        if (closeBtn) closeBtn.addEventListener('click', window.closeModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) window.closeModal(); });
    };
}

if (typeof closeModal !== 'function') {
    window.closeModal = function() {
        const overlay = document.getElementById('genericModalOverlay');
        if (!overlay) return;
        overlay.classList.remove('show');
        setTimeout(() => { try { overlay.remove(); } catch (_) {} }, 200);
    };
}

// Inject design styles for profile modal
(function ensureProfileStyles(){
    const STYLE_ID = 'pf-profile-styles';
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .profile-modal { padding: 0.5rem 0; }
      .profile-title { display:flex; align-items:center; gap:0.5rem; color:#1e293b; font-size:1.25rem; margin:0 0 1rem 0; }
      .profile-title i { color:#2563eb; }
      .form-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .form-group.full { grid-column: 1 / -1; }
      .form-group label { display:block; margin-bottom:0.4rem; font-weight:600; color:#374151; }
      .form-group input { width:100%; padding:0.75rem; border:2px solid #e2e8f0; border-radius:10px; font-size:0.95rem; transition:border-color 0.2s ease, box-shadow 0.2s ease; }
      .form-group input:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.15); }
      .input-hint { font-size:0.85rem; color:#64748b; margin-top:4px; }
      .modal-actions { display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1rem; }
      .btn-primary { background:#2563eb; color:#fff; border:none; padding:0.7rem 1.2rem; border-radius:8px; font-weight:600; cursor:pointer; }
      .btn-secondary { background:#fff; border:2px solid #e2e8f0; color:#64748b; padding:0.7rem 1.2rem; border-radius:8px; font-weight:600; cursor:pointer; }
      .btn-primary:hover { background:#1d4ed8; }
      .btn-secondary:hover { border-color:#2563eb; color:#2563eb; }
      @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(style);
})();

// Smooth scroll for Home, About, Contact
function setupSmoothScroll() {
    const links = document.querySelectorAll('.nav-link[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('.header');
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

// Make all X icons (elements with .close-btn) functional
function setupGlobalCloseButtons() {
    document.addEventListener('click', function(e) {
        const closeBtn = e.target.closest('.close-btn');
        if (!closeBtn) return;
        // Auth modal X
        if (closeBtn.id === 'closeAuthModal') {
            closeAuthModal();
            return;
        }
        // Parking details modal X
        if (closeBtn.id === 'closeParkingModal') {
            closeParkingModal();
            return;
        }
        // Settings modal X
        if (closeBtn.id === 'closeSettingsModal') {
            closeSettingsModal();
            return;
        }
        // Generic overlay fallback
        const overlay = closeBtn.closest('.modal-overlay, #authModalOverlay, #settingsModalOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    });
}

// Load parking data and add markers
function loadParkingData() {
    const publicOnly = parkingData.filter(isPublicParking);
    publicOnly.forEach(parking => {
        addParkingMarker(parking);
    });
}

// Load parking slots from backend API and render markers
async function loadParkingDataFromApi() {
    try {
        const res = await fetch(getApiUrl('/api/parking.php'));
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load parking slots');
        const items = Array.isArray(data.items) ? data.items : [];
        // Transform API rows to map.js parking objects
        const transformed = items.map(row => ({
            id: Number(row.id),
            name: row.name,
            type: row.type || 'street',
            address: row.address || '',
            coordinates: [Number(row.latitude), Number(row.longitude)],
            price: Number(row.price || 0),
            duration: row.duration || '2 hours',
            availability: `${Math.max(0, Number(row.capacity) - Number(row.occupied))} spots available`,
            rating: 4.0, // default rating for admin-managed slots
            features: (row.features ? String(row.features).split(',').map(s => s.trim()).filter(Boolean) : []),
            capacity: Number(row.capacity || 0),
            occupied: Number(row.occupied || 0),
            managed: true
        })).filter(isPublicParking);

        // Replace current dataset and render markers
        parkingData = transformed;
        parkingMarkers.forEach(m => { try { m.remove(); } catch (_) {} });
        parkingMarkers = [];
        transformed.forEach(addParkingMarker);
    } catch (err) {
        console.error('Error loading parking slots from API:', err);
        // Fallback to static embedded data
        loadParkingData();
    }
}

// Admin-only deletion from map view
if (typeof window.deleteSlotFromMap !== 'function') {
    window.deleteSlotFromMap = async function(parkingId) {
        try {
            if (!isAuthenticated || !currentUser || !currentUser.isAdmin) {
                showNotification('Admin privileges required to delete.', 'error');
                return;
            }
            const res = await fetch(getApiUrl(`/api/parking.php?id=${encodeURIComponent(parkingId)}`), {
                method: 'DELETE',
                headers: { 'X-Admin-Id': String(currentUser.id) }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to delete slot');
            showNotification('Parking slot deleted', 'success');
            // Refresh markers from API
            await loadParkingDataFromApi();
        } catch (err) {
            console.error('Delete slot error:', err);
            showNotification(err.message || 'Error deleting slot', 'error');
        }
    }
}

// Determine if a parking entry is public
function isPublicParking(parking) {
    // Show all known parking types on the map (admin-managed or sample)
    return parking && ['street', 'lot', 'garage', 'valet'].includes(parking.type);
}

// Add parking marker to map
function addParkingMarker(parking) {
    // Determine marker color based on availability
    let markerColor = '#2563eb'; // Default blue
    const occupiedPercentage = (parking.occupied / parking.capacity) * 100;
    
    if (occupiedPercentage >= 90) {
        markerColor = '#dc2626'; // Red - almost full
    } else if (occupiedPercentage >= 70) {
        markerColor = '#f59e0b'; // Orange - limited
    } else {
        markerColor = '#059669'; // Green - available
    }

    // Create parking sign icon based on type - Detailed Information Style
    let parkingIcon = '';
    let parkingTypeText = '';
    switch(parking.type) {
        case 'garage':
            parkingIcon = '🏢';
            parkingTypeText = 'GARAGE';
            break;
        case 'street':
            parkingIcon = '🅿️';
            parkingTypeText = 'STREET';
            break;
        case 'lot':
            parkingIcon = '🅿️';
            parkingTypeText = 'LOT';
            break;
        case 'valet':
            parkingIcon = '🚗';
            parkingTypeText = 'VALET';
            break;
        default:
            parkingIcon = '🅿️';
            parkingTypeText = 'PARKING';
    }

    const availableSpots = parking.capacity - parking.occupied;
    const availablePercentage = Math.round((availableSpots / parking.capacity) * 100);

    // Create custom icon with detailed information
    const customIcon = L.divIcon({
        className: 'parking-marker',
        html: `
            <div style="
                background-color: ${markerColor}; 
                width: 60px; 
                height: 45px; 
                border-radius: 6px; 
                border: 2px solid white; 
                box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                font-family: Arial, sans-serif;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    margin-bottom: 1px;
                ">
                    <span style="font-size: 14px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));">${parkingIcon}</span>
                    <span style="
                        color: white;
                        font-size: 7px;
                        font-weight: bold;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.7);
                        letter-spacing: 0.3px;
                    ">${parkingTypeText}</span>
                </div>
                <div style="
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.7);
                    text-align: center;
                    line-height: 1.0;
                ">
                    <div>${availableSpots} SPOTS</div>
                    
                </div>
                <div style="
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: white;
                    color: ${markerColor};
                    padding: 1px 4px;
                    border-radius: 8px;
                    font-size: 8px;
                    font-weight: bold;
                    white-space: nowrap;
                    border: 1px solid ${markerColor};
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    min-width: 20px;
                    text-align: center;
                ">${availablePercentage}%</div>
            </div>
        `,
        iconSize: [60, 55],
        iconAnchor: [30, 27]
    });

    // Create marker
    const marker = L.marker(parking.coordinates, { icon: customIcon })
        .addTo(map)
        .bindPopup(createParkingPopup(parking))
        .on('click', function() {
            selectParking(parking);
        });

    // Store marker reference
    parking.marker = marker;
    parkingMarkers.push(marker);
}

// Create parking popup content
function createParkingPopup(parking) {
    const availabilityPercentage = Math.round(((parking.capacity - parking.occupied) / parking.capacity) * 100);
    const canDelete = (isAuthenticated && currentUser && currentUser.isAdmin && (parking.managed === true));
    const canEdit = (isAuthenticated && currentUser && currentUser.isAdmin && (parking.managed === true));
    const actionBtns = (canEdit || canDelete)
        ? `<div style=\"margin-top:0.5rem; display:flex; justify-content:flex-end; gap:0.5rem;\">
              ${canEdit ? `<button class=\"btn-secondary\" style=\"padding:0.4rem 0.6rem; border-radius:8px; background:#2563eb; color:#fff;\" onclick=\"event.stopPropagation(); window.location.href='../admin.php?slotId=${parking.id}'; return false;\"><i class=\"fas fa-pen\"></i> Edit</button>` : ''}
              ${canDelete ? `<button class=\"btn-danger\" style=\"padding:0.4rem 0.6rem; border-radius:8px;\" onclick=\"event.stopPropagation(); deleteSlotFromMap(${parking.id}); return false;\"><i class=\"fas fa-trash\"></i> Delete</button>` : ''}
           </div>`
        : '';

    return `
        <div class="parking-popup">
            <h4>${parking.name}</h4>
            <p>${parking.duration}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${parking.address}</p>
            <p><i class="fas fa-star"></i> ${parking.rating}/5 • ${parking.availability}</p>
            <div class="availability-bar">
                <div class="availability-fill" style="width: ${availabilityPercentage}%"></div>
            </div>
            <p class="availability-text">${availabilityPercentage}% available</p>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
                <button class="btn-directions" style="padding:0.4rem 0.6rem; border-radius:8px;" onclick="event.stopPropagation(); getDirections(${parking.id}); return false;">
                    <i class="fas fa-directions"></i> Directions
                </button>
            </div>
            ${actionBtns}
        </div>
    `;
}

// Handle search
async function handleSearch(e) {
    e.preventDefault();
    
    const inputEl = document.getElementById('locationInput');
    const rawLocation = inputEl ? inputEl.value.trim() : '';
    // Remove redundant Davao context from the query input
    const sanitized = rawLocation.replace(/\b(davao\s*city|davao)\b/gi, '').replace(/\s{2,}/g, ' ').trim();
    const location = sanitized || rawLocation || 'Davao City';
    const norm = rawLocation.toLowerCase();
    const includeAll = norm === 'davao' || norm === 'davao city';
    const duration = '';
    const type = '';
    const maxPrice = '';
    const availabilityEl = document.getElementById('availabilityFilter');
    const availabilityFilter = availabilityEl ? availabilityEl.value : '';

    if (!rawLocation) {
        showNotification('Please enter a location', 'error');
        return;
    }

    // Save to history
    try {
        const key = 'pf_search_history';
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        const entry = { q: String(rawLocation || '').trim(), t: Date.now() };
        if (entry.q) {
            if (arr.length === 0 || arr[arr.length - 1].q !== entry.q) arr.push(entry);
            while (arr.length > 30) arr.shift();
            localStorage.setItem(key, JSON.stringify(arr));
        }
    } catch (_) {}
    // Show loading notification
    showNotification('Searching for location...', 'info');

    try {
        // Use real-time geocoding service
        const searchCoordinates = await geocodeLocationRealTime(location);
        
        if (searchCoordinates) {
            // For city-wide queries (Davao/Davao City), keep current viewport
            if (!includeAll) {
                // Center map on search location with appropriate zoom
                map.setView(searchCoordinates, 15);
            }
            
            // Filter parking data; for city-wide query (Davao/Davao City), include all slots
            const filteredResults = filterParkingData(duration, type, '', searchCoordinates, availabilityFilter, includeAll);
            
            // Sort by distance to show nearest parking first
            const nearestResults = filteredResults.sort((a, b) => a.distance - b.distance);
            
            // Display results
            displayResults(nearestResults);
            
            // Update map markers
            updateMapMarkers(nearestResults);
            
            // Show search location marker
            showSearchLocationMarker(searchCoordinates, location);
            
            if (nearestResults.length === 0) {
                showNotification('No available parking spots found near this location. Try adjusting your filters or searching a different area.', 'error');
            } else {
                if (includeAll) {
                    showNotification(`Showing ${nearestResults.length} parking slots across Davao City.`, 'success');
                } else {
                    const nearestDistance = nearestResults[0].distance;
                    const locationInfo = getLocationInfo(searchCoordinates);
                    showNotification(`Found ${nearestResults.length} parking spots near ${location}. ${locationInfo} Nearest is ${nearestDistance.toFixed(1)}km away.`, 'success');
                }
            }
        } else {
            showNotification('Location not found. Please try a different address or check the spelling.', 'error');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        showNotification('Error searching location. Please try again.', 'error');
    }
}

// Save map interactions to history (pointed location, directions)
function pushMapHistory(entry) {
    try {
        const key = 'pf_search_history';
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        const item = { t: Date.now(), ...entry };
        arr.push(item);
        while (arr.length > 50) arr.shift();
        localStorage.setItem(key, JSON.stringify(arr));
    } catch (_) {}
}

// Open search history modal (map page)
function openSearchHistoryModal() {
    try {
        const key = 'pf_search_history';
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        const fmt = (ts) => new Date(ts).toLocaleString();
        const items = arr.slice().reverse().map((it) => {
            let icon = 'search';
            let text = it.q || '';
            if (it.type === 'point') {
                icon = 'map-marker-alt';
                text = `Pinned: ${it.label || 'Selected Location'}`;
            } else if (it.type === 'directions') {
                icon = 'directions';
                const fromTxt = it.fromLabel || 'Location';
                const toTxt = it.toName || 'Parking Slot';
                text = `Route: ${fromTxt} → ${toTxt}`;
            }
            return `
            <li style=\"display:flex; justify-content:space-between; align-items:center; gap:0.75rem; padding:0.5rem 0; border-bottom:1px solid #eef2f7;\">
                <span><i class=\"fas fa-${icon}\" style=\"color:#64748b; margin-right:6px;\"></i>${text}</span>
                <div style=\"display:flex; align-items:center; gap:0.5rem;\">
                    <span style=\"color:#94a3b8; font-size:0.85rem;\">${fmt(it.t)}</span>
                    <button class=\"btn-secondary\" style=\"padding:0.25rem 0.5rem; border-radius:8px;\" onclick=\"deleteHistoryItem('${it.t}')\"><i class=\"fas fa-trash\"></i> Delete</button>
                </div>
            </li>`;
        }).join('');
        const content = `
            <div class=\"settings-modal\">
                <h3>Search History</h3>
                <ul id=\"historyList\" style=\"list-style:none; padding:0; margin:0; max-height:50vh; overflow:auto;\">${items || '<li style=\"color:#94a3b8;\">No history yet</li>'}</ul>
                <div class=\"modal-actions\">
                    <button class=\"btn-primary\" onclick=\"clearAllHistory()\">Clear All</button>
                    <button class=\"btn-secondary\" onclick=\"closeModal()\">Close</button>
                </div>
            </div>`;
        showModal(content);
    } catch (e) {
        try { showNotification('Unable to open history', 'error'); } catch (_) {}
    }
}

// Delete a single history entry by timestamp
window.deleteHistoryItem = function(ts) {
    try {
        const key = 'pf_search_history';
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        const targetTs = Number(ts);
        const filtered = arr.filter(it => Number(it.t) !== targetTs);
        localStorage.setItem(key, JSON.stringify(filtered));
        try { showNotification('History entry deleted', 'success'); } catch (_) {}
        closeModal();
        setTimeout(() => { try { openSearchHistoryModal(); } catch (_) {} }, 100);
    } catch (e) {
        try { showNotification('Unable to delete entry', 'error'); } catch (_) {}
    }
}

// Clear all history entries
window.clearAllHistory = function() {
    try {
        const key = 'pf_search_history';
        localStorage.removeItem(key);
        try { showNotification('All history cleared', 'info'); } catch (_) {}
        closeModal();
    } catch (e) {
        try { showNotification('Unable to clear history', 'error'); } catch (_) {}
    }
}

// Delete selected history entries by timestamp
// deleteSelectedHistory removed per request

// Go to the most recent history entry
window.goToLastHistory = async function() {
    try {
        const key = 'pf_search_history';
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        if (!arr.length) { try { showNotification('History is empty', 'info'); } catch (_) {} return; }
        // Pick the latest by timestamp
        const latest = arr.reduce((a, b) => (Number(a.t) > Number(b.t) ? a : b));
        closeModal();
        if (latest.type === 'point' && Array.isArray(latest.coords)) {
            try {
                const label = latest.label || 'Selected Location';
                const input = document.getElementById('locationInput');
                if (input) input.value = label;
                map.setView(latest.coords, 15);
                showSearchLocationMarker(latest.coords, label);
                showNotification(`Moved to: ${label}`, 'success');
            } catch (_) {}
            return;
        }
        if (latest.type === 'directions') {
            try {
                if (latest.fromCoords && Array.isArray(latest.fromCoords)) {
                    userLocation = latest.fromCoords.slice();
                }
                const input = document.getElementById('locationInput');
                if (input && latest.fromLabel) input.value = latest.fromLabel;
                if (latest.toId) {
                    getDirections(latest.toId);
                } else if (latest.toCoords && Array.isArray(latest.toCoords)) {
                    // Fallback: simulate directions by drawing a line
                    try {
                        const latlngs = [
                            L.latLng(userLocation[0], userLocation[1]),
                            L.latLng(latest.toCoords[0], latest.toCoords[1])
                        ];
                        if (map.currentRouteLayer) { try { map.removeLayer(map.currentRouteLayer); } catch (_) {} }
                        map.currentRouteLayer = L.polyline(latlngs, { color: '#2563eb', weight: 4 }).addTo(map);
                        map.fitBounds(L.latLngBounds(latlngs).pad(0.2));
                        const btn = document.getElementById('clearRouteBtn');
                        if (btn) btn.style.display = 'inline-block';
                        showNotification(`Showing route to: ${latest.toName || 'Destination'}`, 'success');
                    } catch (_) {}
                }
            } catch (_) {}
            return;
        }
        // Default: treat as a search query
        if (latest.q) {
            try {
                const input = document.getElementById('locationInput');
                if (input) input.value = latest.q;
                await quickSearch(latest.q);
                showNotification(`Searched: ${latest.q}`, 'success');
            } catch (_) {}
        }
    } catch (e) {
        try { showNotification('Unable to go to last history', 'error'); } catch (_) {}
    }
}

// Real-time geocoding using OpenStreetMap Nominatim API
async function geocodeLocationRealTime(location) {
    try {
        // Add Davao City context to improve search accuracy
        const searchQuery = `${location}, Davao City, Philippines`;
        
        // Use Nominatim API for geocoding
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=ph&addressdetails=1`
        );
        
        if (!response.ok) {
            throw new Error('Geocoding service unavailable');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const result = data[0];
            const coordinates = [parseFloat(result.lat), parseFloat(result.lon)];
            
            // Verify the result is in Davao City area (approximate bounds)
            const [lat, lon] = coordinates;
            if (lat >= 6.5 && lat <= 7.5 && lon >= 125.0 && lon <= 126.0) {
                return coordinates;
            } else {
                // If result is outside Davao City bounds, try with more specific query
                return await geocodeLocationRealTimeSpecific(location);
            }
        } else {
            // If no results, try with more specific Davao City query
            return await geocodeLocationRealTimeSpecific(location);
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        // Fallback to local geocoding
        return geocodeLocation(location);
    }
}

// More specific geocoding for Davao City locations
async function geocodeLocationRealTimeSpecific(location) {
    try {
        // Try different search variations
        const searchVariations = [
            `${location}, Davao City, Davao del Sur, Philippines`,
            `${location}, Davao, Philippines`,
            `Davao City, ${location}, Philippines`
        ];
        
        for (const searchQuery of searchVariations) {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=ph&addressdetails=1`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const result = data[0];
                    const coordinates = [parseFloat(result.lat), parseFloat(result.lon)];
                    
                    // Verify the result is in Davao City area
                    const [lat, lon] = coordinates;
                    if (lat >= 6.5 && lat <= 7.5 && lon >= 125.0 && lon <= 126.0) {
                        return coordinates;
                    }
                }
            }
        }
        
        // If still no results, fallback to local geocoding
        return geocodeLocation(location);
    } catch (error) {
        console.error('Specific geocoding error:', error);
        return geocodeLocation(location);
    }
}

// Enhanced geocoding simulation with more Davao City locations
function geocodeLocation(location) {
    // Comprehensive Davao City locations database
    const locations = {
        // Shopping Malls & Commercial Areas
        'sm city davao': [7.0731, 125.6128],
        'sm mall': [7.0731, 125.6128],
        'sm city': [7.0731, 125.6128],
        'sm': [7.0731, 125.6128],
        'abreeza': [7.0800, 125.6200],
        'abreeza mall': [7.0800, 125.6200],
        'gmall': [7.0700, 125.6100],
        'gmall davao': [7.0700, 125.6100],
        'victoria plaza': [7.1900, 125.4550],
        'victoria': [7.1900, 125.4550],
        
        // Major Streets & Avenues
        'roxas avenue': [7.1907, 125.4551],
        'roxas': [7.1907, 125.4551],
        'roxas ave': [7.1907, 125.4551],
        'roxas street': [7.1907, 125.4551],
        'san pedro': [7.065595, 125.607725],
        'san pedro street': [7.065595, 125.607725],
        'san pedro st': [7.065595, 125.607725],
        'quimpo': [7.0731, 125.6128],
        'quimpo boulevard': [7.0731, 125.6128],
        'quimpo blvd': [7.0731, 125.6128],
        'jp laurel': [7.0800, 125.6200],
        'jp laurel avenue': [7.0800, 125.6200],
        'jp laurel ave': [7.0800, 125.6200],
        'cm recto': [7.070846, 125.611728],
        'cm recto street': [7.070846, 125.611728],
        'cm recto st': [7.070846, 125.611728],
        'claveria': [7.1900, 125.4550],
        'claveria street': [7.1900, 125.4550],
        'claveria st': [7.1900, 125.4550],
        'pelayo': [7.066761, 125.605295],
        'pelayo street': [7.066761, 125.605295],
        'pelayo st': [7.066761, 125.605295],
        
        // Specific Street Names for Quick Search
        'pitchon': [7.064610, 125.606807],
        'pitchon street': [7.064610, 125.606807],
        'pitchon st': [7.064610, 125.606807],
        'anda': [7.065656, 125.606542],
        'anda street': [7.065656, 125.606542],
        'bolton': [7.066880, 125.609680],
        'bolton street': [7.066880, 125.609680],
        'bolton st': [7.066880, 125.609680],
        'illustre': [7.068760, 125.605007],
        'illustre street': [7.068760, 125.605007],
        'illustre st': [7.068760, 125.605007],
        'duterte': [7.068793, 125.605838],
        'duterte street': [7.068793, 125.605838],
        'duterte st': [7.068793, 125.605838],
        'villa abrille': [7.074843, 125.613956],
        'villa abrille street': [7.074843, 125.613956],
        'monteverde': [7.075311, 125.616710],
        'monteverde street': [7.075311, 125.616710],
        'monteverde st': [7.075311, 125.616710],
        
        // Parks & Landmarks
        'people\'s park': [7.0750, 125.6100],
        'peoples park': [7.0750, 125.6100],
        'peoples': [7.0750, 125.6100],
        'rizal park': [7.0750, 125.6100],
        'davao city hall': [7.1900, 125.4550],
        'city hall': [7.1900, 125.4550],
        'sangguniang panlungsod': [7.1900, 125.4550],
        
        // Hotels & Accommodations
        'marco polo': [7.1900, 125.4550],
        'marco polo hotel': [7.1900, 125.4550],
        'marco': [7.1900, 125.4550],
        'royal mandaya': [7.1900, 125.4550],
        'royal mandaya hotel': [7.1900, 125.4550],
        'waterfront': [7.1900, 125.4550],
        'waterfront hotel': [7.1900, 125.4550],
        
        // Markets & Commercial Areas
        'bankerohan': [7.067632, 125.603453],
        'bankerohan market': [7.067632, 125.603453],
        'bankerohan public market': [7.067632, 125.603453],
        'bankerohan terminal': [7.067632, 125.603453],
        'agdao': [7.1800, 125.4600],
        'agdao market': [7.1800, 125.4600],
        'agdao terminal': [7.1800, 125.4600],
        'ulan': [7.1800, 125.4600],
        'ulan market': [7.1800, 125.4600],
        
        // Residential Areas
        'matina': [7.0700, 125.6250],
        'matina town square': [7.0700, 125.6250],
        'matina town': [7.0700, 125.6250],
        'matina crossing': [7.0700, 125.6250],
        'buhangin': [7.0800, 125.6200],
        'buhangin crossing': [7.0800, 125.6200],
        'buhangin terminal': [7.0800, 125.6200],
        'crossing bayas': [7.0269, 125.4092],
        'crossing bayabas': [7.0269, 125.4092],
        'bayas crossing': [7.0269, 125.4092],
        'bayabas crossing': [7.0269, 125.4092],
        'toril park': [7.01872, 125.49685],
        'agton street': [7.01872, 125.49685],
        'agton street toril park': [7.01872, 125.49685],
        'toril town': [7.01872, 125.49685],
        'toril district': [7.01872, 125.49685],
        'toril davao': [7.01872, 125.49685],
        'toril market': [7.01872, 125.49685],
        'toril hall': [7.01872, 125.49685],
        'calinan': [7.1907, 125.4551],
        'calinan town': [7.1907, 125.4551],
        'calinan market': [7.1907, 125.4551],
        'mintal': [7.0600, 125.6000],
        'mintal town': [7.0600, 125.6000],
        'mintal market': [7.0600, 125.6000],
        
        // Transportation Hubs
        'airport': [7.1256, 125.6458],
        'davao airport': [7.1256, 125.6458],
        'international airport': [7.1256, 125.6458],
        'francisco bangoy': [7.1256, 125.6458],
        'eco terminal': [7.1900, 125.4550],
        'eco': [7.1900, 125.4550],
        'sasa': [7.1900, 125.4550],
        'sasa port': [7.1900, 125.4550],
        
        // Educational Institutions
        'ateneo': [7.0800, 125.6200],
        'ateneo de davao': [7.0800, 125.6200],
        'addu': [7.0800, 125.6200],
        'university of mindanao': [7.0800, 125.6200],
        'um': [7.0800, 125.6200],
        'usc': [7.1900, 125.4550],
        'university of southern mindanao': [7.1900, 125.4550],
        
        // Hospitals & Medical Centers
        'davao doctors': [7.1900, 125.4550],
        'davao doctors hospital': [7.1900, 125.4550],
        'ddh': [7.1900, 125.4550],
        'southern philippines medical center': [7.1900, 125.4550],
        'spmc': [7.1900, 125.4550],
        'medical center': [7.1900, 125.4550],
        
        // General Areas
        'downtown': [7.1900, 125.4550],
        'city center': [7.1900, 125.4550],
        'davao city': [7.1900, 125.4550],
        'davao': [7.1900, 125.4550],
        'davao city center': [7.1900, 125.4550],
        'davao downtown': [7.1900, 125.4550],
        
        // Calinan Area (Accurate coordinates)
        'calinan': [7.0269, 125.4092],
        'calinan market': [7.0269, 125.4092],
        'calinan public market': [7.0269, 125.4092],
        'calinan terminal': [7.0250, 125.4080],
        'calinan town center': [7.0300, 125.4100],
        'calinan town': [7.0300, 125.4100],
        
        // Nature & Recreation
        'eden nature park': [7.0500, 125.5800],
        'eden park': [7.0500, 125.5800],
        'eden': [7.0500, 125.5800],
        'malagos': [7.0500, 125.5800],
        'malagos garden': [7.0500, 125.5800],
        'malagos resort': [7.0500, 125.5800],
        'crocodile park': [7.0700, 125.6250],
        'crocodile': [7.0700, 125.6250],
        'philippine eagle center': [7.0500, 125.5800],
        'eagle center': [7.0500, 125.5800]
    };
    
    const normalizedLocation = location.toLowerCase().trim();
    
    // First try exact matches
    if (locations[normalizedLocation]) {
        return locations[normalizedLocation];
    }
    
    // Then try partial matches (more flexible)
    for (const [key, coords] of Object.entries(locations)) {
        if (normalizedLocation.includes(key) || key.includes(normalizedLocation)) {
            return coords;
        }
    }
    
    // Try word-by-word matching for better results
    const searchWords = normalizedLocation.split(' ').filter(word => word.length > 1);
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [key, coords] of Object.entries(locations)) {
        const keyWords = key.split(' ').filter(word => word.length > 1);
        let matchCount = 0;
        
        for (const searchWord of searchWords) {
            for (const keyWord of keyWords) {
                if (keyWord.includes(searchWord) || searchWord.includes(keyWord)) {
                    matchCount++;
                    break;
                }
            }
        }
        
        // Calculate match score
        const matchScore = matchCount / Math.max(searchWords.length, keyWords.length);
        
        if (matchScore > bestScore && matchScore >= 0.3) {
            bestScore = matchScore;
            bestMatch = coords;
        }
    }
    
    if (bestMatch) {
        return bestMatch;
    }
    
    // If still no match, try to extract coordinates from common patterns
    const coordinatePattern = /(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/;
    const coordMatch = location.match(coordinatePattern);
    if (coordMatch) {
        return [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
    }
    
    // Default to Davao City center if not found
    return [7.1900, 125.4550];
}

// Get location information for better user feedback
function getLocationInfo(coordinates) {
    const [lat, lng] = coordinates;
    
    // Define major areas with their approximate boundaries
    const areas = [
        { name: 'SM City Davao Area', bounds: [[7.0700, 125.6100], [7.0800, 125.6200]] },
        { name: 'Downtown Davao', bounds: [[7.1850, 125.4500], [7.1950, 125.4600]] },
        { name: 'Matina Area', bounds: [[7.0650, 125.6200], [7.0850, 125.6300]] },
        { name: 'Toril Area', bounds: [[7.0450, 125.5750], [7.0550, 125.5850]] },
        { name: 'Calinan Area', bounds: [[7.1850, 125.4500], [7.1950, 125.4600]] },
        { name: 'Airport Area', bounds: [[7.1200, 125.6400], [7.1300, 125.6500]] },
        { name: 'People\'s Park Area', bounds: [[7.0700, 125.6050], [7.0800, 125.6150]] }
    ];
    
    for (const area of areas) {
        const [[minLat, minLng], [maxLat, maxLng]] = area.bounds;
        if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
            return `Located in ${area.name}.`;
        }
    }
    
    return 'Located in Davao City.';
}

// Show search location marker on map
function showSearchLocationMarker(coordinates, locationName) {
    // Remove existing search marker if any
    if (window.searchLocationMarker) {
        map.removeLayer(window.searchLocationMarker);
    }

    // Skip showing a search location marker/popup for generic city queries
    const normName = (locationName || '').trim().toLowerCase();
    if (!normName || normName === 'davao' || normName === 'davao city') {
        window.searchLocationMarker = null;
        return; // do not render the popup for Davao-only searches
    }
    
    // Create search location marker
    const searchIcon = L.divIcon({
        className: 'search-location-marker',
        html: `
            <div style="
                background-color: #2563eb;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: white;
                font-weight: bold;
            ">
                📍
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
    
    // Add marker to map
    window.searchLocationMarker = L.marker(coordinates, { icon: searchIcon })
        .addTo(map);

    // Save pointed/search location to history (skip generic citywide entries)
    try {
        const normName = (locationName || '').trim().toLowerCase();
        if (normName && normName !== 'davao' && normName !== 'davao city') {
            pushMapHistory({ type: 'point', label: locationName || 'Selected Location', coords: coordinates });
        }
    } catch (_) {}
}

// Filter parking data based on criteria
function filterParkingData(duration, type, maxPrice, searchCoords, availabilityFilter, includeAll = false) {
    let filtered = parkingData.filter(isPublicParking);
    
    // Filter by type
    if (type) {
        filtered = filtered.filter(parking => parking.type === type);
    }
    
    // Filter by duration
    if (duration) {
        filtered = filtered.filter(parking => {
            const parkingDuration = parseInt(parking.duration.split(' ')[0]);
            const searchDuration = parseInt(duration);
            return parkingDuration >= searchDuration;
        });
    }
    
    // Filter by price
    if (maxPrice) {
        filtered = filtered.filter(parking => parking.price <= parseFloat(maxPrice));
    }
    
    // Calculate distances and add availability info first
    filtered = filtered.map(parking => {
        const distance = calculateDistance(searchCoords, parking.coordinates);
        const availabilityPercentage = ((parking.capacity - parking.occupied) / parking.capacity) * 100;
        const availableSpots = parking.capacity - parking.occupied;
        
        return {
            ...parking,
            distance: distance,
            availabilityPercentage: availabilityPercentage,
            availableSpots: availableSpots,
            availabilityStatus: getAvailabilityStatus(availabilityPercentage)
        };
    });
    
    // Filter by distance (show parking within 10km radius), unless showing all
    if (!includeAll) {
        filtered = filtered.filter(parking => parking.distance <= 10);
    }
    
    // Filter by availability
    if (availabilityFilter) {
        if (availabilityFilter === 'any') {
            // Show all with at least 1 spot available
            filtered = filtered.filter(parking => parking.availableSpots > 0);
        } else {
            // Filter by specific availability level
            filtered = filtered.filter(parking => parking.availabilityStatus === availabilityFilter);
        }
    } else {
        // Default: only show places with available parking
        filtered = filtered.filter(parking => parking.availableSpots > 0);
    }
    
    // Sort by distance first (nearest parking spaces), then by availability
    filtered.sort((a, b) => {
        // First sort by distance (nearest first)
        if (a.distance !== b.distance) {
            return a.distance - b.distance;
        }
        // Then by availability (more available spots first)
        return b.availabilityPercentage - a.availabilityPercentage;
    });
    
    return filtered;
}

// Get availability status based on percentage
function getAvailabilityStatus(percentage) {
    if (percentage >= 50) return 'excellent';
    if (percentage >= 25) return 'good';
    if (percentage >= 10) return 'limited';
    return 'very-limited';
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
}

// Display search results
function displayResults(results) {
    currentResults = results;
    const resultsList = document.getElementById('resultsList');
    
    if (results.length === 0) {
        resultsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No parking spots found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    resultsList.innerHTML = results.map(parking => createParkingCard(parking)).join('');
}

// Create parking card HTML
function createParkingCard(parking) {
    const distanceText = parking.distance < 1 
        ? `${Math.round(parking.distance * 1000)}m` 
        : `${parking.distance.toFixed(1)}km`;
    
    const availabilityPercentage = parking.availabilityPercentage || Math.round(((parking.capacity - parking.occupied) / parking.capacity) * 100);
    const availableSpots = parking.availableSpots || (parking.capacity - parking.occupied);
    const availabilityStatus = parking.availabilityStatus || getAvailabilityStatus(availabilityPercentage);
    
    const featuresHtml = parking.features.map(feature => 
        `<span class="feature-tag">${feature}</span>`
    ).join('');
    
    // Availability status badge
    const availabilityBadge = getAvailabilityBadge(availabilityStatus, availableSpots);
    
    return `
        <div class="parking-card" data-id="${parking.id}" onclick="selectParkingFromCard(${parking.id})">
            <div class="parking-header">
                <div class="parking-name">${parking.name}</div>
            </div>
            <div class="availability-status">
                ${availabilityBadge}
            </div>
            <div class="parking-details">
                <div class="parking-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${distanceText}</span>
                </div>
                <div class="parking-detail">
                    <i class="fas fa-clock"></i>
                    <span>${parking.duration}</span>
                </div>
                <div class="parking-detail">
                    <i class="fas fa-star"></i>
                    <span>${parking.rating}</span>
                </div>
                <div class="parking-detail">
                    <i class="fas fa-car"></i>
                    <span>${availableSpots} spots available</span>
                </div>
            </div>
            <div class="parking-features">
                ${featuresHtml}
            </div>
            <div class="availability-bar">
                <div class="availability-fill" style="width: ${availabilityPercentage}%"></div>
            </div>
            <div class="parking-actions">
                <button class="btn-directions" onclick="event.stopPropagation(); getDirections(${parking.id})">
                    <i class="fas fa-directions"></i>
                    Directions
                </button>
            </div>
        </div>
    `;
}

// Get availability badge HTML
function getAvailabilityBadge(status, availableSpots) {
    const badges = {
        'excellent': {
            text: 'Excellent Availability',
            class: 'badge-excellent',
            icon: 'fas fa-check-circle'
        },
        'good': {
            text: 'Good Availability',
            class: 'badge-good',
            icon: 'fas fa-check'
        },
        'limited': {
            text: 'Limited Spots',
            class: 'badge-limited',
            icon: 'fas fa-exclamation-triangle'
        },
        'very-limited': {
            text: 'Very Limited',
            class: 'badge-very-limited',
            icon: 'fas fa-exclamation-circle'
        }
    };
    
    const badge = badges[status] || badges['limited'];
    
    return `
        <div class="availability-badge ${badge.class}">
            <i class="${badge.icon}"></i>
            <span>${badge.text}</span>
            <span class="spot-count">(${availableSpots} spots)</span>
        </div>
    `;
}

// Select parking from card
function selectParkingFromCard(parkingId) {
    const parking = currentResults.find(p => p.id === parkingId);
    if (parking) {
        selectParking(parking);
    }
}

// Select parking spot
function selectParking(parking) {
    // Clear previous selection
    clearSelectedParking();
    
    // Set as selected
    selectedParking = parking;
    
    // Update card appearance
    const card = document.querySelector(`[data-id="${parking.id}"]`);
    if (card) {
        card.classList.add('active');
    }
    
    // Update marker appearance
    if (parking.marker) {
        const occupiedPercentage = (parking.occupied / parking.capacity) * 100;
        let markerColor = '#059669';
        if (occupiedPercentage >= 90) markerColor = '#dc2626';
        else if (occupiedPercentage >= 70) markerColor = '#f59e0b';
        
        // Get parking icon and type text based on type
        let parkingIcon = '';
        let parkingTypeText = '';
        switch(parking.type) {
            case 'garage':
                parkingIcon = '🏢';
                parkingTypeText = 'GARAGE';
                break;
            case 'street':
                parkingIcon = '🅿️';
                parkingTypeText = 'STREET';
                break;
            case 'lot':
                parkingIcon = '🅿️';
                parkingTypeText = 'LOT';
                break;
            case 'valet':
                parkingIcon = '🚗';
                parkingTypeText = 'VALET';
                break;
            default:
                parkingIcon = '🅿️';
                parkingTypeText = 'PARKING';
        }
        
        const availableSpots = parking.capacity - parking.occupied;
        const availablePercentage = Math.round((availableSpots / parking.capacity) * 100);
        
        // Update marker icon with selected style and detailed info
        const newIcon = L.divIcon({
            className: 'parking-marker selected',
            html: `
                <div style="
                    background-color: ${markerColor}; 
                    width: 70px; 
                    height: 55px; 
                    border-radius: 8px; 
                    border: 3px solid white; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    font-family: Arial, sans-serif;
                    animation: pulse 2s infinite;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 3px;
                        margin-bottom: 2px;
                    ">
                        <span style="font-size: 16px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));">${parkingIcon}</span>
                        <span style="
                            color: white;
                            font-size: 8px;
                            font-weight: bold;
                            text-shadow: 0 1px 2px rgba(0,0,0,0.7);
                            letter-spacing: 0.3px;
                        ">${parkingTypeText}</span>
                    </div>
                    <div style="
                        color: white;
                        font-size: 12px;
                        font-weight: bold;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.7);
                        text-align: center;
                        line-height: 1.0;
                    ">
                        <div>${availableSpots} SPOTS</div>
                        
                    </div>
                    <div style="
                        position: absolute;
                        bottom: -8px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: white;
                        color: ${markerColor};
                        padding: 2px 6px;
                        border-radius: 10px;
                        font-size: 9px;
                        font-weight: bold;
                        white-space: nowrap;
                        border: 2px solid ${markerColor};
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        min-width: 25px;
                        text-align: center;
                    ">${availablePercentage}%</div>
                </div>
            `,
            iconSize: [70, 65],
            iconAnchor: [35, 32]
        });
        
        parking.marker.setIcon(newIcon);
        
        // Center map on selected parking
        map.setView(parking.coordinates, 16);
        
        // Open popup
        parking.marker.openPopup();
    }
    
    // Show parking details modal
    showParkingDetails(parking);
}

// Clear selected parking
function clearSelectedParking() {
    if (selectedParking) {
        // Clear card selection
        const card = document.querySelector(`[data-id="${selectedParking.id}"]`);
        if (card) {
            card.classList.remove('active');
        }
        
        // Reset marker
        if (selectedParking.marker) {
            const occupiedPercentage = (selectedParking.occupied / selectedParking.capacity) * 100;
            let markerColor = '#059669';
            if (occupiedPercentage >= 90) markerColor = '#dc2626';
            else if (occupiedPercentage >= 70) markerColor = '#f59e0b';
            
            // Get parking icon and type text based on type
            let parkingIcon = '';
            let parkingTypeText = '';
            switch(selectedParking.type) {
                case 'garage':
                    parkingIcon = '🏢';
                    parkingTypeText = 'GARAGE';
                    break;
                case 'street':
                    parkingIcon = '🅿️';
                    parkingTypeText = 'STREET';
                    break;
                case 'lot':
                    parkingIcon = '🅿️';
                    parkingTypeText = 'LOT';
                    break;
                case 'valet':
                    parkingIcon = '🚗';
                    parkingTypeText = 'VALET';
                    break;
                default:
                    parkingIcon = '🅿️';
                    parkingTypeText = 'PARKING';
            }
            
            const availableSpots = selectedParking.capacity - selectedParking.occupied;
            const availablePercentage = Math.round((availableSpots / selectedParking.capacity) * 100);
            
            const originalIcon = L.divIcon({
                className: 'parking-marker',
                html: `
                    <div style="
                        background-color: ${markerColor}; 
                        width: 60px; 
                        height: 45px; 
                        border-radius: 6px; 
                        border: 2px solid white; 
                        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        font-family: Arial, sans-serif;
                    ">
                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 3px;
                            margin-bottom: 1px;
                        ">
                            <span style="font-size: 14px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));">${parkingIcon}</span>
                            <span style="
                                color: white;
                                font-size: 7px;
                                font-weight: bold;
                                text-shadow: 0 1px 2px rgba(0,0,0,0.7);
                                letter-spacing: 0.3px;
                            ">${parkingTypeText}</span>
                        </div>
                        <div style="
                            color: white;
                            font-size: 10px;
                            font-weight: bold;
                            text-shadow: 0 1px 2px rgba(0,0,0,0.7);
                            text-align: center;
                            line-height: 1.0;
                        ">
                            <div>${availableSpots} SPOTS</div>
                            
                        </div>
                        <div style="
                            position: absolute;
                            bottom: -6px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: white;
                            color: ${markerColor};
                            padding: 1px 4px;
                            border-radius: 8px;
                            font-size: 8px;
                            font-weight: bold;
                            white-space: nowrap;
                            border: 1px solid ${markerColor};
                            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                            min-width: 20px;
                            text-align: center;
                        ">${availablePercentage}%</div>
                    </div>
                `,
                iconSize: [60, 55],
                iconAnchor: [30, 27]
            });
            
            selectedParking.marker.setIcon(originalIcon);
        }
        
        selectedParking = null;
    }
}

// Show parking details modal
function showParkingDetails(parking) {
    const modalOverlay = document.getElementById('parkingModalOverlay');
    const modalTitle = document.getElementById('parkingModalTitle');
    const modalContent = document.getElementById('parkingModalContent');
    
    modalTitle.textContent = parking.name;
    
    const availabilityPercentage = Math.round(((parking.capacity - parking.occupied) / parking.capacity) * 100);
    
    modalContent.innerHTML = `
        <div class="parking-details-modal">
            <div class="parking-info">
                <div class="info-row">
                    <span class="label">Address:</span>
                    <span class="value">${parking.address}</span>
                </div>
                
                <div class="info-row">
                    <span class="label">Duration:</span>
                    <span class="value">${parking.duration}</span>
                </div>
                <div class="info-row">
                    <span class="label">Rating:</span>
                    <span class="value">${parking.rating}/5 ⭐</span>
                </div>
                <div class="info-row">
                    <span class="label">Availability:</span>
                    <span class="value">${parking.availability}</span>
                </div>
            </div>
            
            <div class="availability-section">
                <h4>Availability</h4>
                <div class="availability-bar">
                    <div class="availability-fill" style="width: ${availabilityPercentage}%"></div>
                </div>
                <p class="availability-text">${availabilityPercentage}% available (${parking.capacity - parking.occupied} of ${parking.capacity} spots)</p>
            </div>
            
            <div class="features-section">
                <h4>Features</h4>
                <div class="features-list">
                    ${parking.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-directions" onclick="getDirections(${parking.id})">
                    <i class="fas fa-directions"></i>
                    Directions
                </button>
                <button class="btn-secondary" onclick="closeParkingModal()">Close</button>
            </div>
        </div>
    `;
    
    modalOverlay.classList.add('show');
}

// Close parking modal
function closeParkingModal() {
    const modalOverlay = document.getElementById('parkingModalOverlay');
    modalOverlay.classList.remove('show');
    clearSelectedParking();
}

// Sort results
function sortResults(sortBy) {
    if (currentResults.length === 0) return;
    
    const sorted = [...currentResults].sort((a, b) => {
        switch (sortBy) {
            case 'price':
                return 0;
            case 'distance':
                return a.distance - b.distance;
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });
    
    displayResults(sorted);
    
    // Update active button
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Update map markers based on filtered results
function updateMapMarkers(results) {
    // Hide all markers
    parkingMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    
    // Show only filtered markers
    results.forEach(parking => {
        if (parking.marker) {
            map.addLayer(parking.marker);
        }
    });
}

// Toggle search panel
function toggleSearchPanel() {
    const searchPanel = document.getElementById('searchPanel');
    const toggleBtn = document.getElementById('togglePanel');
    const floatingToggleBtn = document.getElementById('floatingToggleBtn');
    
    searchPanel.classList.toggle('collapsed');
    
    // Update button icon
    const icon = toggleBtn.querySelector('i');
    if (searchPanel.classList.contains('collapsed')) {
        icon.className = 'fas fa-chevron-right';
        // Show floating toggle button
        floatingToggleBtn.style.display = 'flex';
    } else {
        icon.className = 'fas fa-chevron-left';
        // Hide floating toggle button
        floatingToggleBtn.style.display = 'none';
    }
    
    // Fix map resizing issue by invalidating size after a short delay
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
        }
    }, 300);
}

// Mobile-specific improvements
function initializeMobileFeatures() {
    // Add touch event listeners for better mobile interaction
    const searchPanel = document.getElementById('searchPanel');
    const searchHeader = document.querySelector('.search-header');
    
    // Make search header clickable on mobile
    if (window.innerWidth <= 768) {
        if (searchHeader) {
            searchHeader.addEventListener('click', toggleSearchPanel);
            searchHeader.style.cursor = 'pointer';
        }
    }
    
    // Prevent zoom on input focus (iOS)
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth <= 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        });
        
        input.addEventListener('blur', function() {
            if (window.innerWidth <= 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            }
        });
    });
    
    // Improve map touch interaction
    if (map) {
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        
        // Re-enable zoom on desktop
        if (window.innerWidth > 768) {
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
        }
    }
}

// Handle window resize
function handleResize() {
    const searchPanel = document.getElementById('searchPanel');
    const searchHeader = document.querySelector('.search-header');
    
    if (window.innerWidth <= 768) {
        // Mobile layout
        searchHeader.addEventListener('click', toggleSearchPanel);
        searchHeader.style.cursor = 'pointer';
        
        // Disable map zoom controls on mobile
        if (map) {
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
        }
    } else {
        // Desktop layout
        searchHeader.removeEventListener('click', toggleSearchPanel);
        searchHeader.style.cursor = 'default';
        
        // Re-enable map zoom controls on desktop
        if (map) {
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
        }
    }
}

// Get current location
async function reverseGeocode(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
        const res = await fetch(url);
        if (!res.ok) return 'Current Location';
        const data = await res.json();
        if (data && data.address) {
            const a = data.address;
            const locality = a.neighbourhood || a.suburb || a.village || a.town || a.city;
            const parts = [a.road, locality, 'Davao City'].filter(Boolean);
            return parts.join(', ');
        }
        return data.display_name || 'Current Location';
    } catch (_) {
        return 'Current Location';
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by this browser.', 'error');
        return;
    }

    showNotification('Getting your location with high accuracy…', 'info');

    const geoOpts = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };

    navigator.geolocation.getCurrentPosition(
        async function(position) {
            userLocation = [position.coords.latitude, position.coords.longitude];

            // Add/replace user marker
            if (userMarker) {
                try { map.removeLayer(userMarker); } catch (_) {}
            }
            userMarker = L.marker(userLocation, {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background-color: #2563eb; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                })
            }).addTo(map);

            // Center map on user location
            map.setView(userLocation, 16);

            // Reverse geocode to show accurate street/locality
            const label = await reverseGeocode(position.coords.latitude, position.coords.longitude);
            const input = document.getElementById('locationInput');
            if (input) input.value = label || 'Current Location';

            const acc = Math.round(position.coords.accuracy || 0);
            showNotification(`Location found (±${acc}m).`, 'success');
        },
        function(error) {
            let message = 'Unable to retrieve your location.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = 'Location access denied by user.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    message = 'Location request timed out.';
                    break;
            }
            showNotification(message + ' Using map locate fallback.', 'error');
            // Leaflet fallback
            try {
                map.locate({ setView: true, maxZoom: 15, enableHighAccuracy: true });
            } catch (_) {}
        },
        geoOpts
    );
}

// Center map on search area
function centerMapOnSearch() {
    if (currentResults.length > 0) {
        const group = new L.featureGroup(currentResults.map(p => p.marker));
        map.fitBounds(group.getBounds().pad(0.1));
    } else {
        map.setView([7.0700, 125.6100], 13);
    }
}

// Toggle traffic layer (placeholder)
function toggleTrafficLayer() {
    const btn = document.getElementById('toggleTrafficBtn');
    if (!btn) return;
    const enabled = btn.classList.toggle('active');
    if (enabled) {
        startTrafficPolling();
        enableTrafficOverlay();
        // No popup notification; icon color indicates status
    } else {
        stopTrafficPolling();
        setTrafficLevel('none');
        disableTrafficOverlay();
        // No popup notification on disable
    }
}

// Toggle satellite view
function toggleSatelliteView() {
    const btn = document.getElementById('toggleSatelliteBtn');
    const isActive = btn.classList.contains('active');
    
    if (isActive) {
        // Switch to street map
        map.removeLayer(map.satelliteLayer);
        btn.classList.remove('active');
    } else {
        // Switch to satellite
        map.addLayer(map.satelliteLayer);
        btn.classList.add('active');
    }
}


// Get directions
function getDirections(parkingId) {
    const parking = parkingData.find(p => p.id === parkingId);
    if (!parking) return;

    // Ensure we have a user location
    if (!userLocation) {
        showNotification('Getting your current location for routing…', 'info');
        try { getCurrentLocation(); } catch (_) {}
    }
    if (!userLocation) {
        showNotification('Please enable location to show route on the map.', 'error');
        return;
    }

    // Remove existing route control/polyline
    try {
        if (map.routeControl) {
            map.removeControl(map.routeControl);
            map.routeControl = null;
        }
    } catch (_) {}
    if (map.currentRouteLayer) {
        try { map.removeLayer(map.currentRouteLayer); } catch (_) {}
        map.currentRouteLayer = null;
    }

    // Use Leaflet Routing Machine if available, fallback to straight line
    if (window.L && L.Routing && typeof L.Routing.control === 'function') {
        map.routeControl = L.Routing.control({
            waypoints: [
                L.latLng(userLocation[0], userLocation[1]),
                L.latLng(parking.coordinates[0], parking.coordinates[1])
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true
        }).addTo(map);
        // Attach inline close button to the routing panel
        attachRouteCloseButton();
        // Save directions to history
        try {
            const fromLabel = (document.getElementById('locationInput')?.value || 'Location');
            pushMapHistory({ type: 'directions', fromLabel, fromCoords: userLocation, toName: parking.name, toCoords: parking.coordinates, toId: parking.id });
        } catch (_) {}
        const btn = document.getElementById('clearRouteBtn');
        if (btn) btn.style.display = 'inline-block';
        showNotification('Showing route on the map. Click the X to clear.', 'success');
    } else {
        // Fallback: draw straight line polyline
        map.currentRouteLayer = L.polyline([
            userLocation,
            parking.coordinates
        ], { color: '#2563eb', weight: 5 }).addTo(map);
        map.fitBounds(map.currentRouteLayer.getBounds(), { padding: [40, 40] });
        const btn = document.getElementById('clearRouteBtn');
        if (btn) btn.style.display = 'inline-block';
        showNotification('Routing library unavailable; showing straight-line path. Click the X to clear.', 'info');
    }
}

// --- Traffic Indicator (real-time heuristic) ---
let trafficPollHandle = null;

function computeTrafficLevel() {
    const h = new Date().getHours();
    // Heuristic: heavy in rush hours, moderate midday, light otherwise
    let level = 'light';
    if ((h >= 7 && h <= 9) || (h >= 17 && h <= 20)) level = 'heavy';
    else if (h >= 11 && h <= 14) level = 'moderate';
    // Small randomness to avoid looking static
    const r = Math.random();
    if (r < 0.08) level = 'heavy';
    else if (r < 0.16) level = 'moderate';
    return level;
}

function setTrafficLevel(level) {
    const btn = document.getElementById('toggleTrafficBtn');
    if (!btn) return;
    // Reset classes
    btn.classList.remove('traffic-light', 'traffic-moderate', 'traffic-heavy', 'traffic-none');
    switch (level) {
        case 'light':
            btn.classList.add('traffic-light');
            btn.title = 'Traffic: Light';
            break;
        case 'moderate':
            btn.classList.add('traffic-moderate');
            btn.title = 'Traffic: Moderate';
            break;
        case 'heavy':
            btn.classList.add('traffic-heavy');
            btn.title = 'Traffic: Heavy';
            break;
        default:
            btn.classList.add('traffic-none');
            btn.title = 'Traffic: Off';
    }
}

function startTrafficPolling() {
    setTrafficLevel(computeTrafficLevel());
    try { if (trafficPollHandle) clearInterval(trafficPollHandle); } catch (_) {}
    trafficPollHandle = setInterval(() => {
        setTrafficLevel(computeTrafficLevel());
    }, 60000); // update every minute
}

function stopTrafficPolling() {
    try { if (trafficPollHandle) clearInterval(trafficPollHandle); } catch (_) {}
    trafficPollHandle = null;
}

// Optional overlay from a real traffic provider
function getTrafficConfig() {
    try {
        const provider = localStorage.getItem('trafficProvider') || '';
        const token = localStorage.getItem('trafficToken') || '';
        return { provider: provider.trim().toLowerCase(), token: token.trim() };
    } catch (_) {
        return { provider: '', token: '' };
    }
}

function enableTrafficOverlay() {
    try {
        const cfg = getTrafficConfig();
        // Remove any existing overlay first
        disableTrafficOverlay();
        if (!cfg.provider || !cfg.token) {
            // No provider configured; keep heuristic only
            return;
        }
        let layer = null;
        if (cfg.provider === 'mapbox') {
            const url = `https://api.mapbox.com/v4/mapbox.mapbox-traffic-v1/{z}/{x}/{y}.png?access_token=${encodeURIComponent(cfg.token)}`;
            layer = L.tileLayer(url, {
                attribution: '© Mapbox © OpenStreetMap',
                maxZoom: 19,
                opacity: 0.85
            });
        } else if (cfg.provider === 'tomtom') {
            const url = `https://api.tomtom.com/traffic/map/4/tile/flow/{z}/{x}/{y}.png?key=${encodeURIComponent(cfg.token)}&style=s1`;
            layer = L.tileLayer(url, {
                attribution: '© TomTom Traffic',
                maxZoom: 19,
                opacity: 0.85
            });
        }
        if (layer) {
            map.trafficOverlay = layer.addTo(map);
        }
    } catch (_) {}
}

function disableTrafficOverlay() {
    try {
        if (map && map.trafficOverlay) {
            map.removeLayer(map.trafficOverlay);
            map.trafficOverlay = null;
        }
    } catch (_) {}
}

// Attach an inline X button to the Leaflet Routing Machine panel
function attachRouteCloseButton() {
    try {
        if (!map || !map.routeControl) return;
        const rcEl = (typeof map.routeControl.getContainer === 'function')
            ? map.routeControl.getContainer()
            : map.routeControl._container;
        if (!rcEl) return;
        // Only attach once
        if (!rcEl.querySelector('.pf-route-close')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'pf-route-close';
            closeBtn.title = 'Clear route';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.addEventListener('click', clearRoute);
            rcEl.style.position = rcEl.style.position || 'relative';
            rcEl.appendChild(closeBtn);
        }

        // Add arrow icon to hide/show the route guide (panel only, keeps route)
        if (!rcEl.querySelector('.pf-route-hide')) {
            const hideBtn = document.createElement('button');
            hideBtn.className = 'pf-route-hide';
            hideBtn.title = 'Hide route';
            hideBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            hideBtn.addEventListener('click', () => {
                try {
                    rcEl.classList.toggle('pf-route-collapsed');
                    // Toggle icon direction
                    const collapsed = rcEl.classList.contains('pf-route-collapsed');
                    hideBtn.innerHTML = collapsed ? '<i class="fas fa-chevron-up"></i>' : '<i class="fas fa-chevron-down"></i>';
                    // Toggle floating show button visibility
                    const showBtn = document.getElementById('pf-route-show');
                    if (showBtn) {
                        showBtn.style.display = collapsed ? 'flex' : 'none';
                    }
                } catch (_) {}
            });
            rcEl.style.position = rcEl.style.position || 'relative';
            rcEl.appendChild(hideBtn);
        }

        // Create a floating "show route guide" button that appears when panel is hidden
        if (!document.getElementById('pf-route-show')) {
            const showBtn = document.createElement('button');
            showBtn.id = 'pf-route-show';
            showBtn.className = 'pf-route-show';
            showBtn.title = 'Show route';
            showBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            showBtn.style.display = 'none';
            showBtn.addEventListener('click', () => {
                try {
                    rcEl.classList.remove('pf-route-collapsed');
                    // Also set hide arrow to down again
                    const hideArrow = rcEl.querySelector('.pf-route-hide');
                    if (hideArrow) hideArrow.innerHTML = '<i class="fas fa-chevron-down"></i>';
                    // Hide floating button
                    showBtn.style.display = 'none';
                } catch (_) {}
            });
            // Place next to the map controls block (to the left of the buttons)
            const controls = document.querySelector('.map-controls');
            if (controls) {
                controls.appendChild(showBtn);
            } else {
                document.body.appendChild(showBtn);
            }
        }

        // Inject styles once
        if (!document.getElementById('pf-route-close-style')) {
            const s = document.createElement('style');
            s.id = 'pf-route-close-style';
            s.textContent = `
              .pf-route-close { position:absolute; top:6px; right:6px; background:#fff; border:1px solid #e2e8f0; border-radius:6px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.15); }
              .pf-route-close i { color:#64748b; }
              .pf-route-close:hover i { color:#2563eb; }
              .pf-route-hide { position:absolute; top:6px; left:6px; background:#fff; border:1px solid #e2e8f0; border-radius:6px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.15); }
              .pf-route-hide i { color:#64748b; }
              .pf-route-hide:hover i { color:#2563eb; }
              .pf-route-collapsed { display: none !important; }
              .pf-route-show { position: absolute; top: 0; left: -36px; background:#fff; border:1px solid #e2e8f0; border-radius:6px; width:28px; height:28px; display:none; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.15); z-index: 1000; }
              .pf-route-show i { color:#64748b; }
              .pf-route-show:hover i { color:#2563eb; }
            `;
            document.head.appendChild(s);
        }
    } catch (_) {}
}

// Clear current route (control or polyline)
function clearRoute() {
    try {
        if (map && map.routeControl) {
            try { map.removeControl(map.routeControl); } catch (_) {}
            map.routeControl = null;
        }
        if (map && map.currentRouteLayer) {
            try { map.removeLayer(map.currentRouteLayer); } catch (_) {}
            map.currentRouteLayer = null;
        }
        const btn = document.getElementById('clearRouteBtn');
        if (btn) btn.style.display = 'none';
        const showBtn = document.getElementById('pf-route-show');
        if (showBtn) showBtn.style.display = 'none';
        showNotification('Route cleared.', 'info');
    } catch (_) {}
}

// Quick search function
async function quickSearch(location) {
    // Set the location input
    document.getElementById('locationInput').value = location;
    
    // Show loading notification
    showNotification('Searching for location...', 'info');
    
    try {
        // Use real-time geocoding service
        const searchCoordinates = await geocodeLocationRealTime(location);
        
        if (searchCoordinates) {
            // Center map on search location
            map.setView(searchCoordinates, 15);
            
            // Filter and display parking data
            const filteredResults = filterParkingData('', '', '', searchCoordinates, '');
            const nearestResults = filteredResults.sort((a, b) => a.distance - b.distance);
            
            // Display results
            displayResults(nearestResults);
            updateMapMarkers(nearestResults);
            showSearchLocationMarker(searchCoordinates, location);
            
            if (nearestResults.length > 0) {
                const nearestDistance = nearestResults[0].distance;
                showNotification(`Found ${nearestResults.length} parking spots near ${location}. Nearest is ${nearestDistance.toFixed(1)}km away.`, 'success');
            } else {
                showNotification('No parking spots found near this location.', 'error');
            }
        } else {
            showNotification('Location not found. Please try a different search.', 'error');
        }
    } catch (error) {
        console.error('Quick search error:', error);
        showNotification('Error searching location. Please try again.', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Authentication functions (reused from main site)
function setupAuthEventListeners() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authModalOverlay = document.getElementById('authModalOverlay');
    const closeAuthModalBtn = document.getElementById('closeAuthModal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const userProfileBtn = document.getElementById('userProfileBtn');

    // Only bind modal open on button elements; links navigate directly
    if (loginBtn && loginBtn.tagName === 'BUTTON') {
        loginBtn.addEventListener('click', () => openAuthModal('login'));
    }
    if (signupBtn && signupBtn.tagName === 'BUTTON') {
        signupBtn.addEventListener('click', () => openAuthModal('signup'));
    }
    logoutBtn.addEventListener('click', logout);
    closeAuthModalBtn.addEventListener('click', closeAuthModal);
    authModalOverlay.addEventListener('click', (e) => {
        if (e.target === authModalOverlay) {
            closeAuthModal();
        }
    });
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('signup');
    });
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('login');
    });
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    if (userProfileBtn) userProfileBtn.addEventListener('click', toggleUserDropdown);
    setupPasswordToggles();
}

function openAuthModal(type) {
    const authModalOverlay = document.getElementById('authModalOverlay');
    const authModalTitle = document.getElementById('authModalTitle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    authModalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    if (type === 'login') {
        authModalTitle.textContent = 'Sign In';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        authModalTitle.textContent = 'Sign Up';
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
    
    clearFormErrors();
}

function closeAuthModal() {
    const authModalOverlay = document.getElementById('authModalOverlay');
    authModalOverlay.classList.remove('show');
    document.body.style.overflow = '';
    clearFormErrors();
}

function switchAuthForm(type) {
    const authModalTitle = document.getElementById('authModalTitle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (type === 'signup') {
        authModalTitle.textContent = 'Sign Up';
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    } else {
        authModalTitle.textContent = 'Sign In';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    }
    
    clearFormErrors();
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    clearFormErrors();
    
    if (!validateLoginForm(email, password)) {
        return;
    }
    
    setButtonLoading('loginSubmitBtn', true);
    
    fetch(getApiUrl('/api/auth_login.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Login failed');
        const { user } = data;
        login(user, rememberMe);
        setButtonLoading('loginSubmitBtn', false);
        closeAuthModal();
        showNotification('Welcome back!', 'success');
    }).catch(err => {
        setButtonLoading('loginSubmitBtn', false);
        showFieldError('loginPassword', err.message || 'Failed to sign in');
    });
}

function handleSignup(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('signupFirstName').value.trim(),
        lastName: document.getElementById('signupLastName').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('signupConfirmPassword').value,
        agreeTerms: document.getElementById('agreeTerms').checked
    };
    
    clearFormErrors();
    
    if (!validateSignupForm(formData)) {
        return;
    }
    
    setButtonLoading('signupSubmitBtn', true);
    
    fetch(getApiUrl('/api/auth_signup.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: '',
            password: formData.password
        })
    }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        setButtonLoading('signupSubmitBtn', false);
        // Switch to Sign In view after successful signup
        switchAuthForm('login');
        showNotification('Account created! Please sign in.', 'success');
    }).catch(err => {
        setButtonLoading('signupSubmitBtn', false);
        showFieldError('signupEmail', err.message || 'Failed to sign up');
    });
}

function validateLoginForm(email, password) {
    let isValid = true;
    
    if (!email) {
        showFieldError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('loginEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password) {
        showFieldError('loginPassword', 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

function validateSignupForm(data) {
    let isValid = true;
    
    if (!data.firstName) {
        showFieldError('signupFirstName', 'First name is required');
        isValid = false;
    }
    
    if (!data.lastName) {
        showFieldError('signupLastName', 'Last name is required');
        isValid = false;
    }
    
    if (!data.email) {
        showFieldError('signupEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldError('signupEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password: not strict, just require non-empty
    if (!data.password) {
        showFieldError('signupPassword', 'Password is required');
        isValid = false;
    }
    
    if (!data.confirmPassword) {
        showFieldError('signupConfirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (data.password !== data.confirmPassword) {
        showFieldError('signupConfirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Do not force agree terms
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const inputGroup = document.querySelector(`#${fieldId}`).closest('.input-group') || 
                      document.querySelector(`#${fieldId}`).closest('.form-group');
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    inputGroup.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputGroups = document.querySelectorAll('.input-group');
    
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });
    
    inputGroups.forEach(group => {
        group.classList.remove('error', 'success');
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    
    if (isLoading) {
        button.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'block';
    } else {
        button.disabled = false;
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    }
}

function login(user, rememberMe) {
    currentUser = user;
    isAuthenticated = true;
    
    if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        sessionStorage.setItem('user', JSON.stringify(user));
    }
    
    updateAuthUI();
}

function logout() {
    currentUser = null;
    isAuthenticated = false;
    
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    updateAuthUI();
    try { showNotification('You have been logged out', 'info'); } catch (_) {}
    try { window.location.href = '../index.php'; } catch (_) {}
}

function checkAuthState() {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            isAuthenticated = true;
            updateAuthUI();
        } catch (error) {
            console.error('Error parsing stored user data:', error);
            logout();
        }
    }
}

function getApiUrl(path) {
    if (window.PF_API_BASE) return `${window.PF_API_BASE}${path}`;
    if (window.location.protocol === 'file:') {
        return `http://localhost/PP${path}`;
    }
    const { origin, pathname } = window.location;
    if (pathname.includes('/pp-test/')) {
        const base = origin + pathname.split('/pp-test/')[0];
        return `${base}${path}`;
    }
    const segs = pathname.split('/');
    const ppIndex = segs.lastIndexOf('PP');
    if (ppIndex !== -1) {
        const base = origin + '/' + segs.slice(1, ppIndex + 1).join('/');
        return `${base}${path}`;
    }
    return `${origin}/PP${path}`;
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const adminLink = document.getElementById('adminLink');
    
    if (isAuthenticated && currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        if (adminLink) adminLink.style.display = currentUser.isAdmin ? 'inline-block' : 'none';
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}

function toggleUserDropdown(e) {
    const btn = e && e.currentTarget ? e.currentTarget : document.getElementById('userProfileBtn');
    const wrapper = btn ? btn.closest('.user-dropdown') : document.querySelector('.user-dropdown');
    if (wrapper) wrapper.classList.toggle('active');
}

function setupPasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdowns = document.querySelectorAll('.user-dropdown');
    dropdowns.forEach(dd => {
        if (!dd.contains(e.target)) dd.classList.remove('active');
    });
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const authModalOverlay = document.getElementById('authModalOverlay');
        const parkingModalOverlay = document.getElementById('parkingModalOverlay');
        
        if (authModalOverlay.classList.contains('show')) {
            closeAuthModal();
        }
        if (parkingModalOverlay.classList.contains('show')) {
            closeParkingModal();
        }
    }
  });

// Add additional styles for notifications and availability bars
const additionalStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #059669;
    }
    
    .notification-error {
        border-left: 4px solid #dc2626;
    }
    
    .notification-info {
        border-left: 4px solid #2563eb;
    }
    
    .availability-bar {
        width: 100%;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        margin: 0.5rem 0;
    }
    
    .availability-fill {
        height: 100%;
        background: linear-gradient(90deg, #dc2626 0%, #f59e0b 50%, #059669 100%);
        transition: width 0.3s ease;
    }
    
    .availability-text {
        font-size: 0.8rem;
        color: #64748b;
        text-align: center;
        margin: 0;
    }
    
    .parking-popup {
        min-width: 200px;
    }
    
    .parking-popup h4 {
        margin: 0 0 0.5rem 0;
        color: #1e293b;
        font-size: 1rem;
    }
    
    .parking-popup p {
        margin: 0.25rem 0;
        font-size: 0.9rem;
        color: #64748b;
    }
    
    .parking-popup .availability-bar {
        margin: 0.5rem 0;
    }
    
    .parking-details-modal {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .parking-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .info-row .label {
        font-weight: 500;
        color: #374151;
    }
    
    .info-row .value {
        color: #64748b;
    }
    
    .info-row .value.price {
        font-weight: 700;
        color: #059669;
        font-size: 1.1rem;
    }
    
    .availability-section h4,
    .features-section h4 {
        margin: 0 0 0.75rem 0;
        color: #1e293b;
        font-size: 1rem;
    }
    
    .features-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1rem;
    }
    
    .no-results {
        text-align: center;
        padding: 2rem;
        color: #64748b;
    }
    
    .no-results i {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #cbd5e1;
    }
    
    .no-results h3 {
        margin: 0 0 0.5rem 0;
        color: #374151;
    }
    
    .no-results p {
        margin: 0;
        font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
        }
        
        .notification.show {
            transform: translateY(0);
        }
        
        .modal-actions {
            flex-direction: column;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Settings Modal Functions
function openSettingsModal() {
    if (!currentUser) {
        showNotification('Please sign in first', 'error');
        return;
    }
    
    const settingsModalOverlay = document.getElementById('settingsModalOverlay');
    settingsModalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSettingsModal() {
    const settingsModalOverlay = document.getElementById('settingsModalOverlay');
    settingsModalOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

function switchSettingsTab(tab) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

function changePassword() {
    if (!currentUser) return;
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('New password must be at least 6 characters', 'error');
        return;
    }
    
    const payload = {
        action: 'change_password',
        user_id: currentUser.id,
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
    };
    
    fetch(getApiUrl('/api/settings.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Failed to change password');
        showNotification('Password changed successfully', 'success');
        closeSettingsModal();
    }).catch(err => {
        showNotification(err.message || 'Failed to change password', 'error');
    });
}

function deleteAccount() {
    if (!currentUser) return;
    
    const password = document.getElementById('deletePassword').value;
    
    if (!password) {
        showNotification('Please enter your current password', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
    }
    
    const payload = {
        action: 'delete_account',
        user_id: currentUser.id,
        current_password: password
    };
    
    fetch(getApiUrl('/api/settings.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Failed to delete account');
        showNotification('Account deleted successfully', 'success');
        closeSettingsModal();
        logout();
    }).catch(err => {
        showNotification(err.message || 'Failed to delete account', 'error');
    });
}

// Add settings modal styles
const settingsStyles = `
    .settings-modal {
        max-width: 600px;
    }
    
    .settings-tabs {
        display: flex;
        border-bottom: 2px solid #e2e8f0;
        margin-bottom: 2rem;
    }
    
    .tab-btn {
        background: none;
        border: none;
        padding: 1rem 2rem;
        cursor: pointer;
        font-weight: 500;
        color: #64748b;
        border-bottom: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .tab-btn.active {
        color: #2563eb;
        border-bottom-color: #2563eb;
    }
    
    .tab-btn:hover {
        color: #2563eb;
    }
    
    .settings-tab {
        display: none;
    }
    
    .settings-tab.active {
        display: block;
    }
    
    .settings-form {
        margin: 1rem 0;
    }
    
    .settings-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #374151;
    }
    
    .settings-form input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-size: 1rem;
    }
    
    .settings-form input:focus {
        outline: none;
        border-color: #2563eb;
    }
    
    .delete-warning {
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        text-align: center;
    }
    
    .delete-warning i {
        color: #dc2626;
        font-size: 2rem;
        margin-bottom: 1rem;
    }
    
    .delete-warning h4 {
        color: #dc2626;
        margin: 0 0 0.5rem 0;
    }
    
    .delete-warning p {
        color: #7f1d1d;
        margin: 0;
    }
    
    .btn-danger {
        background: #dc2626;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-danger:hover {
        background: #b91c1c;
    }
`;

// Inject settings styles
const settingsStyleSheet = document.createElement('style');
settingsStyleSheet.textContent = settingsStyles;
document.head.appendChild(settingsStyleSheet);
