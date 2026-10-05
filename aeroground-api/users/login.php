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

$login =
    trim($data["login"] ?? "");

$password =
    $data["password"] ?? "";


if (
    $login === "" ||
    $password === ""
) {

    echo json_encode([
        "success" => false,
        "message" => "Email / Employee ID and password are required."
    ]);

    exit;
}


$stmt = $conn->prepare(
    "SELECT
        id,
        employee_code,
        name,
        email,
        password,
        role,
        department,
        status
     FROM users
     WHERE email = ?
        OR employee_code = ?
     LIMIT 1"
);

$stmt->bind_param(
    "ss",
    $login,
    $login
);

$stmt->execute();

$result =
    $stmt->get_result();


if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid email / employee ID or password."
    ]);

    exit;
}


$user =
    $result->fetch_assoc();


if (
    strtolower($user["status"]) !==
    "active"
) {

    echo json_encode([
        "success" => false,
        "message" => "This account is inactive. Contact an administrator."
    ]);

    exit;
}


if (
    !password_verify(
        $password,
        $user["password"]
    )
) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid email / employee ID or password."
    ]);

    exit;
}


echo json_encode([
    "success" => true,

    "message" =>
        "Authentication successful.",

    "user" => [
        "id" =>
            $user["employee_code"],

        "name" =>
            $user["name"],

        "email" =>
            $user["email"],

        "role" =>
            $user["role"],

        "department" =>
            $user["department"]
    ]
]);


$stmt->close();
$conn->close();

?>