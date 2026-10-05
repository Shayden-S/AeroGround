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

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$role = trim($data["role"] ?? "Equipment Operator");
$department = trim($data["department"] ?? "");
$password = $data["password"] ?? "";
$employeeCode = trim($data["id"] ?? "");

if (
    $name === "" ||
    $email === "" ||
    $department === ""
) {

    echo json_encode([
        "success" => false,
        "message" => "Name, email and department are required."
    ]);

    exit;
}


/* =========================================================
   EDIT EXISTING USER
========================================================= */

if ($employeeCode !== "") {

    $stmt = $conn->prepare(
        "SELECT id
         FROM users
         WHERE employee_code = ?"
    );

    $stmt->bind_param(
        "s",
        $employeeCode
    );

    $stmt->execute();

    $existing =
        $stmt->get_result();

    if ($existing->num_rows > 0) {

        $existingUser =
            $existing->fetch_assoc();

        $dbId =
            intval($existingUser["id"]);

        $stmt->close();


        /* Check duplicate email */

        $stmt = $conn->prepare(
            "SELECT id
             FROM users
             WHERE email = ?
             AND id <> ?"
        );

        $stmt->bind_param(
            "si",
            $email,
            $dbId
        );

        $stmt->execute();

        if (
            $stmt->get_result()->num_rows > 0
        ) {

            echo json_encode([
                "success" => false,
                "message" => "Another user already uses this email address."
            ]);

            exit;
        }

        $stmt->close();


        /* Update password only if supplied */

        if ($password !== "") {

            $hashedPassword =
                password_hash(
                    $password,
                    PASSWORD_DEFAULT
                );

            $stmt = $conn->prepare(
                "UPDATE users
                 SET
                    name = ?,
                    email = ?,
                    password = ?,
                    role = ?,
                    department = ?
                 WHERE id = ?"
            );

            $stmt->bind_param(
                "sssssi",
                $name,
                $email,
                $hashedPassword,
                $role,
                $department,
                $dbId
            );

        } else {

            $stmt = $conn->prepare(
                "UPDATE users
                 SET
                    name = ?,
                    email = ?,
                    role = ?,
                    department = ?
                 WHERE id = ?"
            );

            $stmt->bind_param(
                "ssssi",
                $name,
                $email,
                $role,
                $department,
                $dbId
            );
        }


        if ($stmt->execute()) {

            echo json_encode([
                "success" => true,
                "message" => "User updated successfully.",
                "employeeCode" => $employeeCode
            ]);

        } else {

            echo json_encode([
                "success" => false,
                "message" => $stmt->error
            ]);
        }

        $stmt->close();
        $conn->close();

        exit;
    }

    $stmt->close();
}


/* =========================================================
   CREATE NEW USER
========================================================= */

if ($password === "") {

    echo json_encode([
        "success" => false,
        "message" => "Password is required for a new user."
    ]);

    exit;
}


/* Check duplicate email */

$stmt = $conn->prepare(
    "SELECT id
     FROM users
     WHERE email = ?"
);

$stmt->bind_param(
    "s",
    $email
);

$stmt->execute();

if (
    $stmt->get_result()->num_rows > 0
) {

    echo json_encode([
        "success" => false,
        "message" => "A user with this email already exists."
    ]);

    exit;
}

$stmt->close();


/* Create temporary employee code */

$tempCode =
    "TEMP-" . uniqid();


$hashedPassword =
    password_hash(
        $password,
        PASSWORD_DEFAULT
    );


$status = "Active";


$stmt = $conn->prepare(
    "INSERT INTO users
    (
        employee_code,
        name,
        email,
        password,
        role,
        department,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sssssss",
    $tempCode,
    $name,
    $email,
    $hashedPassword,
    $role,
    $department,
    $status
);


if (!$stmt->execute()) {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);

    exit;
}


$newId =
    $stmt->insert_id;

$stmt->close();


/* Create actual EMP code */

$employeeCode =
    "EMP-" .
    str_pad(
        $newId,
        3,
        "0",
        STR_PAD_LEFT
    );


$stmt = $conn->prepare(
    "UPDATE users
     SET employee_code = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "si",
    $employeeCode,
    $newId
);

$stmt->execute();

$stmt->close();


echo json_encode([
    "success" => true,
    "message" => "User created successfully.",
    "employeeCode" => $employeeCode,
    "dbId" => $newId
]);


$conn->close();

?>