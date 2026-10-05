<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once "../config/database.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (
    empty($data["flightId"]) ||
    empty($data["type"])
) {
    echo json_encode([
        "success" => false,
        "message" => "Flight and equipment type are required."
    ]);

    exit;
}

$flightId = $data["flightId"];
$type = $data["type"];

$stmt = $conn->prepare(
    "DELETE FROM assignments
     WHERE flight_id = ?
     AND equipment_type = ?"
);

$stmt->bind_param(
    "ss",
    $flightId,
    $type
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Assignment removed."
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