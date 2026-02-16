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
$username = $data['username'];
$password = $data['password'];

$conn = pg_connect("host=localhost dbname=postgres user=postgres password=1234");

$loginquery = pg_query_params($conn, 'SELECT 1 FROM "newvite" WHERE username = $1 AND password = $2', [$username, $password]);

$tokenCreate = random_int(100000, 999999);

if (pg_num_rows($loginquery) > 0) {
    echo json_encode(['success' => true, 'token' => $tokenCreate]);
} else {
    echo json_encode(['success' => false]);
}