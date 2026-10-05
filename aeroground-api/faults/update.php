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

if (empty($data["id"])) {

    echo json_encode([
        "success" => false,
        "message" => "Fault ID required."
    ]);

    exit;
}

$faultCode = $data["id"];
$status = $data["status"] ?? "Reported";
$grounded = !empty($data["grounded"]) ? 1 : 0;
$notes = json_encode($data["notes"] ?? []);

$stmt = $conn->prepare(
    "UPDATE fault_reports
     SET status = ?, grounded = ?, notes = ?
     WHERE fault_code = ?"
);

$stmt->bind_param(
    "siss",
    $status,
    $grounded,
    $notes,
    $faultCode
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Fault updated."
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