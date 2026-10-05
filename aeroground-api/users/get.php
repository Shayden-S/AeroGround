<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/database.php";

$sql = "
SELECT
    id,
    employee_code,
    name,
    email,
    role,
    department,
    status,
    created_at
FROM users
ORDER BY id DESC
";

$result = $conn->query($sql);

$users = [];

while ($row = $result->fetch_assoc()) {

    $users[] = [
        "dbId" => intval($row["id"]),
        "id" => $row["employee_code"],
        "name" => $row["name"],
        "email" => $row["email"],
        "role" => $row["role"],
        "department" => $row["department"] ?? "",
        "active" => strtolower($row["status"]) === "active"
    ];
}

echo json_encode([
    "success" => true,
    "data" => $users
]);

$conn->close();

?>