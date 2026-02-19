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
$userid = $data['idInput'];

$conn = pg_connect("host=localhost dbname=postgres user=postgres password=1234");

$accountQuery = pg_query_params($conn, 'SELECT date_created FROM "newvite" WHERE user_id = $1', [$userid]);
$account = pg_fetch_assoc($accountQuery);

if (!$account) {
    echo json_encode(['error' => 'No user found with ID: ' . $userid]);
    exit;
}


$tasksQuery = pg_query_params($conn, 'SELECT * FROM "tasks" WHERE user_id = $1', [$userid]);
$tasks = pg_fetch_all($tasksQuery);

echo json_encode([
    'accountCreated' => $account['date_created'],
    'tasks' => $tasks,
    'tasksCreated' => count($tasks),
    'success' => true
]);