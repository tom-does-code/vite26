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
$firstName = $data['firstName'];
$lastName = $data['lastName'];
$email = $data['firstEmail'];
$aboutMe = $data['aboutMe'];

$conn = pg_connect("host=localhost dbname=postgres user=postgres password=1234");
$accountQuery = pg_query_params($conn, 'UPDATE "userstats" SET first_name = $2, last_name = $3, email = $4, bio = $5 WHERE userid = $1', [$userid, $firstName, $lastName, $email, $aboutMe]);

if (pg_affected_rows($accountQuery) > 0) {
    echo json_encode(['success' => true, 'message' => 'Profile updated']);
} else {
    $newAccountQuery = pg_query_params($conn, 'INSERT INTO "userstats" (userid, first_name, last_name, email, bio) VALUES ($1, $2, $3, $4, $5)', [$userid, $firstName, $lastName, $email, $aboutMe]);
    if ($newAccountQuery) {
        echo json_encode(['success' => true, 'message' => 'Profile created']);
    } else {
        echo json_encode(['success' => false, 'message' => pg_last_error($conn)]);
    }
}