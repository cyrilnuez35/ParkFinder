// Admin Dashboard logic
(function() {
  // Lightweight toast notifications for admin page
  if (typeof window.showNotification !== 'function') {
    window.showNotification = function(message, type) {
      try {
        let container = document.getElementById('adminToastContainer');
        if (!container) {
          container = document.createElement('div');
          container.id = 'adminToastContainer';
          container.style.position = 'fixed';
          container.style.top = '20px';
          container.style.right = '20px';
          container.style.zIndex = '10000';
          container.style.display = 'flex';
          container.style.flexDirection = 'column';
          container.style.gap = '8px';
          document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.style.background = '#fff';
        toast.style.padding = '0.75rem 1rem';
        toast.style.borderRadius = '10px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '0.5rem';
        toast.style.transform = 'translateX(300px)';
        toast.style.transition = 'transform 0.25s ease';
        const borderColor = (type === 'success') ? '#059669' : (type === 'error' ? '#dc2626' : '#2563eb');
        toast.style.borderLeft = `4px solid ${borderColor}`;
        const icon = (type === 'success') ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
        toast.innerHTML = `<span>${icon}</span><span style="color:#1e293b;">${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
        setTimeout(() => {
          toast.style.transform = 'translateX(300px)';
          setTimeout(() => { try { toast.remove(); } catch (_) {} }, 250);
        }, 2500);
      } catch (_) { try { alert(message); } catch (_) {} }
    };
  }
  function getCurrentUser() {
    try {
      const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  const user = getCurrentUser();
  if (!user || !(user.isAdmin || user.is_admin)) {
    // Redundant guard; admin.php also redirects
    window.location.replace('index.php');
    return;
  }

  const apiBase = 'api/parking.php';
  const usersApiBase = 'api/users.php';
  const annApiBase = 'api/announcements.php';
  let adminMap = null;
  let adminMapMarkers = [];
  let pickMarker = null;
  let editingNoticeId = null;

  function showToast(msg, type) {
    if (typeof showNotification === 'function') {
      showNotification(msg, type || 'info');
    } else {
      alert(msg);
    }
  }

  async function fetchSlots() {
    const res = await fetch(apiBase, { headers: { 'X-Admin-Id': String(user.id) } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load slots');
    return data.items || [];
  }

  async function saveSlot(payload) {
    const method = payload.id ? 'PUT' : 'POST';
    const res = await fetch(apiBase, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Admin-Id': String(user.id) },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save slot');
    return data;
  }

  function isFiniteNumber(n) {
    return typeof n === 'number' && isFinite(n);
  }

  async function deleteSlot(id) {
    const res = await fetch(`${apiBase}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Id': String(user.id) }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete slot');
    return data;
  }

  function renderSlots(slots) {
    const tbody = document.getElementById('slotsTableBody');
    if (!tbody) return;
    tbody.innerHTML = slots.map(s => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td>${escapeHtml(s.name)}</td>
        <td>${escapeHtml(s.type)}</td>
        <td>${escapeHtml(s.address)}</td>
        <td>${Number(s.latitude).toFixed(6)}</td>
        <td>${Number(s.longitude).toFixed(6)}</td>
        <td>${Number(s.price).toFixed(2)}</td>
        <td>${Number(s.capacity)}</td>
        <td>${Number(s.occupied)}</td>
        <td>
          <button class="btn btn-secondary" data-edit="${s.id}"><i class="fas fa-pen"></i> Edit</button>
          <button class="btn btn-danger" data-delete="${s.id}"><i class="fas fa-trash"></i> Delete</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => { activateSlotsView(); populateForm(slots.find(x => x.id == btn.dataset.edit)); });
    });
    tbody.querySelectorAll('button[data-delete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Delete this parking slot?')) {
          try {
            await deleteSlot(btn.dataset.delete);
            showToast('Parking slot deleted', 'success');
            try { localStorage.setItem('pf_slots_updated', String(Date.now())); } catch (_) {}
            init();
          } catch (e) {
            showToast(e.message, 'error');
          }
        }
      });
    });
  }

  function initMap() {
    const container = document.getElementById('adminMap');
    if (!container) return;
    if (adminMap) return; // already initialized
    adminMap = L.map('adminMap').setView([7.0700, 125.6100], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(adminMap);
    // Fix rendering if container sizes change
    setTimeout(() => { try { adminMap.invalidateSize(); } catch (_) {} }, 150);
    window.addEventListener('resize', () => {
      setTimeout(() => { try { adminMap.invalidateSize(); } catch (_) {} }, 150);
    });

    // Map click to set slot coordinates
    adminMap.on('click', (e) => {
      setFormLatLng(e.latlng.lat, e.latlng.lng);
      ensurePickMarker(e.latlng);
    });
  }

  function ensurePickMarker(latlng) {
    if (!adminMap || typeof L === 'undefined') return;
    try {
      const pos = latlng ? L.latLng(latlng.lat, latlng.lng) : adminMap.getCenter();
      if (!pickMarker) {
        pickMarker = L.marker(pos, { draggable: true }).addTo(adminMap);
        pickMarker.on('dragend', () => {
          const p = pickMarker.getLatLng();
          setFormLatLng(p.lat, p.lng);
        });
      } else {
        pickMarker.setLatLng(pos);
      }
    } catch (_) {}
  }

  function setFormLatLng(lat, lng) {
    const latEl = document.getElementById('slotLat');
    const lngEl = document.getElementById('slotLng');
    if (latEl) latEl.value = Number(lat).toFixed(6);
    if (lngEl) lngEl.value = Number(lng).toFixed(6);
  
  }

  function renderMapMarkers(slots) {
    try {
      // Leaflet not ready
      if (typeof L === 'undefined') return;
      // Ensure map exists
      if (!adminMap) initMap();
      if (!adminMap) return;

      // Clear old markers safely
      adminMapMarkers.forEach(m => {
        try {
          if (m && typeof m.remove === 'function') m.remove();
          else if (m) adminMap.removeLayer(m);
        } catch (_) {}
      });
      adminMapMarkers = [];

      const list = Array.isArray(slots) ? slots : [];
      list.forEach(s => {
        const lat = Number(s.latitude), lng = Number(s.longitude);
        if (!isFinite(lat) || !isFinite(lng)) return;
        const available = Math.max(0, Number(s.capacity) - Number(s.occupied));
        const marker = L.marker([lat, lng]);
        const popupHtml = `
          <div style="min-width:220px">
            <strong>${escapeHtml(s.name)}</strong><br/>
            ${escapeHtml(s.address)}<br/>
            ${escapeHtml(s.type)} • ${available} spots
            <div style="margin-top:0.5rem; display:flex; justify-content:flex-end; gap:0.5rem;">
              <button class="btn btn-secondary" data-edit-slot="${s.id}"><i class="fas fa-pen"></i> Edit</button>
              <button class="btn btn-danger" data-delete-slot="${s.id}"><i class="fas fa-trash"></i> Delete</button>
            </div>
          </div>`;
        marker.addTo(adminMap).bindPopup(popupHtml);
        marker.on('popupopen', () => {
          try {
            const editBtn = document.querySelector(`button[data-edit-slot="${s.id}"]`);
            if (editBtn) editBtn.addEventListener('click', () => { activateSlotsView(); populateForm(s); adminMap.closePopup(); });
            const delBtn = document.querySelector(`button[data-delete-slot="${s.id}"]`);
            if (delBtn) delBtn.addEventListener('click', async () => {
              if (!confirm('Delete this parking slot?')) return;
              try {
                await deleteSlot(s.id);
                showToast('Parking slot deleted', 'success');
                try { localStorage.setItem('pf_slots_updated', String(Date.now())); } catch (_) {}
                adminMap.closePopup();
                init();
              } catch (e) {
                showToast(e.message, 'error');
              }
            });
          } catch (_) {}
        });
        adminMapMarkers.push(marker);
      });
    } catch (e) {
      showToast(e.message || 'Failed to render map markers', 'error');
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
  }
  // Activate the Parking Slots dashboard view
  function activateSlotsView() {
    try {
      document.querySelectorAll('.slide').forEach(el => el.classList.remove('active'));
      const slotsSection = document.getElementById('slots');
      if (slotsSection) slotsSection.classList.add('active');
      // Sidebar highlight
      document.querySelectorAll('.sidebar-menu .menu-item').forEach(el => el.classList.remove('active'));
      const slotsLink = document.querySelector('.sidebar-menu .menu-item[href="#slots"]');
      if (slotsLink) slotsLink.classList.add('active');
      try { window.location.hash = '#slots'; } catch (_) {}
    } catch (_) {}
  }

  function populateForm(s) {
    if (!s) return;
    document.getElementById('slotId').value = s.id;
    document.getElementById('slotName').value = s.name;
    document.getElementById('slotType').value = s.type;
    document.getElementById('slotAddress').value = s.address;
    document.getElementById('slotLat').value = s.latitude;
    document.getElementById('slotLng').value = s.longitude;
    document.getElementById('slotPrice').value = s.price;
    document.getElementById('slotDuration').value = s.duration;
    document.getElementById('slotCapacity').value = s.capacity;
    document.getElementById('slotOccupied').value = s.occupied;
    try {
      const availEl = document.getElementById('slotAvailable');
      if (availEl) {
        const cap = parseInt(s.capacity || 0, 10);
        const occ = parseInt(s.occupied || 0, 10);
        const avail = Math.max(0, cap - occ);
        availEl.value = isFinite(avail) ? String(avail) : '';
      }
    } catch (_) {}
    document.getElementById('slotFeatures').value = s.features || '';
    // Center map and show draggable marker at slot position
    const lat = Number(s.latitude), lng = Number(s.longitude);
    if (adminMap && isFinite(lat) && isFinite(lng)) {
      try { adminMap.setView([lat, lng], Math.max(adminMap.getZoom(), 15)); } catch (_) {}
      ensurePickMarker({ lat, lng });
    }
  }

  function resetForm() {
    ['slotId','slotName','slotType','slotAddress','slotLat','slotLng','slotPrice','slotDuration','slotCapacity','slotOccupied','slotAvailable','slotFeatures']
      .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.getElementById('slotType').value = 'street';
    document.getElementById('slotDuration').value = '2 hours';
  }

  function bindForm() {
    const saveBtn = document.getElementById('saveSlotBtn');
    const resetBtn = document.getElementById('resetFormBtn');
    const importBtn = document.getElementById('importDefaultsBtn');
    const titleEl = document.getElementById('noticeTitle');
    const msgEl = document.getElementById('noticeMessage');
    const sevEl = document.getElementById('noticeSeverity');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const payload = {
          id: parseInt(document.getElementById('slotId').value || '0', 10) || undefined,
          name: document.getElementById('slotName').value.trim(),
          type: document.getElementById('slotType').value,
          address: document.getElementById('slotAddress').value.trim(),
          latitude: parseFloat(document.getElementById('slotLat').value),
          longitude: parseFloat(document.getElementById('slotLng').value),
          price: parseFloat(document.getElementById('slotPrice').value) || 0,
          duration: document.getElementById('slotDuration').value.trim() || '2 hours',
          capacity: parseInt(document.getElementById('slotCapacity').value || '0', 10),
          occupied: parseInt(document.getElementById('slotOccupied').value || '0', 10),
          features: document.getElementById('slotFeatures').value.trim()
        };
        // Basic validation to prevent runtime/server errors
        if (!payload.name) { showToast('Please enter a slot name', 'error'); return; }
        if (!isFiniteNumber(payload.latitude) || !isFiniteNumber(payload.longitude)) {
          showToast('Please set coordinates by clicking the map or entering Latitude and Longitude', 'error');
          return;
        }
        if (!isFiniteNumber(payload.capacity) || payload.capacity < 0) payload.capacity = 0;
        if (!isFiniteNumber(payload.occupied) || payload.occupied < 0) payload.occupied = 0;
        if (payload.occupied > payload.capacity) payload.occupied = payload.capacity;
        try {
          await saveSlot(payload);
      showToast(payload.id ? 'Parking slot updated' : 'Parking slot added', 'success');
      resetForm();
      try { localStorage.setItem('pf_slots_updated', String(Date.now())); } catch (_) {}
      init();
    } catch (e) {
      showToast(e.message, 'error');
    }
  });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', resetForm);
    }
    if (importBtn) {
      importBtn.addEventListener('click', async () => {
        try {
          const res = await fetch('api/seed_slots.php');
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to import default slots');
          showToast(data.message || 'Default slots imported', 'success');
          try { localStorage.setItem('pf_slots_updated', String(Date.now())); } catch (_) {}
          init();
        } catch (e) {
          showToast(e.message, 'error');
        }
      });
    }
    // Keep Available in sync when Capacity/Occupied change
    const capEl = document.getElementById('slotCapacity');
    const occEl = document.getElementById('slotOccupied');
    const availEl = document.getElementById('slotAvailable');
    function updateAvailableDisplay() {
      if (!availEl) return;
      const cap = parseInt(capEl?.value || '0', 10);
      const occ = parseInt(occEl?.value || '0', 10);
      const safeCap = isFinite(cap) ? cap : 0;
      const safeOcc = isFinite(occ) ? occ : 0;
      const avail = Math.max(0, safeCap - safeOcc);
      availEl.value = String(avail);
    }
    if (capEl) capEl.addEventListener('input', updateAvailableDisplay);
    if (occEl) occEl.addEventListener('input', updateAvailableDisplay);
    // When admin edits Available directly, adjust Occupied accordingly
    if (availEl) availEl.addEventListener('input', function() {
      const cap = parseInt(capEl?.value || '0', 10);
      let avail = parseInt(availEl?.value || '0', 10);
      const safeCap = isFinite(cap) ? Math.max(0, cap) : 0;
      if (!isFinite(avail)) avail = 0;
      if (avail < 0) avail = 0;
      if (avail > safeCap) avail = safeCap;
      const occ = Math.max(0, safeCap - avail);
      if (occEl) occEl.value = String(occ);
      availEl.value = String(avail);
    });
    updateAvailableDisplay();
    // Live preview bindings
    function updateNoticePreview() {
      try {
        const title = (titleEl?.value || '').trim();
        const msg = (msgEl?.value || '').trim();
        const severity = (sevEl?.value || 'info');
        const pt = document.getElementById('noticePreviewTitle');
        const pm = document.getElementById('noticePreviewMsg');
        const ps = document.getElementById('noticePreviewSeverity');
        if (pt) pt.textContent = title || 'Announcement preview';
        if (pm) pm.textContent = msg || 'Type a title and message to preview how it will appear.';
        if (ps) {
          ps.textContent = severity.charAt(0).toUpperCase() + severity.slice(1);
          ps.classList.remove('info','warning','closure');
          ps.classList.add(severity);
        }
      } catch (_) {}
    }
    if (titleEl) titleEl.addEventListener('input', updateNoticePreview);
    if (msgEl) msgEl.addEventListener('input', updateNoticePreview);
    if (sevEl) sevEl.addEventListener('change', updateNoticePreview);
    updateNoticePreview();

    async function loadRecentAnnouncements() {
      try {
        const listEl = document.getElementById('noticeRecentList');
        if (!listEl) return;
        const res = await fetch(annApiBase);
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        listEl.innerHTML = items.length ? items.slice(0,8).map(it => `
          <li>
            <div class="notice-item-title">${escapeHtml(it.title)}</div>
            <div class="notice-item-msg">${escapeHtml(it.message)}</div>
            <div style="margin-top:0.4rem; display:flex; gap:0.5rem;">
              <button class="btn btn-secondary" data-edit-notice="${it.id}"><i class="fas fa-pen"></i> Edit</button>
              <button class="btn btn-danger" data-delete-notice="${it.id}"><i class="fas fa-trash"></i> Delete</button>
            </div>
          </li>`).join('') : '<li class="notice-empty" style="color:#64748b;">No announcements yet</li>';

        // Bind actions
        listEl.querySelectorAll('[data-edit-notice]').forEach(btn => {
          btn.addEventListener('click', async () => {
            try {
              const id = btn.getAttribute('data-edit-notice');
              // fetch one item from list; alternatively, request server
              const it = items.find(x => String(x.id) === String(id));
              if (it) {
                const t = document.getElementById('noticeTitle');
                const m = document.getElementById('noticeMessage');
                const s = document.getElementById('noticeSeverity');
                if (t) t.value = it.title;
                if (m) m.value = it.message;
                if (s) s.value = it.severity || 'info';
                editingNoticeId = Number(it.id);
                const publishBtn = document.getElementById('publishNoticeBtn');
                if (publishBtn) publishBtn.innerHTML = '<i class="fas fa-save"></i> Update';
                updateNoticePreview();
                showToast('Loaded announcement for editing', 'info');
              }
            } catch (_) {}
          });
        });

        listEl.querySelectorAll('[data-delete-notice]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-delete-notice');
            if (!confirm('Delete this announcement?')) return;
            try {
              const res = await fetch(annApiBase, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'X-Admin-Id': String(user.id) },
                body: JSON.stringify({ id: Number(id) })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.message || 'Failed to delete');
              showToast('Announcement deleted', 'success');
              if (editingNoticeId && Number(editingNoticeId) === Number(id)) {
                editingNoticeId = null;
                const publishBtn = document.getElementById('publishNoticeBtn');
                if (publishBtn) publishBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish';
              }
              loadRecentAnnouncements();
            } catch (e) {
              showToast(e.message || 'Failed to delete', 'error');
            }
          });
        });
      } catch (_) {}
    }
    loadRecentAnnouncements();
    // Publish admin notice
    const publishBtn = document.getElementById('publishNoticeBtn');
    const clearBtn = document.getElementById('clearNoticeBtn');
    if (publishBtn) {
      publishBtn.addEventListener('click', async () => {
        const title = (document.getElementById('noticeTitle')?.value || '').trim();
        const message = (document.getElementById('noticeMessage')?.value || '').trim();
        const severity = (document.getElementById('noticeSeverity')?.value || 'info');
        if (!title || !message) { showToast('Please enter title and message', 'error'); return; }
        try {
          // Persist server-side: POST for new, PUT for update
          const res = await fetch(annApiBase, {
            method: editingNoticeId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Id': String(user.id) },
            body: JSON.stringify(editingNoticeId ? { id: editingNoticeId, title, message, severity } : { title, message, severity })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to publish');
          // Broadcast locally for same-origin tabs
          const notice = { type: 'notice', severity, title, message, ts: Date.now() };
          try { localStorage.setItem('pf_custom_notice', JSON.stringify(notice)); } catch (_) {}
          const raw = localStorage.getItem('pf_notifications');
          let list = [];
          try { list = JSON.parse(raw) || []; } catch (_) { list = []; }
          list.unshift({ title, message, ts: notice.ts, type: severity });
          if (list.length > 50) list = list.slice(0, 50);
          localStorage.setItem('pf_notifications', JSON.stringify(list));
          showToast(editingNoticeId ? 'Notice updated' : 'Notice published', 'success');
          // Refresh recent list and clear fields
          loadRecentAnnouncements();
          if (titleEl) titleEl.value = '';
          if (msgEl) msgEl.value = '';
          editingNoticeId = null;
          const pb = document.getElementById('publishNoticeBtn');
          if (pb) pb.innerHTML = '<i class="fas fa-paper-plane"></i> Publish';
          updateNoticePreview();
        } catch (e) { showToast(e.message || 'Failed to publish notice', 'error'); }
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const t = document.getElementById('noticeTitle');
        const m = document.getElementById('noticeMessage');
        if (t) t.value = '';
        if (m) m.value = '';
      });
    }
  }

  // User management functions
  async function fetchUsers() {
    const res = await fetch(usersApiBase, { headers: { 'X-Admin-Id': String(user.id) } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load users');
    return data.users || [];
  }

  async function toggleUserAdmin(userId, isAdmin) {
    const res = await fetch(usersApiBase, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Id': String(user.id) },
      body: JSON.stringify({ id: userId, is_admin: isAdmin ? 1 : 0 })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update user');
    return data;
  }

  async function deleteUser(userId) {
    const res = await fetch(usersApiBase, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Id': String(user.id) },
      body: JSON.stringify({ id: userId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete user');
    return data;
  }

  function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = users.map(u => {
      const name = [u.first_name, u.last_name].filter(Boolean).join(' ');
      const created = u.created_at ? new Date(u.created_at).toLocaleDateString() : '';
      const isAdminFlag = !!(u.is_admin === 1 || u.is_admin === '1' || u.is_admin === true);
      return `
      <tr>
        <td>${u.id}</td>
        <td>${name || '-'}</td>
        <td>${u.email || '-'}</td>
        <td>${u.phone || '-'}</td>
        <td>
          <span class="badge ${isAdminFlag ? 'badge-success' : 'badge-secondary'}">
            ${isAdminFlag ? 'Admin' : 'User'}
          </span>
        </td>
        <td>${created}</td>
        <td>
          <button class="btn btn-sm" data-toggle-admin="${u.id}" data-is-admin="${isAdminFlag ? 1 : 0}" 
                  style="background: ${isAdminFlag ? '#dc3545' : '#28a745'}; color: white; margin-right: 0.25rem;">
            <i class="fas ${isAdminFlag ? 'fa-user-minus' : 'fa-user-plus'}"></i>
            ${isAdminFlag ? 'Remove Admin' : 'Make Admin'}
          </button>
          <button class="btn btn-sm" data-delete-user="${u.id}" 
                  style="background: #dc3545; color: white; margin-right: 0.25rem;">
            <i class="fas fa-trash"></i>
            Delete
          </button>
          <button class="btn btn-sm" data-view-history="${u.id}" 
                  style="background: #2563eb; color: white;">
            <i class="fas fa-clock"></i>
            History
          </button>
        </td>
      </tr>
    `;}).join('');

    // Bind user action buttons
    tbody.querySelectorAll('[data-toggle-admin]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.dataset.toggleAdmin;
        const currentIsAdmin = btn.dataset.isAdmin === '1';
        const newIsAdmin = !currentIsAdmin;
        
        if (confirm(`${newIsAdmin ? 'Grant admin privileges to' : 'Remove admin privileges from'} this user?`)) {
          try {
            await toggleUserAdmin(userId, newIsAdmin);
            try {
              await fetch('api/users_history.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Admin-Id': String(user.id) },
                body: JSON.stringify({ user_id: Number(userId), action: 'toggle_admin', meta: { to_admin: newIsAdmin } })
              });
            } catch (_) {}
            showToast(`User ${newIsAdmin ? 'promoted to admin' : 'demoted to user'}`, 'success');
            initUsers();
          } catch (e) {
            showToast(e.message, 'error');
          }
        }
      });
    });

    tbody.querySelectorAll('[data-delete-user]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.dataset.deleteUser;
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          try {
            await deleteUser(userId);
            try {
              await fetch('api/users_history.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Admin-Id': String(user.id) },
                body: JSON.stringify({ user_id: Number(userId), action: 'delete_user' })
              });
            } catch (_) {}
            showToast('User deleted successfully', 'success');
            initUsers();
          } catch (e) {
            showToast(e.message, 'error');
          }
        }
      });
    });

    // View history modal
    tbody.querySelectorAll('[data-view-history]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const targetId = btn.dataset.viewHistory;
        try {
          const res = await fetch(`api/users_history.php?user_id=${encodeURIComponent(targetId)}`, {
            headers: { 'X-Admin-Id': String(user.id) }
          });
          const data = await res.json();
          const items = Array.isArray(data.items) ? data.items : [];
          const rows = items.length ? items.map(it => `
              <tr>
                <td>${new Date(it.created_at).toLocaleString()}</td>
                <td>${escapeHtml(it.action)}</td>
                <td>${it.actor_id}</td>
                <td>${escapeHtml(it.meta || '')}</td>
              </tr>
            `).join('') : '<tr><td colspan="4" style="color:#64748b;">No history</td></tr>';
          const html = `
            <div class="settings-modal">
              <h3 style="margin-top:0">User History</h3>
              <div style="max-height:60vh; overflow:auto; border:1px solid #e2e8f0; border-radius:10px;">
                <table class="admin-table" style="width:100%;">
                  <thead>
                    <tr><th>When</th><th>Action</th><th>Actor</th><th>Meta</th></tr>
                  </thead>
                  <tbody>
                    ${rows}
                  </tbody>
                </table>
              </div>
              <div class="modal-actions" style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
              </div>
            </div>`;
          if (typeof showModal === 'function') {
            showModal(html);
          } else {
            alert('History:\n' + items.map(it => `${it.created_at} - ${it.action}`).join('\n'));
          }
        } catch (e) {
          showToast(e.message || 'Failed to load history', 'error');
        }
      });
    });
  }

  async function initUsers() {
    try {
      const users = await fetchUsers();
      renderUsers(users);
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function init() {
    try {
      const slots = await fetchSlots();
      renderSlots(slots);
      initMap();
      renderMapMarkers(slots);
      renderDashboardStats(slots);
      // If arriving from map.php with a slotId, auto-fill form for editing
      try {
        const params = new URLSearchParams(window.location.search);
        const slotId = params.get('slotId');
        if (slotId) {
          const match = slots.find(s => String(s.id) === String(slotId));
          if (match) {
            activateSlotsView();
            populateForm(match);
            showToast('Loaded slot for editing', 'info');
          }
        }
      } catch (_) {}
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindForm();
    init();
    initUsers();
    // Notifications dropdown wiring
    try {
      const btn = document.getElementById('adminNotifBtn');
      const dd = document.getElementById('adminNotifDropdown');
      const badge = document.getElementById('adminNotifBadge');
      const listEl = document.getElementById('adminNotifList');
      function renderAdminNotifications() {
        const raw = localStorage.getItem('pf_notifications');
        let list = [];
        try { list = JSON.parse(raw) || []; } catch (_) { list = []; }
        if (badge) {
          badge.textContent = String(list.length || 0);
          badge.style.display = list.length ? 'inline-block' : 'none';
        }
        if (listEl) {
          listEl.innerHTML = list.length ? list.map(item => `<li style="padding:0.4rem 0; border-bottom:1px solid var(--pf-border);">
            <div style="font-weight:600;">${escapeHtml(item.title || 'Notification')}</div>
            <div style="color:var(--pf-muted);">${escapeHtml(item.message || '')}</div>
          </li>`).join('') : '<li style="color:var(--pf-muted);">No notifications yet</li>';
        }
      }
      if (btn && dd) {
        btn.addEventListener('click', () => {
          renderAdminNotifications();
          dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
        });
        document.addEventListener('click', (e) => {
          if (!dd.contains(e.target) && !btn.contains(e.target)) dd.style.display = 'none';
        });
      }
      window.addEventListener('storage', (e) => {
        if (e.key === 'pf_notifications' || e.key === 'pf_slots_event' || e.key === 'pf_custom_notice') renderAdminNotifications();
      });
      renderAdminNotifications();
    } catch (_) {}
  });

  // Slide navigation (sidebar)
  function initSlides() {
    const items = document.querySelectorAll('.sidebar-menu .menu-item[href^="#"]');
    const slides = document.querySelectorAll('.slide');
    function setActive(id) {
      const targetId = id || 'overview';
      slides.forEach(s => s.classList.toggle('active', s.id === targetId));
      document.querySelectorAll('.sidebar-menu .menu-item').forEach(a => {
        const href = a.getAttribute('href');
        a.classList.toggle('active', href === `#${targetId}`);
      });
      if (location.hash !== `#${targetId}`) {
        try { history.replaceState(null, '', `#${targetId}`); } catch (_) {}
      }
    }
    items.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const id = a.getAttribute('href').slice(1);
        setActive(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
    window.addEventListener('hashchange', () => setActive(location.hash.slice(1)));
    setActive(location.hash.slice(1));
  }

  // Initialize slides after DOM
  try { initSlides(); } catch (_) {}

  // Dashboard stats
  function renderDashboardStats(slots) {
    try {
      const totalSlots = slots.length;
      const totals = slots.reduce((acc, s) => {
        const cap = Number(s.capacity)||0; const occ = Number(s.occupied)||0;
        acc.capacity += cap; acc.occupied += occ; if (cap>0 && (occ/cap)>=0.9) acc.almostFull += 1; return acc;
      }, {capacity:0, occupied:0, almostFull:0});
      const availableSpots = Math.max(0, totals.capacity - totals.occupied);
      const avgOccPct = totals.capacity>0 ? Math.round((totals.occupied/totals.capacity)*100) : 0;
      const ringContainer = document.querySelector('.dash-ring');
      const lbl = document.getElementById('statAvgOccupancy');
      const setTxt = (id, val)=>{ const el=document.getElementById(id); if (el) el.textContent = String(val); };
      setTxt('statTotalSlots', totalSlots);
      setTxt('statAvailableSpots', availableSpots);
      setTxt('statAlmostFull', totals.almostFull);
      if (lbl) lbl.textContent = `${avgOccPct}%`;
      if (ringContainer) {
        ringContainer.style.background = `conic-gradient(#10b981 0% ${avgOccPct}%, #e5e7eb ${avgOccPct}% 100%)`;
      }
    } catch (_) {}
  }
})();
    // Keep marker in sync when typing coordinates
    const latEl = document.getElementById('slotLat');
    const lngEl = document.getElementById('slotLng');
    function syncMarkerFromInputs() {
      const lat = parseFloat(latEl?.value || '');
      const lng = parseFloat(lngEl?.value || '');
      if (isFinite(lat) && isFinite(lng) && adminMap) {
        ensurePickMarker({ lat, lng });
        try { adminMap.panTo([lat, lng]); } catch (_) {}
      }
    }
    if (latEl) latEl.addEventListener('change', syncMarkerFromInputs);
    if (lngEl) lngEl.addEventListener('change', syncMarkerFromInputs);