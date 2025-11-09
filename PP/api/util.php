<?php

function cors() {
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
	header('Access-Control-Allow-Headers: Content-Type');
	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		http_response_code(204);
		exit;
	}
}

function json_response($data, int $status = 200) {
	header('Content-Type: application/json');
	http_response_code($status);
	echo json_encode($data);
	exit;
}

function read_json_body() {
	$raw = file_get_contents('php://input');
	$parsed = json_decode($raw, true);
	return is_array($parsed) ? $parsed : [];
}

function hash_password(string $password): string {
	return password_hash($password, PASSWORD_DEFAULT);
}

function verify_password(string $password, string $hash): bool {
	return password_verify($password, $hash);
}


