<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data["equipmentId"]) ||
    empty($data["category"]) ||
    empty($data["description"])
) {
    echo json_encode([
        "success" => false,
        "message" => "Required fault information is missing."
    ]);
    exit;
}

/* Find MySQL equipment ID */
$stmt = $conn->prepare(
    "SELECT id FROM equipment WHERE equipment_code = ?"
);

$stmt->bind_param("s", $data["equipmentId"]);
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
$equipmentId = intval($equipment["id"]);

$stmt->close();

/* Generate fault number */

$result = $conn->query(
    "SELECT MAX(id) AS max_id FROM fault_reports"
);

$row = $result->fetch_assoc();

$number = 9422 + intval($row["max_id"]);

$faultCode = "FLT-" . $number;

$category = $data["category"];
$severity = $data["severity"] ?? "Medium";
$description = trim($data["description"]);
$location = trim($data["location"] ?? "");
$reportedBy = trim($data["reportedBy"] ?? "");
$grounded = !empty($data["grounded"]) ? 1 : 0;
$status = "Reported";

$notes = json_encode([]);

$stmt = $conn->prepare(
    "INSERT INTO fault_reports
    (
        fault_code,
        equipment_id,
        category,
        severity,
        description,
        location,
        reported_by_name,
        grounded,
        status,
        notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sisssssiss",
    $faultCode,
    $equipmentId,
    $category,
    $severity,
    $description,
    $location,
    $reportedBy,
    $grounded,
    $status,
    $notes
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Fault report created.",
        "dbId" => $stmt->insert_id,
        "faultCode" => $faultCode
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