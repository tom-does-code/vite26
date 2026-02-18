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
$userid = $data['sessionToken'];

$conn = pg_connect("host=localhost dbname=postgres user=postgres password=1234");

$retrieveQuery = pg_query_params($conn, 'SELECT * FROM "tasks" WHERE user_id = $1', [$userid]);

if ($retrieveQuery) {
    $tasks = [];

    while ($row = pg_fetch_assoc($retrieveQuery)) {
        $tasks[] = $row;
    }
    echo json_encode(['success' => true, 'tasks' => $tasks]);
} else {
    echo json_encode(['success' => false]);
}