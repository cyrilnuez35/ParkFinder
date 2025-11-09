<?php
// Simple admin dashboard page with client-side gate
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <script defer src="script.js"></script>
    <script defer src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script defer src="admin.js"></script>
    <script>
        // Client-side access control: redirect non-admin users to homepage
        (function() {
            function getUser() {
                try {
                    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
                    return raw ? JSON.parse(raw) : null;
                } catch (e) { return null; }
            }
            const user = getUser();
            if (!user || !user.isAdmin) {
                window.location.replace('index.php');
            }
        })();
    </script>
    <style>
        :root {
            --pf-primary: #2563eb;
            --pf-text: #1e293b;
            --pf-muted: #64748b;
            --pf-border: #e2e8f0;
            --pf-bg: #f8fafc;
            --pf-success: #059669;
            --pf-danger: #dc2626;
        }
        body { background: var(--pf-bg); }
        .admin-container { max-width: 1100px; margin: 0 auto; padding: 2rem; }
        .admin-header { display: flex; align-items: center; justify-content: space-between; }
        .admin-title { font-size: 1.9rem; font-weight: 700; color: var(--pf-text); }
        .admin-card { background: #fff; border: 1px solid var(--pf-border); border-radius: 14px; padding: 1.25rem; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .admin-card h3 { margin: 0 0 0.5rem 0; color: var(--pf-text); }
        .admin-card p { margin: 0 0 1rem 0; color: var(--pf-muted); }
        .section-header { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap: wrap; }
        .admin-table-wrapper { overflow-x: auto; }
        .admin-table thead th, .admin-table tbody td { word-break: break-word; }

        /* Form layout */
        #parkingForm label { display: block; font-weight: 600; color: var(--pf-text); margin: 0 0 0.25rem 0; font-size: 0.9rem; }
        #parkingForm input, #parkingForm select {
            width: 100%;
            padding: 0.6rem 0.75rem;
            border: 2px solid var(--pf-border);
            border-radius: 10px;
            background: #fff;
            font-size: 0.95rem;
            color: var(--pf-text);
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        #parkingForm input:focus, #parkingForm select:focus {
            outline: none;
            border-color: var(--pf-primary);
            box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
        }

        .btn { background: var(--pf-primary); color: #fff; border: none; padding: 0.55rem 0.9rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: filter 0.2s ease; }
        .btn:hover { filter: brightness(0.95); }
        .btn.btn-secondary { background: #fff; color: var(--pf-muted); border: 2px solid var(--pf-border); }
        .btn.btn-secondary:hover { color: var(--pf-primary); border-color: var(--pf-primary); }

        /* Table styles */
        .admin-table { width: 100%; border-collapse: collapse; overflow: hidden; border-radius: 12px; border: 1px solid var(--pf-border); }
        .admin-table thead th { background: #fff; color: var(--pf-text); font-weight: 700; padding: 0.75rem; border-bottom: 1px solid var(--pf-border); }
        .admin-table tbody td { padding: 0.65rem 0.75rem; border-bottom: 1px solid #eef2f7; color: var(--pf-text); }
        .admin-table tbody tr:hover { background: #f9fbff; }
        .admin-table td:last-child { white-space: nowrap; }
        .admin-table button[data-delete] { background: var(--pf-danger); }
        .admin-table button[data-delete]:hover { filter: brightness(0.95); }
        .admin-table button[data-edit] { background: var(--pf-primary); color: #fff; }
        #adminMap { height: 420px; width: 100%; border: 1px solid var(--pf-border); border-radius: 12px; }
        
        /* Announcements styles */
        .notice-grid { display: grid; grid-template-columns: minmax(360px, 1.5fr) 1fr; gap: 1rem; align-items: start; }
        .notice-form input, .notice-form select { width: 100%; padding: 0.6rem; border: 1px solid var(--pf-border); border-radius: 10px; }
        .notice-form textarea { width: 100%; padding: 0.6rem; border: 1px solid var(--pf-border); border-radius: 10px; resize: vertical; }
        .notice-preview { border: 1px solid var(--pf-border); border-radius: 12px; padding: 0.9rem; background: linear-gradient(180deg,#ffffff 0%,#f8fbff 100%); }
        .notice-preview-title { display:flex; align-items:center; gap:0.5rem; font-weight:700; color:#0f172a; }
        .severity-pill { display:inline-block; padding:0.15rem 0.5rem; border-radius:999px; font-size:0.75rem; font-weight:700; }
        .severity-pill.info { background:#e0f2fe; color:#0369a1; }
        .severity-pill.warning { background:#fef3c7; color:#b45309; }
        .severity-pill.closure { background:#fee2e2; color:#b91c1c; }
        .notice-preview-msg { margin-top:0.4rem; color:#334155; line-height:1.4; }
        .notice-recent { border:1px solid var(--pf-border); border-radius:12px; overflow:hidden; }
        .notice-recent h4 { margin:0; padding:0.6rem 0.8rem; background:#fff; border-bottom:1px solid var(--pf-border); }
        .notice-list { list-style:none; margin:0; padding:0.6rem 0.8rem; max-height:280px; overflow:auto; }
        .notice-list li { padding:0.45rem 0; border-bottom:1px solid #eef2f7; }
        .notice-list li:last-child { border-bottom:none; }
        .notice-item-title { font-weight:600; color:#0f172a; }
        .notice-item-msg { color:#64748b; font-size:0.9rem; }

        /* Sidebar layout */
        .admin-layout { max-width: 1200px; margin: 92px auto 24px; padding: 0 20px; display: grid; grid-template-columns: 240px 1fr; gap: 1rem; }
        .admin-sidebar { position: sticky; top: 92px; height: calc(100vh - 120px); background: #fff; border: 1px solid var(--pf-border); border-radius: 16px; box-shadow: 0 10px 24px rgba(0,0,0,0.06); padding: 0.75rem; }
        .sidebar-brand { display:flex; align-items:center; gap:0.5rem; font-weight:800; color:#0f172a; padding:0.5rem 0.75rem; }
        .sidebar-menu { display:flex; flex-direction:column; gap:0.25rem; margin-top:0.5rem; }
        .menu-item { display:flex; align-items:center; gap:0.6rem; padding:0.55rem 0.75rem; border-radius:10px; color:#475569; text-decoration:none; }
        .menu-item i { width:20px; text-align:center; color:#94a3b8; }
        .menu-item:hover { background:#f1f5f9; }
        .menu-item.active { background:#eef2ff; color:#1e40af; }
        .menu-item.active i { color:#1e40af; }
        .sidebar-sep { height:1px; background:#e2e8f0; margin:0.5rem 0; }

        /* Slides */
        .slides { margin-top: 0.5rem; }
        .slide { display: none; }
        .slide.active { display: block; animation: slideIn 240ms ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

        /* Dashboard KPI styles */
        .dash-grid { display:grid; grid-template-columns: repeat(4, minmax(180px, 1fr)); gap: 0.75rem; }
        .dash-card { background:#fff; border:1px solid var(--pf-border); border-radius:14px; padding:0.9rem; box-shadow:0 8px 18px rgba(0,0,0,0.06); display:flex; flex-direction:column; justify-content:center; }
        .dash-card--primary { background: linear-gradient(180deg,#0f3b2a 0%, #0b5d3a 60%); color:#e7fff4; border:none; }
        .dash-card__top { display:flex; align-items:center; justify-content:space-between; }
        .dash-card__title { font-weight:700; color:#0f172a; }
        .dash-card--primary .dash-card__title { color:#a7f3d0; }
        .dash-card__trend { color:#10b981; }
        .dash-card__value { font-size:2rem; font-weight:800; color:#0f172a; }
        .dash-card--primary .dash-card__value { color:#ffffff; }
        .dash-card__hint { font-size:0.8rem; color: var(--pf-muted); }
        .dash-ring { position:relative; width:96px; height:96px; border-radius:50%; margin:0.25rem auto; background: conic-gradient(#10b981 0% 0%, #e5e7eb 0% 100%); display:flex; align-items:center; justify-content:center; }
        .dash-ring__fill { position:absolute; inset:8px; border-radius:50%; background:#fff; }
        .dash-ring__label { position:relative; font-weight:800; color:#0f172a; }
        
        /* Badge styles for user management */
        .badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            border-radius: 0.375rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }
        .badge-success {
            background-color: #10b981;
            color: white;
        }
        .badge-secondary {
            background-color: #6b7280;
            color: white;
        }

        @media (max-width: 768px) {
            #parkingForm { grid-template-columns: 1fr !important; }
            .admin-title { font-size: 1.6rem; }
            .dash-grid { grid-template-columns: repeat(2, 1fr); }
            .admin-layout { grid-template-columns: 1fr; }
            .admin-sidebar { position: static; height: auto; }
            .admin-container { padding: 1rem; }
            .notice-grid { grid-template-columns: 1fr; }
            .notice-form { grid-template-columns: 1fr !important; }
            #adminMap { height: 320px; }
            .section-header { flex-direction: column; align-items: flex-start; gap:0.75rem; }
            .admin-table td:last-child { white-space: normal; }
            body { padding-bottom: 72px; }
        }
        @media (max-width: 640px) {
            .dash-grid { grid-template-columns: 1fr; }
            .admin-layout { margin: 72px auto 16px; padding: 0 12px; }
            .admin-card { padding: 1rem; }
            .sidebar-brand span, .menu-item span { font-size: 0.95rem; }
            /* Hide Lat/Lng columns to reduce horizontal scroll on small screens */
            .admin-table thead th:nth-child(4),
            .admin-table thead th:nth-child(5),
            .admin-table tbody td:nth-child(4),
            .admin-table tbody td:nth-child(5) { display: none; }
            /* Users table: hide Phone and Created cols */
            #users .admin-table thead th:nth-child(4),
            #users .admin-table thead th:nth-child(6),
            #users .admin-table tbody td:nth-child(4),
            #users .admin-table tbody td:nth-child(6) { display: none; }
        }
        @media (max-width: 480px) {
            .admin-title { font-size: 1.4rem; }
            .admin-container { padding: 0.75rem; }
            .admin-card h3 { font-size: 1rem; }
            .admin-card p { font-size: 0.9rem; }
            .dash-card__value { font-size: 1.6rem; }
            #adminMap { height: 260px; }
            .notice-list { max-height: 220px; }
            /* Tighten table padding for compact view */
            .admin-table thead th, .admin-table tbody td { padding: 0.5rem; }
            /* Allow action buttons to wrap and be full-width if needed */
            .admin-table tbody td:last-child button { margin: 0.15rem 0; width: 100%; }
            /* Slots table: hide Address to avoid overflow */
            #slots .admin-table thead th:nth-child(3),
            #slots .admin-table tbody td:nth-child(3) { display: none; }
        }
    </style>
 </head>
<body>
    <header class="header">
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <i class="fas fa-parking"></i>
                    <span>ParkingFinder Admin</span>
                </div>
                <div class="nav-menu">
                    <!-- Admin navbar minimal (Home/Map removed; use sidebar for navigation) -->
                </div>
                <div class="hamburger" id="hamburger" style="display: none;">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    </header>
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="sidebar-brand"><i class="fas fa-gauge"></i><span>Dashboard</span></div>
        <nav class="sidebar-menu">
          <a href="admin.php" class="menu-item active"><i class="fas fa-gauge"></i><span>Overview</span></a>
          <a href="#slots" class="menu-item"><i class="fas fa-square-parking"></i><span>Parking Slots</span></a>
          <a href="#announcements" class="menu-item"><i class="fas fa-bullhorn"></i><span>Announcements</span></a>
          <a href="#users" class="menu-item"><i class="fas fa-users"></i><span>Users</span></a>
          <div class="sidebar-sep"></div>
          <a href="index.php" class="menu-item"><i class="fas fa-home"></i><span>Home</span></a>
          <a href="pp-test/map.php" class="menu-item"><i class="fas fa-map"></i><span>Map</span></a>
        </nav>
      </aside>

      <main class="admin-container">
        <div class="admin-header">
            <h1 class="admin-title">Admin Dashboard</h1>
        </div>
        <!-- KPI cards row -->
        <div class="slides">
        <section id="overview" class="slide active">
        <div class="dash-grid" style="margin-bottom: 1rem;">
            <div class="dash-card dash-card--primary">
                <div class="dash-card__top">
                    <span class="dash-card__title">Total Slots</span>
                    <i class="fas fa-chevron-up dash-card__trend"></i>
                </div>
                <div class="dash-card__value" id="statTotalSlots">0</div>
                <div class="dash-card__hint">Increased from last month</div>
            </div>
            <div class="dash-card">
                <div class="dash-card__top">
                    <span class="dash-card__title">Available Spots</span>
                    <i class="fas fa-chevron-up dash-card__trend"></i>
                </div>
                <div class="dash-card__value" id="statAvailableSpots">0</div>
                <div class="dash-card__hint">Free spaces across all slots</div>
            </div>
            <div class="dash-card">
                <div class="dash-card__top">
                    <span class="dash-card__title">Almost Full</span>
                    <i class="fas fa-chevron-right dash-card__trend"></i>
                </div>
                <div class="dash-card__value" id="statAlmostFull">0</div>
                <div class="dash-card__hint">≥ 90% occupied</div>
            </div>
            <div class="dash-card">
                <div class="dash-ring">
                    <div class="dash-ring__fill" id="statOccupancyRing"></div>
                    <div class="dash-ring__label" id="statAvgOccupancy">0%</div>
                </div>
                <div class="dash-card__title" style="margin-top:0.5rem;">Avg. Occupancy</div>
            </div>
        </div>
        </section>
        <section id="slots" class="slide">
        <div class="admin-card">
            <div class="section-header">
                <div>
                    <h3 style="margin:0;">Parking Slots</h3>
                    <p style="margin:0; color: var(--pf-muted);">Add, edit, and delete parking slots in Davao City.</p>
                </div>
                <div>
                    <button class="btn btn-secondary" id="importDefaultsBtn" title="Import the default map slots">Import Default Slots</button>
                </div>
            </div>
            <div style="margin: 1rem 0;">
                <form id="parkingForm" onsubmit="return false;" style="display: grid; grid-template-columns: repeat(2, minmax(240px, 1fr)); gap: 0.75rem; align-items: end;">
                    <input type="hidden" id="slotId">
                    <div>
                        <label>Name</label>
                        <input type="text" id="slotName" placeholder="e.g., Pelayo Street Parking">
                    </div>
                    <div>
                        <label>Type</label>
                        <select id="slotType">
                            <option value="street">Street</option>
                            <option value="lot">Lot</option>
                            <option value="garage">Garage</option>
                            <option value="valet">Valet</option>
                        </select>
                    </div>
                    <div>
                        <label>Address</label>
                        <input type="text" id="slotAddress" placeholder="Full address">
                    </div>
                    <div>
                        <label>Latitude</label>
                        <input type="number" step="0.000001" id="slotLat" placeholder="7.070000">
                    </div>
                    <div>
                        <label>Longitude</label>
                        <input type="number" step="0.000001" id="slotLng" placeholder="125.610000">
                    </div>
                    <div>
                        <label>Price</label>
                        <input type="number" step="0.01" id="slotPrice" placeholder="e.g., 15.00">
                    </div>
                    <div>
                        <label>Duration</label>
                        <input type="text" id="slotDuration" placeholder="e.g., 2 hours">
                    </div>
                    <div>
                        <label>Capacity</label>
                        <input type="number" id="slotCapacity" placeholder="e.g., 30">
                    </div>
                    <div>
                        <label>Occupied</label>
                        <input type="number" id="slotOccupied" placeholder="e.g., 10">
                    </div>
                    <div>
                        <label>Available</label>
                        <input type="number" id="slotAvailable" placeholder="e.g., 20">
                    </div>
                    <div style="grid-column: 1 / -1;">
                        <label>Features (comma-separated)</label>
                        <input type="text" id="slotFeatures" placeholder="e.g., Metered, Covered, Security">
                    </div>
                    <div style="grid-column: 1 / -1; display: flex; gap: 0.5rem;">
                        <button class="btn" id="saveSlotBtn">Save</button>
                        <button class="btn" id="resetFormBtn" type="button">Reset</button>
                    </div>
                </form>
            </div>
            <div style="margin: 0.75rem 0; color: var(--pf-muted);">
                <i class="fas fa-info-circle"></i> Tip: Click on the map to set Latitude and Longitude. Drag the marker to fine tune.
            </div>
            <div id="adminMap"></div>
            <div class="admin-table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr style="text-align: left; border-bottom: 1px solid #e2e8f0;">
                        <th>Name</th><th>Type</th><th>Address</th><th>Lat</th><th>Lng</th><th>Price</th><th>Capacity</th><th>Occupied</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody id="slotsTableBody"></tbody>
            </table>
            </div>
        </div>
        </section>
        <section id="announcements" class="slide">
        <div class="admin-card" style="margin-top: 1rem;">
            <h3 style="display:flex; align-items:center; gap:0.5rem;"><i class="fas fa-bullhorn"></i> Announcements</h3>
            <p style="margin:0 0 0.75rem 0; color: var(--pf-muted);">Publish event updates or area closures in Davao City.</p>
            <div class="notice-grid">
                <form class="notice-form" onsubmit="return false;" style="display:grid; grid-template-columns: repeat(2, minmax(240px, 1fr)); gap:0.75rem; align-items:end;">
                    <div style="grid-column:1 / -1;">
                        <label>Title</label>
                        <input type="text" id="noticeTitle" placeholder="e.g., Road Closure at San Pedro St.">
                    </div>
                    <div style="grid-column:1 / -1;">
                        <label>Message</label>
                        <textarea id="noticeMessage" placeholder="Details (date, time, affected areas)" rows="4"></textarea>
                    </div>
                    <div>
                        <label>Severity</label>
                        <select id="noticeSeverity">
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="closure">Closure</option>
                        </select>
                    </div>
                    <div style="grid-column:1 / -1; display:flex; gap:0.5rem;">
                        <button class="btn" id="publishNoticeBtn" type="button"><i class="fas fa-paper-plane"></i> Publish</button>
                        <button class="btn btn-secondary" id="clearNoticeBtn" type="button">Clear</button>
                    </div>
                </form>
                <div class="notice-side">
                    <div class="notice-preview" id="noticePreview">
                        <div class="notice-preview-title">
                            <i class="fas fa-bullhorn"></i>
                            <span id="noticePreviewTitle">Announcement preview</span>
                            <span class="severity-pill info" id="noticePreviewSeverity">Info</span>
                        </div>
                        <div class="notice-preview-msg" id="noticePreviewMsg">Type a title and message to preview how it will appear.</div>
                    </div>
                    <div class="notice-recent" style="margin-top:0.75rem;">
                        <h4>Recent</h4>
                        <ul class="notice-list" id="noticeRecentList"><li class="notice-empty" style="color:#64748b;">No announcements yet</li></ul>
                    </div>
                </div>
            </div>
        </div>
        </section>
        <section id="users" class="slide">
        <div class="admin-card" style="margin-top: 1rem;">
            <h3>User Management</h3>
            <p style="margin:0 0 0.5rem 0; color: var(--pf-muted);">Manage registered users and admin privileges.</p>
            <div class="admin-table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr style="text-align: left; border-bottom: 1px solid #e2e8f0;">
                        <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Admin</th><th>Created</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody"></tbody>
            </table>
            </div>
        </div>
        </section>
        </div>
        <!-- Map Preview removed as requested -->
      </main>
    </div>
</body>
</html>