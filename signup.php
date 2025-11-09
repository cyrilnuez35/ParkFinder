<?php /* Standalone Sign Up page */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign Up - ParkingFinder</title>
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
    /* Eye toggle styles */
    .input-group { position: relative; }
    .toggle-password { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6b7280; cursor: pointer; padding: 4px; }
    .toggle-password:hover { color: #334155; }
    /* Password policy UI */
    .policy { margin-top: 8px; font-size: 0.9rem; color:#334155; }
    .policy-list { list-style:none; padding:0; margin:8px 0 0 0; }
    .policy-list li { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
    .policy-list li i { width:18px; }
    .policy-ok { color:#10b981; }
    .policy-bad { color:#ef4444; }
    .strength-bar { height:8px; background:#e5e7eb; border-radius:999px; margin-top:8px; overflow:hidden; }
    .strength-fill { height:100%; width:0%; background:#ef4444; transition:width .2s ease, background .2s ease; }

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
      /* Show password policy hints on mobile */
      .policy-list { display: block; }
      .policy { font-size: 0.85rem; }
    }
    @media (max-width: 480px) {
      .auth-card .form-side { padding: 0.75rem; }
      .form-group label { font-size: 0.8rem; }
      .input-group input { padding: 0.45rem; font-size: 0.8rem; }
      .btn-auth-submit { padding: 0.6rem 0.85rem; font-size: 0.85rem; border-radius: 8px; }
      .policy { font-size: 0.8rem; }
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
        <h2>Create Account</h2>
        <p>Or sign in with your existing credentials.</p>
        <a href="signin.php"><i class="fas fa-sign-in-alt"></i> Sign In</a>
      </div>
      <div class="form-side">
        <form class="auth-form" id="signupForm">
          <div class="form-group">
            <label for="signupFirstName">First Name</label>
            <div class="input-group"><i class="fas fa-user"></i><input type="text" id="signupFirstName" name="firstName" placeholder="Enter your first name" required></div>
            <small style="font-size:0.85rem;color:#64748b;margin-top:4px;display:block;">Ex. Romel</small>
          </div>
          <div class="form-group">
            <label for="signupLastName">Last Name</label>
            <div class="input-group"><i class="fas fa-user"></i><input type="text" id="signupLastName" name="lastName" placeholder="Enter your last name" required></div>
            <small style="font-size:0.85rem;color:#64748b;margin-top:4px;display:block;">Ex. Avelino</small>
          </div>
          <div class="form-group">
            <label for="signupEmail">Email Address</label>
            <div class="input-group"><i class="fas fa-envelope"></i><input type="email" id="signupEmail" name="email" placeholder="Enter your email" required></div>
            <small style="font-size:0.85rem;color:#64748b;margin-top:4px;display:block;">Ex. Jomel@gmail.com</small>
          </div>
          <div class="form-group">
            <label for="signupPhone">Phone Number</label>
            <div class="input-group"><i class="fas fa-phone"></i><input type="tel" id="signupPhone" name="phone" placeholder="Enter your phone number" required inputmode="numeric" pattern="[0-9]*" autocomplete="tel" oninput="this.value=this.value.replace(/[^0-9]/g,'')"></div>
            <small style="font-size:0.85rem;color:#64748b;margin-top:4px;display:block;">Ex. 09123456789 or +639123456789</small>
          </div>
          <div class="form-group">
            <label for="signupPassword">Password</label>
            <div class="input-group"><i class="fas fa-lock"></i><input type="password" id="signupPassword" name="password" placeholder="Create a password" required><button type="button" class="toggle-password" aria-label="Show password" data-target="signupPassword"><i class="fas fa-eye"></i></button></div>
            <div class="policy">
              <div class="strength-bar"><div id="pwStrengthFill" class="strength-fill"></div></div>
              <ul class="policy-list" id="pwPolicyList">
                <li><i id="polLen" class="fas fa-circle policy-bad"></i> At least 8 characters</li>
                <li><i id="polUpper" class="fas fa-circle policy-bad"></i> One uppercase letter</li>
                <li><i id="polLower" class="fas fa-circle policy-bad"></i> One lowercase letter</li>
                <li><i id="polDigit" class="fas fa-circle policy-bad"></i> One number</li>
                <li><i id="polSpecial" class="fas fa-circle policy-bad"></i> One special character</li>
                <li><i id="polSpace" class="fas fa-circle policy-bad"></i> No spaces</li>
              </ul>
            </div>
          </div>
          <div class="form-group">
            <label for="signupConfirmPassword">Confirm Password</label>
            <div class="input-group"><i class="fas fa-lock"></i><input type="password" id="signupConfirmPassword" name="confirmPassword" placeholder="Confirm your password" required><button type="button" class="toggle-password" aria-label="Show confirm password" data-target="signupConfirmPassword"><i class="fas fa-eye"></i></button></div>
          </div>
          <div class="form-group">
            <label class="checkbox-label"><input type="checkbox" id="agreeTerms" required> <span class="checkmark"></span> I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
          </div>
          <button type="submit" class="btn-auth-submit" id="signupSubmitBtn"><span class="btn-text">Create Account</span></button>
          <div class="auth-switch"><p>Already have an account? <a href="signin.php">Sign in</a></p></div>
        </form>
      </div>
    </div>
  </div>

  <script>
  // Eye toggle handlers
  function setupPasswordToggles(){
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
  }
  setupPasswordToggles();
  function evaluatePassword(pw) {
    const checks = {
      len: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      digit: /\d/.test(pw),
      special: /[^\w\s]/.test(pw),
      space: !/\s/.test(pw)
    };
    const passed = Object.values(checks).filter(Boolean).length;
    const fill = document.getElementById('pwStrengthFill');
    if (fill) {
      const percent = Math.round((passed/6)*100);
      fill.style.width = percent + '%';
      fill.style.background = passed >= 5 ? '#10b981' : passed >= 4 ? '#f59e0b' : '#ef4444';
    }
    function setIcon(id, ok) { const el = document.getElementById(id); if (el) el.className = ok ? 'fas fa-check policy-ok' : 'fas fa-circle policy-bad'; }
    setIcon('polLen', checks.len);
    setIcon('polUpper', checks.upper);
    setIcon('polLower', checks.lower);
    setIcon('polDigit', checks.digit);
    setIcon('polSpecial', checks.special);
    setIcon('polSpace', checks.space);
    return passed >= 5; // require 5/6
  }

  async function handleSignupSubmit(e) {
    e.preventDefault();
    const payload = {
      firstName: document.getElementById('signupFirstName').value.trim(),
      lastName: document.getElementById('signupLastName').value.trim(),
      email: document.getElementById('signupEmail').value.trim(),
      phone: document.getElementById('signupPhone').value.trim(),
      password: document.getElementById('signupPassword').value
    };
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const agreed = document.getElementById('agreeTerms').checked;
    if (!agreed) { alert('Please agree to the terms to continue'); return; }
    if (!payload.email || !payload.password) { alert('Please complete all fields'); return; }
    if (!evaluatePassword(payload.password)) { alert('Password does not meet the policy shown.'); return; }
    if (payload.password !== confirmPassword) { alert('Passwords do not match'); return; }
    try {
      const res = await fetch('api/auth_signup.php', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error((data && data.errors) ? data.errors.join('\n') : (data.message || 'Signup failed'));
      alert('Account created successfully. You can now sign in.');
      window.location.href = 'signin.php';
    } catch (err) {
      alert(err.message);
    }
  }
  document.getElementById('signupForm').addEventListener('submit', handleSignupSubmit);
  document.getElementById('signupPassword').addEventListener('input', (e)=> evaluatePassword(e.target.value));
  </script>
</body>
</html>