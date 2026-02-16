<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$raw = file_get_contents('php://input');
header('Content-Type: application/json');

$data = json_decode($raw, true);
$email = $data['email'];
$username = $data['username'];
$password = $data['password'];

$conn = pg_connect("host=localhost dbname=postgres user=postgres password=1234");

$random_id = bin2hex(random_bytes(6));

$exists = pg_query_params($conn, 'SELECT 1 FROM newvite where email = $1', [$email]);

if (pg_num_rows($exists) > 0) {
    echo json_encode(['success' => false, 'exists' => true]);
    return;
}

$addinto = pg_query_params($conn, 'INSERT INTO "newvite" (email, password, username, user_id) VALUES ($1, $2, $3, $4)', [$email, $password, $username, $random_id]);

if ($addinto) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}