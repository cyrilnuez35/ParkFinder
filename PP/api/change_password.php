<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

// Routes:
// POST /api/change_password.php  JSON { user_id, current_password, new_password }

$method = $_SERVER['REQUEST_METHOD'];

try {
	$pdo = get_pdo();
	
	if ($method === 'POST') {
		$body = read_json_body();
		$userId = (int)($body['user_id'] ?? 0);
		$currentPassword = trim($body['current_password'] ?? '');
		$newPassword = trim($body['new_password'] ?? '');
		
		if ($userId <= 0) json_response(['message' => 'Missing user_id'], 400);
		if (!$currentPassword) json_response(['message' => 'Current password is required'], 400);
		if (!$newPassword) json_response(['message' => 'New password is required'], 400);
        if (strlen($newPassword) < 8) json_response(['message' => 'New password must be at least 8 characters'], 400);
		
		// Get current user data
		$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
		$stmt->execute([$userId]);
		$user = $stmt->fetch();
		
		if (!$user) json_response(['message' => 'User not found'], 404);
		
		// Verify current password
		if (!password_verify($currentPassword, $user['password_hash'])) {
			json_response(['message' => 'Current password is incorrect'], 400);
		}
		
		// Hash new password
		$newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
		
		// Update password
		$stmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
		$stmt->execute([$newPasswordHash, $userId]);
		
		json_response(['message' => 'Password changed successfully']);
	}
	
	json_response(['message' => 'Method not allowed'], 405);
} catch (Throwable $e) {
	json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}
