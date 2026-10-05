<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$sql = "
SELECT
    i.id,
    i.inspection_code,
    i.inspection_type,
    i.inspector,
    i.checks,
    i.result,
    i.status,
    i.inspection_date,
    e.equipment_code
FROM inspections i
LEFT JOIN equipment e
    ON i.equipment_id = e.id
ORDER BY i.id DESC
";

$result = $conn->query($sql);

$rows = [];

while ($row = $result->fetch_assoc()) {

    $checks = [];

    if (!empty($row["checks"])) {
        $decoded = json_decode(
            $row["checks"],
            true
        );

        if (is_array($decoded)) {
            $checks = $decoded;
        }
    }

    $rows[] = [
        "dbId" => intval($row["id"]),
        "id" => $row["inspection_code"],
        "equipmentId" => $row["equipment_code"],
        "type" => $row["inspection_type"],
        "inspector" => $row["inspector"],
        "checks" => $checks,
        "result" => $row["result"],
        "status" => $row["status"],
        "date" => $row["inspection_date"]
    ];
}

echo json_encode([
    "success" => true,
    "data" => $rows
]);

$conn->close();

?>