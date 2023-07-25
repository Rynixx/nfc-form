<?php
require_once 'config.php';
if (!isset($_SERVER['HTTP_REFERER']) || parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST) !== 'test.twigitals.com') {
    die('Access denied');
}
function createTableIfNotExists($conn) {
  // create table if not exists
  $sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    card_id INT(11),
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    birthday DATE,
    timestamp DATETIME
  )";

  if ($conn->query($sql) === FALSE) {
    die("Error creating table: " . $conn->error);
  }
}

function sanitizeInput($conn, $input) {
  return $conn->real_escape_string($input);
}

?>