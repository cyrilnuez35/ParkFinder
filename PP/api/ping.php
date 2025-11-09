<?php
require __DIR__ . '/util.php';

cors();

json_response([
	'status' => 'ok',
	'php' => PHP_VERSION,
	'time' => date('c'),
]);


