<?php
require __DIR__ . '/util.php';
require __DIR__ . '/db.php';

cors();

try {
	$pdo = get_pdo();
	$pdo->query('SELECT 1');
	json_response(['db' => 'connected']);
} catch (Throwable $e) {
	json_response(['db' => 'error', 'message' => $e->getMessage()], 500);
}


