<?php

require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function getAuthenticatedUser($secretKey) {
    $token = $_COOKIE['token'] ?? null;

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }

    try {
        $payload = JWT::decode($token, new Key($secretKey, 'HS256'));
        return $payload->user_id;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }
}