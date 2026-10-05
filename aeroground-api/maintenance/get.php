<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$sql = "
SELECT
    m.*,
    e.equipment_code,
    f.fault_code
FROM maintenance m
LEFT JOIN equipment e
    ON m.equipment_id = e.id
LEFT JOIN fault_reports f
    ON m.fault_id = f.id
ORDER BY m.id DESC
";

$result = $conn->query($sql);

$orders = [];

while ($row = $result->fetch_assoc()) {

    $orders[] = [
        "dbId" => intval($row["id"]),
        "id" => $row["work_order_code"],
        "equipmentId" => $row["equipment_code"],
        "faultId" => $row["fault_code"] ?? "",
        "type" => $row["maintenance_type"],
        "priority" => $row["priority"],
        "technician" => $row["technician"] ?? "",
        "scheduled" => $row["scheduled_date"],
        "problem" => $row["problem"],
        "notes" => $row["notes"] ?? "",
        "status" => $row["status"]
    ];
}

echo json_encode([
    "success" => true,
    "data" => $orders
]);

$conn->close();

?>