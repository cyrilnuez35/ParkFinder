<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

$method = $_SERVER['REQUEST_METHOD'];

// Simple admin check using header X-Admin-Id (client passes logged-in admin user id)
function require_admin($pdo) {
    $adminId = intval($_SERVER['HTTP_X_ADMIN_ID'] ?? 0);
    if ($adminId <= 0) {
        json_response(['message' => 'Admin authentication required'], 401);
    }
    $stmt = $pdo->prepare('SELECT is_admin FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$adminId]);
    $row = $stmt->fetch();
    if (!$row || intval($row['is_admin']) !== 1) {
        json_response(['message' => 'Forbidden: admin only'], 403);
    }
}

try {
    $pdo = get_pdo();
    // Ensure table exists
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS parking_slots (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            type ENUM('street','lot','garage','valet') NOT NULL DEFAULT 'street',
            address VARCHAR(255) NOT NULL,
            latitude DECIMAL(9,6) NOT NULL,
            longitude DECIMAL(9,6) NOT NULL,
            price DECIMAL(10,2) NOT NULL DEFAULT 0,
            duration VARCHAR(50) NOT NULL DEFAULT '2 hours',
            capacity INT NOT NULL DEFAULT 0,
            occupied INT NOT NULL DEFAULT 0,
            features TEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
    );

    if ($method === 'OPTIONS') {
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-Admin-Id');
        exit;
    }

    if ($method === 'GET') {
        // List all parking slots
        $stmt = $pdo->query('SELECT * FROM parking_slots ORDER BY updated_at DESC');
        $rows = $stmt->fetchAll();
        json_response(['items' => $rows], 200);
    }

    // Admin-only operations
    require_admin($pdo);

    $body = read_json_body();

    if ($method === 'POST') {
        $ins = $pdo->prepare('INSERT INTO parking_slots (name, type, address, latitude, longitude, price, duration, capacity, occupied, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $ins->execute([
            trim($body['name'] ?? ''),
            trim($body['type'] ?? 'street'),
            trim($body['address'] ?? ''),
            floatval($body['latitude'] ?? 0),
            floatval($body['longitude'] ?? 0),
            floatval($body['price'] ?? 0),
            trim($body['duration'] ?? '2 hours'),
            intval($body['capacity'] ?? 0),
            intval($body['occupied'] ?? 0),
            isset($body['features']) ? (is_array($body['features']) ? implode(', ', $body['features']) : trim($body['features'])) : null
        ]);
        $id = intval($pdo->lastInsertId());
        json_response(['id' => $id], 201);
    }

    if ($method === 'PUT') {
        $id = intval($body['id'] ?? 0);
        if ($id <= 0) json_response(['message' => 'Missing id'], 400);
        $upd = $pdo->prepare('UPDATE parking_slots SET name=?, type=?, address=?, latitude=?, longitude=?, price=?, duration=?, capacity=?, occupied=?, features=? WHERE id=?');
        $upd->execute([
            trim($body['name'] ?? ''),
            trim($body['type'] ?? 'street'),
            trim($body['address'] ?? ''),
            floatval($body['latitude'] ?? 0),
            floatval($body['longitude'] ?? 0),
            floatval($body['price'] ?? 0),
            trim($body['duration'] ?? '2 hours'),
            intval($body['capacity'] ?? 0),
            intval($body['occupied'] ?? 0),
            isset($body['features']) ? (is_array($body['features']) ? implode(', ', $body['features']) : trim($body['features'])) : null,
            $id
        ]);
        json_response(['updated' => true], 200);
    }

    if ($method === 'DELETE') {
        $id = intval($_GET['id'] ?? $body['id'] ?? 0);
        if ($id <= 0) json_response(['message' => 'Missing id'], 400);
        $del = $pdo->prepare('DELETE FROM parking_slots WHERE id = ?');
        $del->execute([$id]);
        json_response(['deleted' => true], 200);
    }

    json_response(['message' => 'Method not allowed'], 405);
} catch (Throwable $e) {
    json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}