<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	json_response(['message' => 'Method not allowed'], 405);
}

$body = read_json_body();
$firstName = trim($body['firstName'] ?? '');
$lastName = trim($body['lastName'] ?? '');
$email = trim($body['email'] ?? '');
$phone = trim($body['phone'] ?? '');
$password = $body['password'] ?? '';

if (!$firstName || !$lastName || !$email || !$password) {
    json_response(['message' => 'Missing required fields'], 400);
}

// Password policy validation
function validate_password_policy(string $password, string $email, string $firstName, string $lastName): array {
    $errors = [];
    $length = strlen($password);
    if ($length < 8) { $errors[] = 'Password must be at least 8 characters.'; }
    if (!preg_match('/[A-Z]/', $password)) { $errors[] = 'Include at least one uppercase letter.'; }
    if (!preg_match('/[a-z]/', $password)) { $errors[] = 'Include at least one lowercase letter.'; }
    if (!preg_match('/\d/', $password)) { $errors[] = 'Include at least one number.'; }
    if (!preg_match('/[^\w\s]/', $password)) { $errors[] = 'Include at least one special character.'; }
    if (preg_match('/\s/', $password)) { $errors[] = 'Password must not contain spaces.'; }
    $emailLocal = strtolower((string)preg_replace('/@.*/','',$email));
    $lcPass = strtolower($password);
    if ($emailLocal && $emailLocal !== '' && str_contains($lcPass, $emailLocal)) { $errors[] = 'Password should not contain your email.'; }
    if ($firstName && str_contains($lcPass, strtolower($firstName))) { $errors[] = 'Password should not contain your first name.'; }
    if ($lastName && str_contains($lcPass, strtolower($lastName))) { $errors[] = 'Password should not contain your last name.'; }
    $common = ['password','123456','12345678','qwerty','letmein','admin','welcome','iloveyou','abc123'];
    if (in_array(strtolower($password), $common, true)) { $errors[] = 'Password is too common.'; }
    return $errors;
}

$policyErrors = validate_password_policy($password, $email, $firstName, $lastName);
if (!empty($policyErrors)) {
    json_response(['message' => 'Password does not meet policy','errors' => $policyErrors], 422);
}

try {
	$pdo = get_pdo();
	// Ensure table exists
	$pdo->exec(
		"CREATE TABLE IF NOT EXISTS users (
			id INT AUTO_INCREMENT PRIMARY KEY,
			first_name VARCHAR(100) NOT NULL,
			last_name VARCHAR(100) NOT NULL,
			email VARCHAR(255) NOT NULL UNIQUE,
			phone VARCHAR(50) NULL,
			password_hash VARCHAR(255) NOT NULL,
			is_admin TINYINT(1) NOT NULL DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
	);

	// Ensure is_admin column exists if table was created previously
	try {
		$pdo->exec("ALTER TABLE users ADD COLUMN is_admin TINYINT(1) NOT NULL DEFAULT 0");
	} catch (Throwable $e) {
		// Ignore if column already exists
	}

	// Check if email exists
	$check = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
	$check->execute([$email]);
	if ($check->fetch()) {
		json_response(['message' => 'Email already registered'], 409);
	}

    $hash = hash_password($password);
	// Make the very first user an admin; others default to normal users
	$countStmt = $pdo->query('SELECT COUNT(*) AS cnt FROM users');
	$cntRow = $countStmt->fetch();
	$isAdmin = ($cntRow && (int)$cntRow['cnt'] === 0) ? 1 : 0;

	$ins = $pdo->prepare('INSERT INTO users (first_name, last_name, email, phone, password_hash, is_admin) VALUES (?, ?, ?, ?, ?, ?)');
	$ins->execute([$firstName, $lastName, $email, $phone, $hash, $isAdmin]);
	$id = (int)$pdo->lastInsertId();

	$user = [
		'id' => $id,
		'firstName' => $firstName,
		'lastName' => $lastName,
		'email' => $email,
		'phone' => $phone,
		'isAdmin' => $isAdmin === 1,
	];

	json_response(['user' => $user], 201);
} catch (Throwable $e) {
	json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}


