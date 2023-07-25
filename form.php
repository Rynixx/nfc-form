<?php
require_once 'config.php';
require_once 'utils.php';

if (!isset($_SERVER['HTTP_REFERER']) || parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST) !== 'test.twigitals.com') {
    die('Access denied');
}

createTableIfNotExists($conn);

// get the raw JSON data from the POST request
$json = file_get_contents('php://input');

// convert the JSON data to a PHP object
$data = json_decode($json);

// get the data from the POST request
$card_id = sanitizeInput($conn, $data->card_id);
$firstName = sanitizeInput($conn, $data->firstName);
$lastName = sanitizeInput($conn, $data->lastName);
$birthday = sanitizeInput($conn, $data->birthday);
$timestamp = date('Y-m-d H:i:s'); // current timestamp

// insert data into the database
$sql = "INSERT INTO users ( card_id, firstName, lastName, birthday, timestamp)
VALUES ('$card_id', '$firstName', '$lastName', '$birthday', '$timestamp')";

if ($conn->query($sql) === TRUE) {
  echo json_encode(["message" => "New record created successfully"]);
} else {
  echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>