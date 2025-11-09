<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

// Routes:
// POST /api/delete_account.php  JSON { user_id }

$method = $_SERVER['REQUEST_METHOD'];

try {
	$pdo = get_pdo();
	
	if ($method === 'POST') {
		$body = read_json_body();
		$userId = (int)($body['user_id'] ?? 0);
		
		if ($userId <= 0) json_response(['message' => 'Missing user_id'], 400);
		
		// Check if user exists
		$stmt = $pdo->prepare('SELECT id FROM users WHERE id = ? LIMIT 1');
		$stmt->execute([$userId]);
		$user = $stmt->fetch();
		
		if (!$user) json_response(['message' => 'User not found'], 404);
		
		// Delete user (cascade will handle user_profiles)
		$stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
		$stmt->execute([$userId]);
		
		json_response(['message' => 'Account deleted successfully']);
	}
	
	json_response(['message' => 'Method not allowed'], 405);
} catch (Throwable $e) {
	json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}
