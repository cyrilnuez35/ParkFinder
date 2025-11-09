<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	json_response(['message' => 'Method not allowed'], 405);
}

$body = read_json_body();
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if (!$email || !$password) {
	json_response(['message' => 'Missing email or password'], 400);
}

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT id, first_name, last_name, email, phone, password_hash, is_admin FROM users WHERE email = ? LIMIT 1');
	$stmt->execute([$email]);
	$row = $stmt->fetch();
	if (!$row) {
		json_response(['message' => 'Invalid credentials'], 401);
	}

    if (!verify_password($password, $row['password_hash'])) {
        json_response(['message' => 'Invalid credentials'], 401);
    }

    // Optional: check entered password against policy and include advisory
    function check_policy_advisory(string $password): array {
        $length = strlen($password);
        $ok = $length >= 8 && preg_match('/[A-Z]/',$password) && preg_match('/[a-z]/',$password) && preg_match('/\d/',$password) && preg_match('/[^\w\s]/',$password) && !preg_match('/\s/',$password);
        $msg = $ok ? null : 'Your password does not meet current policy. Consider updating it for better security.';
        return ['password_policy_ok' => $ok, 'password_policy_message' => $msg];
    }
    $policy = check_policy_advisory($password);

    $user = [
        'id' => (int)$row['id'],
        'firstName' => $row['first_name'],
        'lastName' => $row['last_name'],
        'email' => $row['email'],
        'phone' => $row['phone'],
        'isAdmin' => ((int)$row['is_admin'] === 1),
    ];

    json_response(['user' => $user] + $policy, 200);
} catch (Throwable $e) {
    json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}


