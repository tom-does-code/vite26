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
$taskName = $data['title'];
$taskPriority = $data['priority'];
$taskDescription = $data['description'];

$conn = pg_connect("host=localhost dbname=postgres user=postgres password=1234");

$createQuery = pg_query_params($conn, 'INSERT INTO "tasks" (user_id, task_name, task_priority, task_description) VALUES ($1, $2, $3, $4)', [$userid, $taskName, $taskPriority, $taskDescription]);


if ($createQuery) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}