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

$accountQuery = pg_query_params($conn, 'SELECT first_name, last_name, email, bio FROM "userstats" WHERE userid = $1', [$userid]);
$profile = pg_fetch_assoc($accountQuery);

if ($profile) {
    echo json_encode(['success' => true, 'data' => $profile]);
} else {
    echo json_encode(['success' => false, 'message' => 'Profile not found']);
}