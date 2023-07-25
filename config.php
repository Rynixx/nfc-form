<?php
if (!isset($_SERVER['HTTP_REFERER']) || parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST) !== 'test.twigitals.com') {
  die('Access denied');
}
$servername = "localhost";
$username = "db634187_43";
$password = "b-x(wu9fWeur";
$dbname = "db634187_43";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
