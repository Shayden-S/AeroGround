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
    empty($data["type"]) ||
    empty($data["scheduled"]) ||
    empty($data["problem"])
) {

    echo json_encode([
        "success" => false,
        "message" => "Required work order information is missing."
    ]);

    exit;
}


/* EQUIPMENT */

$equipmentCode = $data["equipmentId"];

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

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Equipment does not exist."
    ]);

    exit;
}

$equipment =
    $result->fetch_assoc();

$equipmentId =
    intval($equipment["id"]);

$stmt->close();


/* OPTIONAL LINKED FAULT */

$faultId = null;

if (!empty($data["faultId"])) {

    $faultCode =
        $data["faultId"];

    $stmt = $conn->prepare(
        "SELECT id
         FROM fault_reports
         WHERE fault_code = ?"
    );

    $stmt->bind_param(
        "s",
        $faultCode
    );

    $stmt->execute();

    $faultResult =
        $stmt->get_result();

    if (
        $faultResult->num_rows > 0
    ) {

        $fault =
            $faultResult->fetch_assoc();

        $faultId =
            intval($fault["id"]);
    }

    $stmt->close();
}


/* GENERATE WORK ORDER CODE */

$result =
    $conn->query(
        "SELECT MAX(id) AS max_id
         FROM maintenance"
    );

$row =
    $result->fetch_assoc();

$number =
    intval($row["max_id"] ?? 0)
    + 2818;

$workOrderCode =
    "MNT-" . $number;


/* VALUES */

$type =
    $data["type"];

$priority =
    $data["priority"] ?? "Medium";

$technician =
    trim($data["technician"] ?? "");

$scheduled =
    $data["scheduled"];

$problem =
    trim($data["problem"]);

$notes = "";

$status = "Created";


/* INSERT */

$stmt = $conn->prepare(
    "INSERT INTO maintenance
    (
        work_order_code,
        equipment_id,
        fault_id,
        maintenance_type,
        priority,
        technician,
        scheduled_date,
        problem,
        notes,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "siisssssss",
    $workOrderCode,
    $equipmentId,
    $faultId,
    $type,
    $priority,
    $technician,
    $scheduled,
    $problem,
    $notes,
    $status
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Work order created.",
        "dbId" => $stmt->insert_id,
        "workOrderCode" =>
            $workOrderCode
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