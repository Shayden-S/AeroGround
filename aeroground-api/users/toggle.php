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

$employeeCode =
    trim($data["id"] ?? "");

$active =
    isset($data["active"])
        ? (bool)$data["active"]
        : true;


if ($employeeCode === "") {

    echo json_encode([
        "success" => false,
        "message" => "Employee ID is required."
    ]);

    exit;
}


$status =
    $active
        ? "Active"
        : "Inactive";


$stmt = $conn->prepare(
    "UPDATE users
     SET status = ?
     WHERE employee_code = ?"
);

$stmt->bind_param(
    "ss",
    $status,
    $employeeCode
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "User status updated."
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