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
    empty($data["type"]) ||
    empty($data["equipmentId"])
) {
    echo json_encode([
        "success" => false,
        "message" => "Flight, equipment type and equipment ID are required."
    ]);
    exit;
}

$flightId = $data["flightId"];
$type = $data["type"];
$equipmentCode = $data["equipmentId"];


/* Find equipment database ID */

$stmt = $conn->prepare(
    "SELECT id, status
     FROM equipment
     WHERE equipment_code = ?"
);

$stmt->bind_param(
    "s",
    $equipmentCode
);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Equipment not found."
    ]);

    exit;
}

$equipment = $result->fetch_assoc();

$equipmentId =
    intval($equipment["id"]);

$stmt->close();


/* Remove old assignment for this flight position */

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

$stmt->execute();
$stmt->close();


/* Create new assignment */

$status = "Assigned";

$stmt = $conn->prepare(
    "INSERT INTO assignments
    (
        flight_id,
        equipment_type,
        equipment_id,
        status
    )
    VALUES (?, ?, ?, ?)"
);

$stmt->bind_param(
    "ssis",
    $flightId,
    $type,
    $equipmentId,
    $status
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Equipment assigned successfully.",
        "dbId" => $stmt->insert_id
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