<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

// Routes:
// POST /api/settings.php  JSON { action, user_id, current_password?, new_password?, confirm_password? }
// action: 'change_password' or 'delete_account'

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
	json_response(['message' => 'Method not allowed'], 405);
}

try {
	$pdo = get_pdo();
	$body = read_json_body();
	
	// Debug: Log the received data
	error_log('Settings API - Received data: ' . json_encode($body));
	error_log('Settings API - Action: ' . $action . ', User ID: ' . $userId);
	
	$action = $body['action'] ?? '';
	$userId = (int)($body['user_id'] ?? 0);
	
	if ($userId <= 0) {
		json_response(['message' => 'Missing or invalid user_id'], 400);
	}
	
	if (empty($action)) {
		json_response(['message' => 'Missing action parameter'], 400);
	}
	
	if ($action === 'change_password') {
		$currentPassword = $body['current_password'] ?? '';
		$newPassword = $body['new_password'] ?? '';
		$confirmPassword = $body['confirm_password'] ?? '';
		
		// Validate input
		if (empty($currentPassword)) {
			json_response(['message' => 'Current password is required'], 400);
		}
		if (empty($newPassword)) {
			json_response(['message' => 'New password is required'], 400);
		}
		if (empty($confirmPassword)) {
			json_response(['message' => 'Confirm password is required'], 400);
		}
		
		if ($newPassword !== $confirmPassword) {
			json_response(['message' => 'New passwords do not match'], 400);
		}
		
        if (strlen($newPassword) < 8) {
            json_response(['message' => 'New password must be at least 8 characters'], 400);
        }
		
		// Get current user data
		$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
		if (!$stmt) {
			json_response(['message' => 'Database error: Failed to prepare statement'], 500);
		}
		
		$result = $stmt->execute([$userId]);
		if (!$result) {
			error_log('Settings API - Failed to execute user query for user ID: ' . $userId);
			json_response(['message' => 'Database error: Failed to execute query'], 500);
		}
		
		$user = $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$user) {
			json_response(['message' => 'User not found'], 404);
		}
		
		// Verify current password
		if (!verify_password($currentPassword, $user['password_hash'])) {
			json_response(['message' => 'Current password is incorrect'], 400);
		}
		
		// Update password
		$newPasswordHash = hash_password($newPassword);
		$updateStmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
		if (!$updateStmt) {
			json_response(['message' => 'Database error: Failed to prepare update statement'], 500);
		}
		
		$updateResult = $updateStmt->execute([$newPasswordHash, $userId]);
		if (!$updateResult) {
			json_response(['message' => 'Database error: Failed to update password'], 500);
		}
		
		json_response(['message' => 'Password changed successfully']);
	}
	
	elseif ($action === 'delete_account') {
		$currentPassword = $body['current_password'] ?? '';
		
		if (empty($currentPassword)) {
			json_response(['message' => 'Current password is required to delete account'], 400);
		}
		
		// Get current user data
		$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
		if (!$stmt) {
			json_response(['message' => 'Database error: Failed to prepare statement'], 500);
		}
		
		$result = $stmt->execute([$userId]);
		if (!$result) {
			error_log('Settings API - Failed to execute user query for user ID: ' . $userId);
			json_response(['message' => 'Database error: Failed to execute query'], 500);
		}
		
		$user = $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$user) {
			json_response(['message' => 'User not found'], 404);
		}
		
		// Verify current password
		if (!verify_password($currentPassword, $user['password_hash'])) {
			json_response(['message' => 'Current password is incorrect'], 400);
		}
		
		// Delete user and related data
		try {
			$pdo->beginTransaction();
			
			// Delete user profile first (foreign key constraint)
			$profileStmt = $pdo->prepare('DELETE FROM user_profiles WHERE user_id = ?');
			if (!$profileStmt) {
				throw new Exception('Failed to prepare profile deletion statement');
			}
			$profileResult = $profileStmt->execute([$userId]);
			if (!$profileResult) {
				throw new Exception('Failed to delete user profile');
			}
			
			// Delete user account
			$userStmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
			if (!$userStmt) {
				throw new Exception('Failed to prepare user deletion statement');
			}
			$userResult = $userStmt->execute([$userId]);
			if (!$userResult) {
				throw new Exception('Failed to delete user account');
			}
			
			$pdo->commit();
			json_response(['message' => 'Account deleted successfully']);
			
		} catch (Exception $e) {
			if ($pdo->inTransaction()) {
				$pdo->rollBack();
			}
			json_response(['message' => 'Failed to delete account: ' . $e->getMessage()], 500);
		}
	}
	
	else {
		json_response(['message' => 'Invalid action. Use "change_password" or "delete_account"'], 400);
	}
	
} catch (Throwable $e) {
	json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}
