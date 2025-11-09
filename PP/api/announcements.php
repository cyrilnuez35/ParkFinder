<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

// Methods:
// GET  /api/announcements.php               -> list latest announcements
// POST /api/announcements.php  (admin only) -> create announcement { title, message, severity }

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = get_pdo();

    // Ensure table exists
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS announcements (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            severity ENUM('info','warning','closure') NOT NULL DEFAULT 'info',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
    );

    if ($method === 'GET') {
        $limit = 50; // return latest up to 50
        $stmt = $pdo->prepare('SELECT id, title, message, severity, created_at FROM announcements ORDER BY created_at DESC, id DESC LIMIT ?');
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response(['items' => $items], 200);
    }

    if ($method === 'POST') {
        // Admin authentication via header
        $adminId = $_SERVER['HTTP_X_ADMIN_ID'] ?? null;
        if (!$adminId) json_response(['message' => 'Admin authentication required'], 401);
        $stmt = $pdo->prepare('SELECT is_admin FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$adminId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || (int)$row['is_admin'] !== 1) json_response(['message' => 'Admin privileges required'], 403);

        $body = read_json_body();
        $title = trim($body['title'] ?? '');
        $message = trim($body['message'] ?? '');
        $severity = strtolower(trim($body['severity'] ?? 'info'));
        if (!$title || !$message) json_response(['message' => 'Title and message are required'], 400);
        if (!in_array($severity, ['info','warning','closure'], true)) $severity = 'info';

        $ins = $pdo->prepare('INSERT INTO announcements (title, message, severity) VALUES (?, ?, ?)');
        $ins->execute([$title, $message, $severity]);
        $id = (int)$pdo->lastInsertId();

        $stmt = $pdo->prepare('SELECT id, title, message, severity, created_at FROM announcements WHERE id = ?');
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response(['success' => true, 'item' => $item], 201);
    }

    if ($method === 'PUT') {
        // Update announcement (admin only)
        $adminId = $_SERVER['HTTP_X_ADMIN_ID'] ?? null;
        if (!$adminId) json_response(['message' => 'Admin authentication required'], 401);
        $stmt = $pdo->prepare('SELECT is_admin FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$adminId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || (int)$row['is_admin'] !== 1) json_response(['message' => 'Admin privileges required'], 403);

        $body = read_json_body();
        $id = (int)($body['id'] ?? 0);
        $title = trim($body['title'] ?? '');
        $message = trim($body['message'] ?? '');
        $severity = strtolower(trim($body['severity'] ?? 'info'));
        if ($id <= 0) json_response(['message' => 'Announcement id required'], 400);
        if (!$title || !$message) json_response(['message' => 'Title and message are required'], 400);
        if (!in_array($severity, ['info','warning','closure'], true)) $severity = 'info';

        $upd = $pdo->prepare('UPDATE announcements SET title = ?, message = ?, severity = ? WHERE id = ?');
        $upd->execute([$title, $message, $severity, $id]);

        $stmt = $pdo->prepare('SELECT id, title, message, severity, created_at FROM announcements WHERE id = ?');
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        json_response(['success' => true, 'item' => $item], 200);
    }

    if ($method === 'DELETE') {
        // Delete announcement (admin only)
        $adminId = $_SERVER['HTTP_X_ADMIN_ID'] ?? null;
        if (!$adminId) json_response(['message' => 'Admin authentication required'], 401);
        $stmt = $pdo->prepare('SELECT is_admin FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$adminId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || (int)$row['is_admin'] !== 1) json_response(['message' => 'Admin privileges required'], 403);

        $id = 0;
        if (isset($_GET['id'])) {
            $id = (int)$_GET['id'];
        } else {
            $body = read_json_body();
            $id = (int)($body['id'] ?? 0);
        }
        if ($id <= 0) json_response(['message' => 'Announcement id required'], 400);

        $del = $pdo->prepare('DELETE FROM announcements WHERE id = ?');
        $del->execute([$id]);
        json_response(['success' => true], 200);
    }

    json_response(['message' => 'Method not allowed'], 405);
} catch (Throwable $e) {
    json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}
?>