<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: DELETE, POST");
header("Content-Type: application/json");

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Equipment ID is required"
    ]);
    exit;
}

$id = intval($data["id"]);

$stmt = $conn->prepare(
    "DELETE FROM equipment WHERE id = ?"
);

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Equipment deleted successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?> 