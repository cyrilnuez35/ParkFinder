// Sample parking data
const parkingData = [
    {
        id: 1,
        name: "Downtown Garage",
        type: "garage",
        address: "123 Main St, Downtown",
        distance: "0.2 miles",
        price: "$8.00",
        duration: "2 hours",
        availability: "15 spots available",
        rating: 4.5,
        features: ["Covered", "Security", "EV Charging"],
        coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
        id: 2,
        name: "Street Parking - Broadway",
        type: "street",
        address: "456 Broadway, Downtown",
        distance: "0.3 miles",
        price: "$4.00",
        duration: "2 hours",
        availability: "3 spots available",
        rating: 4.2,
        features: ["Metered", "2-hour limit"],
        coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
        id: 3,
        name: "Central Parking Lot",
        type: "lot",
        address: "789 Central Ave, Midtown",
        distance: "0.5 miles",
        price: "$6.00",
        duration: "4 hours",
        availability: "8 spots available",
        rating: 4.0,
        features: ["Open lot", "24/7 access"],
        coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    {
        id: 4,
        name: "Valet Service - Hotel Plaza",
        type: "valet",
        address: "321 Plaza St, Uptown",
        distance: "0.7 miles",
        price: "$15.00",
        duration: "All day",
        availability: "Available",
        rating: 4.8,
        features: ["Valet", "Concierge", "Premium"],
        coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    {
        id: 5,
        name: "Underground Garage",
        type: "garage",
        address: "654 Underground Blvd, Financial District",
        distance: "0.4 miles",
        price: "$12.00",
        duration: "8 hours",
        availability: "22 spots available",
        rating: 4.3,
        features: ["Underground", "Security", "Monthly rates"],
        coordinates: { lat: 40.7074, lng: -74.0113 }
    },
    {
        id: 6,
        name: "Street Parking - 5th Avenue",
        type: "street",
        address: "987 5th Ave, Midtown",
        distance: "0.6 miles",
        price: "$5.00",
        duration: "1 hour",
        availability: "1 spot available",
        rating: 3.9,
        features: ["Metered", "1-hour limit"],
        coordinates: { lat: 40.7505, lng: -73.9934 }
    }
];

// DOM Elements
const searchForm = document.getElementById('searchForm');
const locationInput = document.getElementById('locationInput');
const resultsSection = document.getElementById('resultsSection');
const resultsList = document.getElementById('resultsList');
const mapContainer = document.getElementById('mapContainer');
const sortByPriceBtn = document.getElementById('sortByPrice');
const sortByDistanceBtn = document.getElementById('sortByDistance');
const viewToggleBtn = document.getElementById('viewToggle');

// State
let currentResults = [];
let isGridView = false;
let currentUser = null;
let isAuthenticated = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    // Map removed on main page
    checkAuthState();
    setupSmoothScroll();
    setupGlobalCloseButtons();
    // Password policy visual for auth modal (index.php / index2.php)
    (function setupAuthPasswordPolicy() {
        function updatePolicy(pw) {
            const checks = {
                len: pw.length >= 8,
                upper: /[A-Z]/.test(pw),
                lower: /[a-z]/.test(pw),
                digit: /\d/.test(pw),
                special: /[^\w\s]/.test(pw),
                space: !/\s/.test(pw)
            };
            const fill = document.getElementById('pwStrengthFillModal');
            if (fill) {
                const passed = Object.values(checks).filter(Boolean).length;
                const percent = Math.round((passed/6)*100);
                fill.style.width = percent + '%';
                fill.style.background = passed >= 5 ? '#10b981' : passed >= 4 ? '#f59e0b' : '#ef4444';
            }
            function setIcon(id, ok) {
                const el = document.getElementById(id);
                if (el) el.className = ok ? 'fas fa-check policy-ok' : 'fas fa-circle policy-bad';
            }
            setIcon('polLenModal', checks.len);
            setIcon('polUpperModal', checks.upper);
            setIcon('polLowerModal', checks.lower);
            setIcon('polDigitModal', checks.digit);
            setIcon('polSpecialModal', checks.special);
            setIcon('polSpaceModal', checks.space);
        }
        const pwInput = document.getElementById('signupPassword');
        if (pwInput) {
            pwInput.addEventListener('input', function(e){ updatePolicy(e.target.value); });
            // initialize once
            updatePolicy(pwInput.value || '');
        }
    })();
});
// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function() {
    try {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
    } catch (_) {}
});

// Event Listeners
function initializeEventListeners() {
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    if (sortByPriceBtn) {
        sortByPriceBtn.addEventListener('click', () => sortResults('price'));
    }
    if (sortByDistanceBtn) {
        sortByDistanceBtn.addEventListener('click', () => sortResults('distance'));
    }
    if (viewToggleBtn) {
        viewToggleBtn.addEventListener('click', toggleView);
    }
    
    // Authentication event listeners
    setupAuthEventListeners();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Smooth scrolling for Home, About, Contact
function setupSmoothScroll() {
    const links = document.querySelectorAll('.nav-link[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
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
        // Specific handlers by id
        if (closeBtn.id === 'closeAuthModal') {
            closeAuthModal();
            return;
        }
        // Generic: close nearest overlay/modal
        const authOverlay = closeBtn.closest('#authModalOverlay');
        if (authOverlay) {
            closeAuthModal();
            return;
        }
        const modalOverlay = closeBtn.closest('.modal-overlay');
        if (modalOverlay) {
            // Use existing close for generic modals
            if (typeof closeModal === 'function') {
                closeModal();
            } else {
                modalOverlay.classList.remove('show');
            }
        }
    });
}

// Profile UI
function openProfileModal() {
    if (!currentUser) {
        showNotification('Please sign in first', 'error');
        try { openAuthModal('login'); } catch (_) {}
        return;
    }
    const content = `
        <div class="reservation-modal">
            <h3>My Profile</h3>
            <div class="reservation-form">
                <label>First Name</label>
                <input type="text" id="pfFirstName" value="${currentUser.firstName || ''}">
                <label>Last Name</label>
                <input type="text" id="pfLastName" value="${currentUser.lastName || ''}">
                <label>Email</label>
                <input type="email" id="pfEmail" value="${currentUser.email || ''}" disabled>
                <label>Phone</label>
                <input type="text" id="pfPhone" value="${currentUser.phone || ''}" inputmode="numeric" pattern="[0-9]*">
                <small style="font-size:0.85rem;color:#64748b;margin-top:4px;display:block;">Ex. 09123456789 or +639123456789</small>
                <label>Vehicle Make</label>
                <input type="text" id="pfVehicleMake" value="">
                <label>Vehicle Plate</label>
                <input type="text" id="pfVehiclePlate" value="">
                <label>Address</label>
                <input type="text" id="pfAddress" value="">
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal()">Close</button>
                <button class="btn-primary" onclick="saveProfile()">Save</button>
            </div>
        </div>
    `;
    showModal(content);
    try {
        const phoneEl = document.getElementById('pfPhone');
        if (phoneEl) {
            phoneEl.addEventListener('input', function(){ this.value = String(this.value||'').replace(/[^0-9]/g,''); });
        }
    } catch (_) {}
    // Load profile extra fields
    fetch(getApiUrl(`/api/profile.php?user_id=${encodeURIComponent(currentUser.id)}`))
        .then(r => r.json()).then(data => {
            if (data && data.profile) {
                document.getElementById('pfVehicleMake').value = data.profile.vehicle_make || '';
                document.getElementById('pfVehiclePlate').value = data.profile.vehicle_plate || '';
                document.getElementById('pfAddress').value = data.profile.address || '';
            }
        }).catch(() => {});
}

function saveProfile() {
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
        // Reflect updated local user fields if provided
        try {
            if (payload.first_name) currentUser.firstName = payload.first_name;
            if (payload.last_name) currentUser.lastName = payload.last_name;
            if (payload.phone) currentUser.phone = payload.phone;
            updateAuthUI();
            // Persist to storage and notify other pages
            try {
                // Persist to BOTH storages to avoid stale data precedence
                localStorage.setItem('user', JSON.stringify(currentUser));
                sessionStorage.setItem('user', JSON.stringify(currentUser));
                // Broadcast change so other open pages update immediately
                localStorage.setItem('pf_user_updated', String(Date.now()));
            } catch (_) {}
        } catch (_) {}
        showNotification('Profile saved', 'success');
        closeModal();
    }).catch(err => {
        showNotification(err.message || 'Failed to save profile', 'error');
    });
}

// Sync user name/phone across tabs/pages
try {
    window.addEventListener('storage', function(e) {
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
} catch (_) {}

// Settings UI
function openSettingsModal() {
    if (!currentUser) {
        showNotification('Please sign in first', 'error');
        return;
    }
    const content = `
        <div class="settings-modal">
            <h3>Account Settings</h3>
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
                    <button class="btn-secondary" onclick="closeModal()">Cancel</button>
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
                    <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                    <button class="btn-danger" onclick="deleteAccount()">Delete Account</button>
                </div>
            </div>
        </div>
    `;
    showModal(content);
}

// Notifications UI (users)
function openNotificationsModal() {
    (async () => {
        try {
            // Merge local and server announcements
            const localRaw = localStorage.getItem('pf_notifications');
            let list = [];
            try { list = JSON.parse(localRaw || '[]') || []; } catch (_) { list = []; }
            const res = await fetch(getApiUrl('/api/announcements.php'));
            const data = await res.json();
            const serverItems = Array.isArray(data.items) ? data.items.map(it => ({
                title: it.title,
                message: it.message,
                type: it.severity,
                ts: new Date(it.created_at).getTime() || Date.now()
            })) : [];
            const merged = [...serverItems, ...list].sort((a,b) => (b.ts||0)-(a.ts||0)).slice(0, 30);
            const itemsHtml = merged.map(n => `
                <li style="padding:0.6rem 0; border-bottom:1px solid #e5e7eb;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${n.type==='warning' ? '#f59e0b' : (n.type==='closure' ? '#ef4444' : '#3b82f6')};"></span>
                        <strong>${(n.title || 'Notification')}</strong>
                    </div>
                    <div style="color:#64748b; margin-top:2px;">${(n.message || '')}</div>
                </li>`).join('');
            const content = `
                <div class="reservation-modal">
                    <h3>Notifications</h3>
                    <div class="reservation-form">
                        <ul style="list-style:none; margin:0; padding:0;">${itemsHtml || '<li style="color:#64748b;">No notifications yet</li>'}</ul>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal()">Close</button>
                    </div>
                </div>`;
            showModal(content);
            // Mark as seen: store newest timestamp and hide red dot
            const newestTs = merged.length ? (merged[0].ts || Date.now()) : Date.now();
            try { localStorage.setItem('pf_notifications_seen_ts', String(newestTs)); } catch (_) {}
            const dot = document.getElementById('notifDot');
            if (dot) dot.style.display = 'none';
        } catch (e) {
            showNotification('Unable to open notifications', 'error');
        }
    })();
}

// Search History (shared across pages)
function pushSearchHistory(query) {
    try {
        const key = 'pf_search_history';
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        const entry = { q: String(query || '').trim(), t: Date.now() };
        if (!entry.q) return;
        if (arr.length === 0 || arr[arr.length - 1].q !== entry.q) arr.push(entry);
        while (arr.length > 30) arr.shift();
        localStorage.setItem(key, JSON.stringify(arr));
    } catch (_) {}
}

function openSearchHistoryModal() {
    try {
        const key = 'pf_search_history';
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        const fmt = (ts) => new Date(ts).toLocaleString();
        const items = arr.slice().reverse().map((it) => `
            <li style="display:flex; justify-content:space-between; gap:0.75rem; padding:0.5rem 0; border-bottom:1px solid #eef2f7;">
                <span><i class=\"fas fa-search\" style=\"color:#64748b; margin-right:6px;\"></i>${it.q}</span>
                <span style=\"color:#94a3b8; font-size:0.85rem;\">${fmt(it.t)}</span>
            </li>
        `).join('');
        const content = `
            <div class=\"settings-modal\">
                <h3>Search History</h3>
                <ul style=\"list-style:none; padding:0; margin:0; max-height:50vh; overflow:auto;\">${items || '<li style=\"color:#94a3b8;\">No searches yet</li>'}</ul>
                <div class=\"modal-actions\">
                    <button class=\"btn-secondary\" onclick=\"closeModal()\">Close</button>
                    <button class=\"btn-primary\" onclick=\"(function(){ localStorage.removeItem('${key}'); closeModal(); try{ showNotification('History cleared','info'); }catch(_){}})()\">Clear History</button>
                </div>
            </div>`;
        showModal(content);
    } catch (e) {
        try { showNotification('Unable to open history', 'error'); } catch (_) {}
    }
}

// Red dot indicator for unseen notifications on index page
async function updateNotifDot() {
    try {
        const dot = document.getElementById('notifDot');
        if (!dot) return;
        const res = await fetch(getApiUrl('/api/announcements.php'));
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        const latestTs = items.length ? (new Date(items[0].created_at).getTime() || Date.now()) : 0;
        const seenTs = Number(localStorage.getItem('pf_notifications_seen_ts') || '0');
        dot.style.display = latestTs > seenTs ? 'inline-block' : 'none';
    } catch (_) {}
}

document.addEventListener('DOMContentLoaded', () => {
    try { updateNotifDot(); } catch (_) {}
    window.addEventListener('storage', (e) => {
        if (e.key === 'pf_custom_notice' || e.key === 'pf_notifications' || e.key === 'pf_notifications_seen_ts') {
            updateNotifDot();
        }
    });
    // Live hero background parallax (subtle)
    try {
        const hero = document.querySelector('.hero');
        if (hero) {
            const baseX = 50, baseY = 50;
            hero.addEventListener('mousemove', (ev) => {
                const rect = hero.getBoundingClientRect();
                const rx = (ev.clientX - rect.left) / rect.width - 0.5;
                const ry = (ev.clientY - rect.top) / rect.height - 0.5;
                const x = baseX + rx * 4; // subtle drift
                const y = baseY + ry * 4;
                hero.style.backgroundPosition = `${x}% ${y}%`;
            });
            window.addEventListener('scroll', () => {
                const y = baseY + window.scrollY * 0.02;
                hero.style.backgroundPosition = `${baseX}% ${y}%`;
            });
        }
    } catch (_) {}
});

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
    
    if (newPassword.length < 8) {
        showNotification('New password must be at least 8 characters', 'error');
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
        closeModal();
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
        closeModal();
        logout();
    }).catch(err => {
        showNotification(err.message || 'Failed to delete account', 'error');
    });
}

// Search functionality
function handleSearch(e) {
    e.preventDefault();

    const rawLocation = locationInput.value.trim();
    // Remove redundant Davao context from the query (since app already targets Davao City)
    const sanitized = rawLocation.replace(/\b(davao\s*city|davao)\b/gi, '').replace(/\s{2,}/g, ' ').trim();
    const location = sanitized || rawLocation; // keep original if sanitization empties the string

    if (!location) {
        showNotification('Please enter a location', 'error');
        return;
    }

    // Require searches to be within Davao City; notify if not
    const davaoKeywords = ['davao city', 'davao', 'davao del sur', 'davao region', 'mindanao'];
    const locationLower = rawLocation.toLowerCase();
    const isDavaoCity = davaoKeywords.some(keyword => locationLower.includes(keyword));
    if (!isDavaoCity) {
        showNotification('This app only supports parking searches within Davao City. Please include "Davao City" in your search.', 'error');
        return;
    }

    // Save to history
    try { pushSearchHistory(location); } catch (_) {}
    // Redirect to map page with query param (robust relative path)
    const query = encodeURIComponent(location);
    const baseDir = window.location.pathname.replace(/[^\\\/]*$/, ''); // remove filename
    window.location.href = `${baseDir}pp-test/map.php?q=${query}`;
}

// Filter parking data based on search criteria
function filterParkingData(location, duration, type) {
    let filtered = [...parkingData];
    
    // Filter by type if specified
    if (type) {
        filtered = filtered.filter(parking => parking.type === type);
    }
    
    // Filter by duration if specified
    if (duration) {
        filtered = filtered.filter(parking => {
            const parkingDuration = parseInt(parking.duration.split(' ')[0]);
            const searchDuration = parseInt(duration);
            return parkingDuration >= searchDuration;
        });
    }
    
    // Simulate location-based filtering (in real app, this would use geolocation)
    filtered = filtered.map(parking => ({
        ...parking,
        distance: (Math.random() * 2 + 0.1).toFixed(1) + ' miles'
    }));
    
    return filtered;
}

// Display search results
function displayResults(results) {
    // Results no longer shown on main page
}

// Create parking card HTML
function createParkingCard(parking) {
    const featuresHtml = parking.features.map(feature => 
        `<span class="feature-tag">${feature}</span>`
    ).join('');
    
    return `
        <div class="parking-card" data-id="${parking.id}">
            <div class="parking-header">
                <div class="parking-name">${parking.name}</div>
                <div class="parking-price">${parking.price}</div>
            </div>
            <div class="parking-details">
                <div class="parking-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${parking.distance}</span>
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
                    <span>${parking.availability}</span>
                </div>
            </div>
            <div class="parking-features">
                ${featuresHtml}
            </div>
            <div class="parking-actions">
                <button class="btn-reserve" onclick="reserveParking(${parking.id})">
                    <i class="fas fa-bookmark"></i>
                    Reserve Now
                </button>
                <button class="btn-directions" onclick="getDirections(${parking.id})">
                    <i class="fas fa-directions"></i>
                    Directions
                </button>
            </div>
        </div>
    `;
}

// Sort results
function sortResults(sortBy) {
    if (currentResults.length === 0) return;
    
    const sorted = [...currentResults].sort((a, b) => {
        if (sortBy === 'price') {
            const priceA = parseFloat(a.price.replace('$', ''));
            const priceB = parseFloat(b.price.replace('$', ''));
            return priceA - priceB;
        } else if (sortBy === 'distance') {
            const distanceA = parseFloat(a.distance.split(' ')[0]);
            const distanceB = parseFloat(b.distance.split(' ')[0]);
            return distanceA - distanceB;
        }
    });
    
    displayResults(sorted);
    
    // Update active button
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Toggle between list and grid view
function toggleView() {
    isGridView = !isGridView;
    const icon = viewToggleBtn.querySelector('i');
    const text = viewToggleBtn.querySelector('span');
    
    if (isGridView) {
        resultsList.classList.add('grid-view');
        icon.className = 'fas fa-list';
        text.textContent = 'List View';
    } else {
        resultsList.classList.remove('grid-view');
        icon.className = 'fas fa-th';
        text.textContent = 'Grid View';
    }
}

// Reserve parking
function reserveParking(parkingId) {
    const parking = currentResults.find(p => p.id === parkingId);
    if (!parking) return;
    
    showModal(`
        <div class="reservation-modal">
            <h3>Reserve Parking</h3>
            <div class="reservation-details">
                <p><strong>Location:</strong> ${parking.name}</p>
                <p><strong>Address:</strong> ${parking.address}</p>
                <p><strong>Price:</strong> ${parking.price}</p>
                <p><strong>Duration:</strong> ${parking.duration}</p>
            </div>
            <div class="reservation-form">
                <label for="reservationDate">Date:</label>
                <input type="date" id="reservationDate" required>
                <label for="reservationTime">Time:</label>
                <input type="time" id="reservationTime" required>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn-primary" onclick="confirmReservation(${parkingId})">Confirm Reservation</button>
            </div>
        </div>
    `);
}

// Get directions
function getDirections(parkingId) {
    const parking = currentResults.find(p => p.id === parkingId);
    if (!parking) return;
    
    // In a real app, this would open Google Maps or Apple Maps
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(parking.address)}`;
    window.open(url, '_blank');
}

// Confirm reservation
function confirmReservation(parkingId) {
    const date = document.getElementById('reservationDate').value;
    const time = document.getElementById('reservationTime').value;
    
    if (!date || !time) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    closeModal();
    showNotification('Reservation confirmed! Check your email for details.', 'success');
}

// Initialize map (placeholder)
function initializeMap() {}

// Show loading state
function showLoading() {
    const loadingHtml = `
        <div class="loading-overlay">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Searching for parking spots...</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHtml);
}

// Hide loading state
function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
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

// Show modal
function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Add CSS for additional components
const additionalStyles = `
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    
    .loading-spinner {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .loading-spinner i {
        font-size: 2rem;
        color: #2563eb;
        margin-bottom: 1rem;
    }
    
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
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal-overlay.show {
        opacity: 1;
    }
    
    .modal {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .reservation-details {
        margin: 1rem 0;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .reservation-form {
        margin: 1rem 0;
    }
    
    .reservation-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .reservation-form input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
    }
    
    .btn-secondary {
        background: white;
        border: 2px solid #e2e8f0;
        color: #64748b;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-secondary:hover {
        border-color: #2563eb;
        color: #2563eb;
    }
    
    .parking-features {
        margin: 1rem 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .feature-tag {
        background: #e0f2fe;
        color: #0277bd;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .no-results {
        text-align: center;
        padding: 3rem;
        color: #64748b;
    }
    
    .no-results i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #cbd5e1;
    }
    
    .grid-view {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
    }
    
    .btn-filter.active {
        background: #2563eb;
        color: white;
        border-color: #2563eb;
    }
    
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
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
        }
        
        .notification.show {
            transform: translateY(0);
        }
        
        .modal {
            margin: 1rem;
            padding: 1.5rem;
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

// Authentication Functions
function setupAuthEventListeners() {
    // Auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Modal elements
    const authModalOverlay = document.getElementById('authModalOverlay');
    const closeAuthModalBtn = document.getElementById('closeAuthModal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    // Forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // User dropdown
    const userProfileBtn = document.getElementById('userProfileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    // Event listeners
    if (loginBtn && !loginBtn.hasAttribute('href')) {
        loginBtn.addEventListener('click', () => openAuthModal('login'));
    }
    if (signupBtn && !signupBtn.hasAttribute('href')) {
        signupBtn.addEventListener('click', () => openAuthModal('signup'));
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
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
    const switchToSignupAlt = document.getElementById('switchToSignupAlt');
    if (switchToSignupAlt) {
        switchToSignupAlt.addEventListener('click', (e) => { e.preventDefault(); switchAuthForm('signup'); });
    }
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthForm('login');
    });
    
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', toggleUserDropdown);
        // Close when clicking outside (desktop)
        document.addEventListener('click', (e) => {
            const dd = userProfileBtn.closest('.user-dropdown');
            if (dd && !dd.contains(e.target)) {
                dd.classList.remove('active');
            }
        });
    }
    // Mobile profile dropdown toggle
    const mobileUserProfileBtn = document.getElementById('mobileUserProfileBtn');
    const mobileDropdownMenu = document.getElementById('mobileDropdownMenu');
    if (mobileUserProfileBtn && mobileDropdownMenu) {
        mobileUserProfileBtn.addEventListener('click', () => {
            mobileDropdownMenu.parentElement.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            const dd = mobileDropdownMenu.parentElement;
            if (dd && !dd.contains(e.target) && dd.classList.contains('active')) {
                dd.classList.remove('active');
            }
        });
    }
    
    // Password toggles
    setupPasswordToggles();
    
    // Social auth buttons
    setupSocialAuth();
}

function openAuthModal(type) {
    const authModalOverlay = document.getElementById('authModalOverlay');
    const authModalTitle = document.getElementById('authModalTitle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const modal = document.getElementById('authModal');
    
    authModalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    if (type === 'login') {
        authModalTitle.textContent = 'Sign In';
        if (modal) { modal.classList.remove('mode-signup'); modal.classList.add('mode-login'); }
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        authModalTitle.textContent = 'Sign Up';
        if (modal) { modal.classList.remove('mode-login'); modal.classList.add('mode-signup'); }
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
    
    // Clear form errors
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
    const modal = document.getElementById('authModal');
    
    if (type === 'signup') {
        authModalTitle.textContent = 'Sign Up';
        if (modal) { modal.classList.remove('mode-login'); modal.classList.add('mode-signup'); }
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    } else {
        authModalTitle.textContent = 'Sign In';
        if (modal) { modal.classList.remove('mode-signup'); modal.classList.add('mode-login'); }
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
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate form
    if (!validateLoginForm(email, password)) {
        return;
    }
    
    // Show loading
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
        phone: document.getElementById('signupPhone').value.trim(),
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('signupConfirmPassword').value,
        agreeTerms: document.getElementById('agreeTerms').checked
    };
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate form
    if (!validateSignupForm(formData)) {
        return;
    }
    
    // Show loading
    setButtonLoading('signupSubmitBtn', true);
    
    fetch(getApiUrl('/api/auth_signup.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
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
    
    // First name validation
    if (!data.firstName) {
        showFieldError('signupFirstName', 'First name is required');
        isValid = false;
    } else if (data.firstName.length < 2) {
        showFieldError('signupFirstName', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Last name validation
    if (!data.lastName) {
        showFieldError('signupLastName', 'Last name is required');
        isValid = false;
    } else if (data.lastName.length < 2) {
        showFieldError('signupLastName', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    if (!data.email) {
        showFieldError('signupEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldError('signupEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone: not strict, optional (no validation)
    
    // Password: not strict, just require non-empty
    if (!data.password) {
        showFieldError('signupPassword', 'Password is required');
        isValid = false;
    } else if (data.password.length < 8) {
        showFieldError('signupPassword', 'Password must be at least 8 characters');
        isValid = false;
    }
    
    // Confirm password validation
    if (!data.confirmPassword) {
        showFieldError('signupConfirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (data.password !== data.confirmPassword) {
        showFieldError('signupConfirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Terms agreement validation
    if (!data.agreeTerms) {
        showFieldError('agreeTerms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
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

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function hasStrongPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
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
    
    // Store user data
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
    
    // Clear stored data
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    updateAuthUI();
    // Optional toast (may not be seen due to redirect)
    try { showNotification('You have been logged out', 'info'); } catch (_) {}
    // Redirect to homepage
    try { window.location.href = 'index.php'; } catch (_) {}
}

function checkAuthState() {
    // Check for stored user data
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
    // Preferred: explicitly set PF_API_BASE when hosting path differs
    if (window.PF_API_BASE) return `${window.PF_API_BASE}${path}`;
    
    // If opened from file:// fallback to XAMPP default
    if (window.location.protocol === 'file:') {
        return `http://localhost/PP${path}`;
    }
    
    // Try to infer base dynamically
    const { origin, pathname } = window.location;
    // If inside /PP/pp-test/, base is the parent folder (/PP)
    if (pathname.includes('/pp-test/')) {
        const base = origin + pathname.split('/pp-test/')[0];
        return `${base}${path}`;
    }
    // Otherwise assume current directory is /PP/
    const segs = pathname.split('/');
    const ppIndex = segs.lastIndexOf('PP');
    if (ppIndex !== -1) {
        const base = origin + '/' + segs.slice(1, ppIndex + 1).join('/');
        return `${base}${path}`;
    }
    // Fallback to /PP
    return `${origin}/PP${path}`;
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const adminLink = document.getElementById('adminLink');
    const mapLink = document.getElementById('mapLink');
    const mobileAuthBar = document.querySelector('.mobile-auth-bar');
    const mobileAuthButtons = document.getElementById('mobileAuthButtons');
    const mobileUserMenu = document.getElementById('mobileUserMenu');
    const mobileUserName = document.getElementById('mobileUserName');
    const mobileAdminLink = document.getElementById('mobileAdminLink');
    
    if (isAuthenticated && currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        if (adminLink) adminLink.style.display = currentUser.isAdmin ? 'inline-block' : 'none';
        if (mapLink) mapLink.style.display = 'inline-block';
        if (mobileAuthBar) mobileAuthBar.style.display = 'flex';
        if (mobileAuthButtons) mobileAuthButtons.style.display = 'none';
        if (mobileUserMenu) mobileUserMenu.style.display = 'block';
        if (mobileUserName) mobileUserName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        if (mobileAdminLink) mobileAdminLink.style.display = currentUser.isAdmin ? 'inline-block' : 'none';
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        if (mapLink) mapLink.style.display = 'none';
        if (mobileAuthBar) mobileAuthBar.style.display = 'flex';
        if (mobileAuthButtons) mobileAuthButtons.style.display = 'flex';
        if (mobileUserMenu) mobileUserMenu.style.display = 'none';
        if (mobileAdminLink) mobileAdminLink.style.display = 'none';
    }
}

function toggleUserDropdown(e) {
    try {
        const btn = e && e.currentTarget ? e.currentTarget : document.getElementById('userProfileBtn');
        const dd = btn ? btn.closest('.user-dropdown') : document.querySelector('.user-dropdown');
        if (dd) {
            dd.classList.toggle('active');
        }
    } catch (_) {}
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

function setupSocialAuth() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    
    googleBtn.addEventListener('click', () => {
        showNotification('Google authentication coming soon!', 'info');
    });
    
    facebookBtn.addEventListener('click', () => {
        showNotification('Facebook authentication coming soon!', 'info');
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const userDropdown = document.querySelector('.user-dropdown');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (userDropdown && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('active');
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const authModalOverlay = document.getElementById('authModalOverlay');
        if (authModalOverlay.classList.contains('show')) {
            closeAuthModal();
        }
    }
});

// Restrict phone inputs to digits only across pages (signup/profile)
try {
  document.addEventListener('input', function(e) {
    const t = e.target;
    if (!t) return;
    if (t.id === 'signupPhone' || t.id === 'pfPhone') {
      t.value = String(t.value || '').replace(/[^0-9]/g, '');
    }
  });
} catch (_) {}
