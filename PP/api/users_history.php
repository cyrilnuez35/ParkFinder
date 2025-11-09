<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = get_pdo();

    // Ensure history table exists
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS user_activity (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            actor_id INT NOT NULL,
            action VARCHAR(100) NOT NULL,
            meta JSON NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user (user_id),
            INDEX idx_actor (actor_id),
            CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT fk_activity_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
    );

    // Admin auth
    $adminId = intval($_SERVER['HTTP_X_ADMIN_ID'] ?? 0);
    if ($adminId <= 0) {
        json_response(['message' => 'Admin authentication required'], 401);
    }
    $stmt = $pdo->prepare('SELECT is_admin FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$adminId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row || intval($row['is_admin']) !== 1) {
        json_response(['message' => 'Admin privileges required'], 403);
    }

    if ($method === 'GET') {
        $userId = intval($_GET['user_id'] ?? 0);
        if ($userId <= 0) json_response(['message' => 'Missing user_id'], 400);
        $limit = intval($_GET['limit'] ?? 50);
        if ($limit <= 0 || $limit > 200) $limit = 50;
        $stmt = $pdo->prepare('SELECT id, user_id, actor_id, action, meta, created_at FROM user_activity WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT ?');
        $stmt->bindValue(1, $userId, PDO::PARAM_INT);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response(['items' => $items]);
    }

    if ($method === 'POST') {
        $body = read_json_body();
        $userId = intval($body['user_id'] ?? $body['target_user_id'] ?? 0);
        $action = trim($body['action'] ?? '');
        $meta = $body['meta'] ?? null;
        if ($userId <= 0 || $action === '') json_response(['message' => 'user_id and action required'], 400);
        $ins = $pdo->prepare('INSERT INTO user_activity (user_id, actor_id, action, meta) VALUES (?, ?, ?, ?)');
        $ins->execute([$userId, $adminId, $action, $meta ? json_encode($meta) : null]);
        json_response(['success' => true]);
    }

    json_response(['message' => 'Method not allowed'], 405);
} catch (Throwable $e) {
    json_response(['message' => 'Server error', 'error' => $e->getMessage()], 500);
}

?>