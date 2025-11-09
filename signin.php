<?php /* Standalone Sign In page */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In - ParkingFinder</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { background:#CBDCEB; }
    .auth-page { min-height: 100vh; display:grid; place-items:center; padding: 1.25rem; }
    .auth-card { width: min(640px, 94vw); background:#fff; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 10px 24px rgba(0,0,0,0.08); display:grid; grid-template-columns: 1fr 1fr; overflow:hidden; }
    .auth-brand-page { background: linear-gradient(135deg, #2dd4bf 0%, #0ea5e9 100%); color:#fff; padding: 1.5rem; display:flex; flex-direction:column; justify-content:center; }
    .auth-brand-page h2 { font-size: 1.6rem; margin:0 0 0.5rem 0; }
    .auth-brand-page p { color: rgba(255,255,255,0.9); margin:0 0 1rem 0; }
    .auth-brand-page a { display:inline-block; border:2px solid #fff; color:#fff; padding:0.6rem 1.1rem; border-radius:999px; text-decoration:none; font-weight:700; }
    .auth-card .form-side { padding: 1.25rem; display:flex; flex-direction:column; justify-content:center; }
    .back-link { position: fixed; top: 16px; left: 16px; display:flex; align-items:center; gap:8px; color:#334155; text-decoration:none; background:#fff; border:1px solid #e5e7eb; padding:8px 12px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.08); }
    .back-link:hover { color:#1e40af; border-color:#93c5fd; }
    @media (max-width: 768px) { .auth-card { grid-template-columns: 1fr; } .auth-brand-page { display:none; } }
    .input-group { position: relative; }
    .toggle-password { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6b7280; cursor: pointer; padding: 4px; }
    .toggle-password:hover { color: #334155; }
    .pw-hint { font-size: 0.9rem; color:#6b7280; margin-top:6px; }
    .pw-hint.bad { color:#ef4444; }

    /* Minimalist inputs/buttons */
    .form-group label { font-size: 0.95rem; }
    .input-group input { padding: 0.8rem; font-size: 0.95rem; }
    .btn-auth-submit { padding: 0.7rem 1rem; font-size: 0.95rem; border-radius: 10px; }

    /* Responsive enhancements */
    @media (max-width: 768px) {
      .auth-card { grid-template-columns: 1fr; width: 100%; max-width: 100%; border-radius: 0; box-shadow: none; }
      .auth-card .form-side { padding: 1rem; }
      .form-group label { font-size: 0.85rem; }
      .input-group input { padding: 0.6rem; font-size: 0.9rem; }
      .back-link { top: 10px; left: 10px; padding:4px 8px; font-size: 0.85rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      .back-link i { font-size: 0.9rem; }
      .auth-brand-page { display:none; }
      .btn-auth-submit { width: 100%; padding: 0.65rem 0.9rem; font-size: 0.9rem; }
      /* Minimalist: hide extras on mobile */
      .social-auth, .auth-divider { display: none; }
      .form-options { justify-content: space-between; }
    }
    @media (max-width: 480px) {
      .auth-card .form-side { padding: 0.75rem; }
      .form-group label { font-size: 0.8rem; }
      .input-group input { padding: 0.45rem; font-size: 0.8rem; }
      .btn-auth-submit { padding: 0.6rem 0.85rem; font-size: 0.85rem; border-radius: 8px; }
      .pw-hint { font-size: 0.85rem; }
      .back-link { display: inline-flex; top: 8px; left: 8px; padding:3px 6px; font-size: 0.8rem; border-radius: 7px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
      .back-link i { font-size: 0.85rem; }
    }
  </style>
</head>
<body>
  <div class="auth-page">
    <a href="index.php" class="back-link"><i class="fas fa-arrow-left"></i> Home</a>
    <div class="auth-card">
      <div class="auth-brand-page">
        <h2>Welcome Back!</h2>
        <p>To keep connected with us please login with your personal info.</p>
        <a href="signup.php"><i class="fas fa-user-plus"></i> Create Account</a>
      </div>
      <div class="form-side">
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
              <button type="button" class="toggle-password" aria-label="Show password" data-target="loginPassword"><i class="fas fa-eye"></i></button>
            </div>
            <div class="error-message" id="loginPasswordError"></div>
            <div class="pw-hint" id="loginPwHint">Tip: use at least 8 characters with a mix of letters, numbers, and symbols.</div>
          </div>
          <div class="form-options">
            <label class="checkbox-label"><input type="checkbox" id="rememberMe"> <span class="checkmark"></span> Remember me</label>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" class="btn-auth-submit" id="loginSubmitBtn"><span class="btn-text">Sign In</span></button>
          <div class="auth-switch"><p>Don't have an account? <a href="signup.php">Sign up</a></p></div>
        </form>
      </div>
    </div>
  </div>

  <script>
  async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!email || !password) { alert('Please enter email and password'); return; }
    // Soft validation: show hint, do not block sign-in
    const okLen = password.length >= 8;
    const hasMix = /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^\w\s]/.test(password);
    const hint = document.getElementById('loginPwHint');
    if (hint) { hint.className = (!okLen || !hasMix) ? 'pw-hint bad' : 'pw-hint'; }
    try {
      const res = await fetch('api/auth_login.php', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('user', JSON.stringify(data.user || data));
      // Redirect: admin if is_admin, else home
      const u = data.user || data;
      if (u && (u.is_admin === 1 || u.is_admin === '1')) { window.location.href = 'admin.php'; } else { window.location.href = 'index.php'; }
      // Show advisory if weak password (optional UX)
      if (data.password_policy_ok === false && data.password_policy_message) {
        alert(data.password_policy_message);
      }
    } catch (err) {
      alert(err.message);
    }
  }
  document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
  // Eye toggle
  (function(){
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;
        const icon = btn.querySelector('i');
        if (input.type === 'password') { input.type = 'text'; icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); btn.setAttribute('aria-label','Hide password'); }
        else { input.type = 'password'; icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); btn.setAttribute('aria-label','Show password'); }
      });
    });
  })();
  </script>
</body>
</html>