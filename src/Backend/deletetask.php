<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$raw = file_get_contents('php://input');
header('Content-Type: application/json');
$data = json_decode($raw, true);

$taskId = $data['id'];
$sessionToken = $data['sessionToken'];

$conn = pg_connect("host=localhost dbname=postgres user=postgres password=1234");

$deleteQuery = pg_query_params($conn, 'DELETE FROM "tasks" WHERE id = $1 AND user_id = $2', [$taskId, $sessionToken]);

if ($deleteQuery) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}