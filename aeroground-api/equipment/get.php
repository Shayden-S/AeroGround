<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$sql = "SELECT * FROM equipment ORDER BY id DESC";
$result = $conn->query($sql);

$equipment = [];

while ($row = $result->fetch_assoc()) {

    $equipment[] = [
        "dbId" => intval($row["id"]),
        "id" => $row["equipment_code"],
        "serial" => $row["serial"] ?? "",
        "makeModel" => $row["equipment_name"],
        "description" => $row["description"] ?? "",
        "category" => $row["category"] ?? "",
        "type" => $row["category"] ?? "",
        "location" => $row["location"] ?? "",
        "zone" => $row["zone"] ?? "",
        "operatingHours" => intval($row["operating_hours"]),
        "dutyPercent" => intval($row["duty_percent"]),
        "status" => strtoupper($row["status"] ?? "AVAILABLE"),
        "fuelBattery" => intval($row["fuel_battery"]),
        "powerType" => $row["power_type"] ?? "",
        "assignedFlight" => $row["assigned_flight"] ?? "Unassigned",
        "assignedOperator" => $row["assigned_operator"] ?? "Standby Dispatch",
        "serviceSchedule" => $row["service_schedule"] ?? "Nominal",
        "nextCheck" => $row["next_check"] ?? "",
        "lastService" => $row["last_service"] ?? "",
        "gps" => $row["gps"] ?? "",
        "lastInspection" => $row["last_inspection"]
    ];
}

echo json_encode([
    "success" => true,
    "data" => $equipment
]);

$conn->close();
?>