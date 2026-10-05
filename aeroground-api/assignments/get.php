<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$sql = "
SELECT
    a.id,
    a.flight_id,
    a.equipment_type,
    a.status,
    a.created_at,
    e.equipment_code
FROM assignments a
LEFT JOIN equipment e
    ON a.equipment_id = e.id
ORDER BY a.id ASC
";

$result = $conn->query($sql);

$assignments = [];

while ($row = $result->fetch_assoc()) {

    $assignments[] = [
        "dbId" => intval($row["id"]),
        "flightId" => $row["flight_id"],
        "type" => $row["equipment_type"],
        "equipmentId" => $row["equipment_code"],
        "status" => $row["status"]
    ];
}

echo json_encode([
    "success" => true,
    "data" => $assignments
]);

$conn->close();

?>