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


if (empty($data["id"])) {

    echo json_encode([
        "success" => false,
        "message" => "Work order ID is required."
    ]);

    exit;
}


$code =
    $data["id"];

$status =
    $data["status"] ?? "Created";

$technician =
    trim($data["technician"] ?? "");

$notes =
    trim($data["notes"] ?? "");


$stmt = $conn->prepare(
    "UPDATE maintenance
     SET
        status = ?,
        technician = ?,
        notes = ?
     WHERE work_order_code = ?"
);


$stmt->bind_param(
    "ssss",
    $status,
    $technician,
    $notes,
    $code
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Work order updated."
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