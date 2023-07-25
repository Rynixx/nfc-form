<?php
require_once 'config.php';
require_once 'utils.php';
if (!isset($_SERVER['HTTP_REFERER']) || parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST) !== 'test.twigitals.com') {
    die('Access denied');
}
// sanitize your input
$card_id = mysqli_real_escape_string($conn, $_GET['card_id']);

// Check if card_id already exists
$checkQuery = "SELECT * FROM users WHERE card_id = '$card_id'";
$result = $conn->query($checkQuery);

if ($result->num_rows > 0) {
    // output data of each row
    $row = $result->fetch_assoc();
    $response = array('firstName' => $row['firstName'], 'lastName' => $row['lastName']);
    echo json_encode($response);
} else {
    echo json_encode("Error");
}

$conn->close();
?>
