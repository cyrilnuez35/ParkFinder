<?php
require_once 'db.php';
require_once 'util.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Id');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Admin authentication via header
$adminId = $_SERVER['HTTP_X_ADMIN_ID'] ?? null;
if (!$adminId) {
    http_response_code(401);
    echo json_encode(['error' => 'Admin authentication required']);
    exit;
}

try {
    $pdo = get_pdo();

    // Verify admin status
    $stmt = $pdo->prepare('SELECT is_admin FROM users WHERE id = ?');
    $stmt->execute([$adminId]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$admin || (int)$admin['is_admin'] !== 1) {
        http_response_code(403);
        echo json_encode(['error' => 'Admin privileges required']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Return all users (match schema.sql)
        $stmt = $pdo->query(
            'SELECT id, first_name, last_name, email, phone, is_admin, created_at FROM users ORDER BY created_at DESC'
        );
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['users' => $users]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Toggle admin flag for a user
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $userId = $input['id'] ?? null;
        $isAdmin = isset($input['is_admin']) ? (int)$input['is_admin'] : null;
        if (!$userId || $isAdmin === null) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID and is_admin required']);
            exit;
        }
        if ((int)$userId === (int)$adminId && $isAdmin === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot remove your own admin privileges']);
            exit;
        }
        $stmt = $pdo->prepare('UPDATE users SET is_admin = ? WHERE id = ?');
        $stmt->execute([$isAdmin, $userId]);
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete user account
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $userId = $input['id'] ?? null;
        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID required']);
            exit;
        }
        if ((int)$userId === (int)$adminId) {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot delete your own account']);
            exit;
        }
        $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>