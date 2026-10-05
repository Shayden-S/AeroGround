<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$sql = "
SELECT
    f.*,
    e.equipment_code
FROM fault_reports f
LEFT JOIN equipment e
    ON f.equipment_id = e.id
ORDER BY f.reported_at DESC
";

$result = $conn->query($sql);

$faults = [];

while ($row = $result->fetch_assoc()) {

    $notes = [];

    if (!empty($row["notes"])) {
        $decoded = json_decode($row["notes"], true);

        if (is_array($decoded)) {
            $notes = $decoded;
        }
    }

    $faults[] = [
        "dbId" => intval($row["id"]),
        "id" => $row["fault_code"],
        "equipmentId" => $row["equipment_code"] ?? "",
        "category" => $row["category"] ?? "",
        "severity" => $row["severity"] ?? "Medium",
        "description" => $row["description"] ?? "",
        "location" => $row["location"] ?? "",
        "reportedBy" => $row["reported_by_name"] ?? "",
        "grounded" => (bool)$row["grounded"],
        "status" => $row["status"] ?? "Reported",
        "reportedAt" => $row["reported_at"],
        "notes" => $notes
    ];
}

echo json_encode([
    "success" => true,
    "data" => $faults
]);

$conn->close();
?>