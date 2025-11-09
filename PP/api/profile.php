<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

// Routes:
// GET  /api/profile.php?user_id=1           -> get profile
// POST /api/profile.php  JSON { user_id, vehicle_make, vehicle_plate, address }

$method = $_SERVER['REQUEST_METHOD'];

try {
	$pdo = get_pdo();
    // Ensure profile table exists (idempotent)
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS user_profiles (
            user_id INT PRIMARY KEY,
            vehicle_make VARCHAR(100) NULL,
            vehicle_plate VARCHAR(50) NULL,
            address VARCHAR(255) NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
    );
	if ($method === 'GET') {
		$userId = (int)($_GET['user_id'] ?? 0);
		if ($userId <= 0) json_response(['message' => 'Missing user_id'], 400);
		$stmt = $pdo->prepare('SELECT u.id as user_id, u.first_name, u.last_name, u.email, u.phone, p.vehicle_make, p.vehicle_plate, p.address FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id WHERE u.id = ? LIMIT 1');
		$stmt->execute([$userId]);
		$row = $stmt->fetch();
		if (!$row) json_response(['message' => 'User not found'], 404);
		json_response(['profile' => $row]);
	}

	if ($method === 'POST') {
    $body = read_json_body();
    $userId = (int)($body['user_id'] ?? 0);
    if ($userId <= 0) json_response(['message' => 'Missing user_id'], 400);
    $vehicleMake = trim($body['vehicle_make'] ?? '');
    $vehiclePlate = trim($body['vehicle_plate'] ?? '');
    $address = trim($body['address'] ?? '');
    // Optional updates for core user fields
    $firstName = isset($body['first_name']) ? trim($body['first_name']) : null;
    $lastName = isset($body['last_name']) ? trim($body['last_name']) : null;
    $phone = isset($body['phone']) ? trim($body['phone']) : null;

    $pdo->beginTransaction();
    $pdo->prepare('INSERT IGNORE INTO user_profiles (user_id) VALUES (?)')->execute([$userId]);
    $upd = $pdo->prepare('UPDATE user_profiles SET vehicle_make = ?, vehicle_plate = ?, address = ? WHERE user_id = ?');
    $upd->execute([$vehicleMake ?: null, $vehiclePlate ?: null, $address ?: null, $userId]);
    // Update users table if core fields provided
    if ($firstName !== null || $lastName !== null || $phone !== null) {
        $stmt = $pdo->prepare('UPDATE users SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), phone = COALESCE(?, phone) WHERE id = ?');
        $stmt->execute([
            ($firstName !== null && $firstName !== '') ? $firstName : null,
            ($lastName !== null && $lastName !== '') ? $lastName : null,
            ($phone !== null && $phone !== '') ? $phone : null,
            $userId
        ]);
    }
    $pdo->commit();

		json_response(['message' => 'Profile saved']);
	}

	json_response(['message' => 'Method not allowed'], 405);
} catch (Throwable $e) {
	json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}


