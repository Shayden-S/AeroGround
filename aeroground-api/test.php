<?php

header("Content-Type: application/json");

require_once "config/database.php";

echo json_encode([
    "success" => true,
    "message" => "AeroGround PHP API is working!",
    "database" => "Connected successfully"
]);

$conn->close();
?>