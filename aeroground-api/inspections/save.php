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

if (
    empty($data["equipmentId"]) ||
    empty($data["inspector"]) ||
    empty($data["type"])
) {

    echo json_encode([
        "success" => false,
        "message" => "Equipment, inspector and inspection type are required."
    ]);

    exit;
}


$equipmentCode =
    $data["equipmentId"];

$inspector =
    trim($data["inspector"]);

$type =
    $data["type"];

$result =
    $data["result"] ?? "Pending";

$status =
    $data["status"] ?? "Completed";

$date =
    $data["date"] ?? date("Y-m-d");

$checks =
    json_encode(
        $data["checks"] ?? []
    );


/* FIND EQUIPMENT */

$stmt = $conn->prepare(
    "SELECT id
     FROM equipment
     WHERE equipment_code = ?"
);

$stmt->bind_param(
    "s",
    $equipmentCode
);

$stmt->execute();

$equipmentResult =
    $stmt->get_result();

if ($equipmentResult->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Equipment does not exist."
    ]);

    exit;
}

$equipment =
    $equipmentResult->fetch_assoc();

$equipmentId =
    intval($equipment["id"]);

$stmt->close();


/* GENERATE INSPECTION CODE */

$resultCode =
    $conn->query(
        "SELECT MAX(id) AS max_id
         FROM inspections"
    );

$row =
    $resultCode->fetch_assoc();

$next =
    intval($row["max_id"] ?? 0) + 2313;

$inspectionCode =
    "INS-" . $next;


/* INSERT */

$stmt = $conn->prepare(
    "INSERT INTO inspections
    (
        inspection_code,
        equipment_id,
        inspection_type,
        inspector,
        checks,
        result,
        status,
        inspection_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sissssss",
    $inspectionCode,
    $equipmentId,
    $type,
    $inspector,
    $checks,
    $result,
    $status,
    $date
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Inspection saved successfully.",
        "dbId" => $stmt->insert_id,
        "inspectionCode" =>
            $inspectionCode
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