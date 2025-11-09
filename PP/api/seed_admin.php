<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

// Simple seeding endpoint to create a default admin account for local dev
// Visit this in the browser to seed: /api/seed_admin.php

cors();

try {
    $pdo = get_pdo();

    // Ensure users table has is_admin
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
    try { $pdo->exec("ALTER TABLE users ADD COLUMN is_admin TINYINT(1) NOT NULL DEFAULT 0"); } catch (Throwable $e) { /* ignore */ }

    $email = 'admin@parkingfinder.local';
    $password = 'Admin@123';
    $firstName = 'Admin';
    $lastName = 'User';

    // Check if admin already exists
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        json_response(['message' => 'Admin account already exists', 'email' => $email], 200);
    }

    // Create admin user
    $hash = hash_password($password);
    $ins = $pdo->prepare('INSERT INTO users (first_name, last_name, email, phone, password_hash, is_admin) VALUES (?, ?, ?, ?, ?, 1)');
    $ins->execute([$firstName, $lastName, $email, '', $hash]);
    $id = (int)$pdo->lastInsertId();

    json_response([
        'message' => 'Admin account created',
        'email' => $email,
        'password' => $password,
        'id' => $id
    ], 201);
} catch (Throwable $e) {
    json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}