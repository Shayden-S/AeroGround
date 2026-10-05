<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["id"]) || empty($data["makeModel"])) {
    echo json_encode([
        "success" => false,
        "message" => "Equipment ID and Make/Model are required."
    ]);
    exit;
}

$equipmentCode = strtoupper(trim($data["id"]));
$equipmentName = trim($data["makeModel"]);
$serial = trim($data["serial"] ?? "");
$description = trim($data["description"] ?? "");
$category = trim($data["category"] ?? "");
$location = trim($data["location"] ?? "");
$zone = trim($data["zone"] ?? "");

$operatingHours = intval($data["operatingHours"] ?? 0);
$dutyPercent = intval($data["dutyPercent"] ?? 0);

$status = strtoupper(trim($data["status"] ?? "AVAILABLE"));

$fuelBattery = intval($data["fuelBattery"] ?? 100);
$powerType = trim($data["powerType"] ?? "Diesel");

$assignedFlight = trim($data["assignedFlight"] ?? "Unassigned");
$assignedOperator = trim($data["assignedOperator"] ?? "Standby Dispatch");

$serviceSchedule = trim($data["serviceSchedule"] ?? "Nominal");
$nextCheck = trim($data["nextCheck"] ?? "30d (Standard)");
$lastService = trim($data["lastService"] ?? "Today");
$gps = trim($data["gps"] ?? "");

$stmt = $conn->prepare(
    "INSERT INTO equipment (
        equipment_code,
        equipment_name,
        serial,
        description,
        category,
        location,
        zone,
        operating_hours,
        duty_percent,
        status,
        fuel_battery,
        power_type,
        assigned_flight,
        assigned_operator,
        service_schedule,
        next_check,
        last_service,
        gps
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sssssssiiissssssss",
    $equipmentCode,
    $equipmentName,
    $serial,
    $description,
    $category,
    $location,
    $zone,
    $operatingHours,
    $dutyPercent,
    $status,
    $fuelBattery,
    $powerType,
    $assignedFlight,
    $assignedOperator,
    $serviceSchedule,
    $nextCheck,
    $lastService,
    $gps
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Equipment added successfully.",
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