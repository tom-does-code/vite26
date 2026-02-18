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
$taskid = $data['id'];
$userId = $data['sessionToken'];

$conn = pg_connect("host=localhost dbname=postgres user=postgres password=1234");

$retrieveQuery = pg_query_params($conn, 'SELECT * FROM "tasks" WHERE id = $1 AND user_id = $2', [$taskid, $userId]);

if (pg_num_rows($retrieveQuery) > 0) {
    $task = pg_fetch_assoc($retrieveQuery);
    echo json_encode(['success' => true, 'task' => $task]);
} else {
    echo json_encode(['success' => false]);
}