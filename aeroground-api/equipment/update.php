<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: PUT, POST");
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
$equipment_code = $data["equipment_code"] ?? "";
$equipment_name = $data["equipment_name"] ?? "";
$category = $data["category"] ?? "";
$location = $data["location"] ?? "";
$status = $data["status"] ?? "Available";

$stmt = $conn->prepare(
    "UPDATE equipment
     SET equipment_code = ?,
         equipment_name = ?,
         category = ?,
         location = ?,
         status = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "sssssi",
    $equipment_code,
    $equipment_name,
    $category,
    $location,
    $status,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Equipment updated successfully"
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