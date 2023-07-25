<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

function getSkeyById($id, $array) {
    if (array_key_exists($id, $array)) {
        return $array[$id];
    } else {
        return null; // If ID is not found in the array, return null or handle it as per your requirement.
    }
}

if (!isset($_SERVER['HTTP_REFERER']) || parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST) !== 'test.twigitals.com') {
    die('Access denied');
}
$sKeyArray = array(
    1 => '1F64AD8A10D99B3FF04B225DC304ED9C',
    2 => '51B6F165C333896EA66F47E01E08B51B',
    3 => '0A3F7E2D19671863EBB96B36F2776F74',
    4 => 'F1F445D3D8D5AD5AB768C971283E677A',
    5 => '6466A03F00E2CC4079F40CA7E62E5C41',
    6 => 'E1E1A153CD65DA15339BEBB766CB7696',
    7 => 'EF91E298F4556BDF05965804FAB1EC8F',
    8 => 'BA9B896ADB5AC396BB12712C0C1ED14F',
    9 => '587F8EA7D439790920F7ECDF4303E0E5'
);
// Get URL parameters
$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_STRING);
$u = filter_input(INPUT_GET, 'u', FILTER_SANITIZE_STRING);
$c = filter_input(INPUT_GET, 'c', FILTER_SANITIZE_STRING);
$m = filter_input(INPUT_GET, 'm', FILTER_SANITIZE_STRING);

// Specify the key
$key = '587F8EA7D439790920F7ECDF4303E0E5';

// Build the URL
$url = "https://authapi-11-30.azurewebsites.net/auth/verifymac?sUid={$u}&sCounter={$c}&sMac={$m}&sKey=".getSkeyById($id,$sKeyArray)."";

// Initialize cURL
$ch = curl_init($url);

// Set options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return response instead of outputting
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification bc dev env
curl_setopt($ch, CURLOPT_HEADER, 0);

// Execute the request
$response = curl_exec($ch);

// Check if the request was successful
if ($response === false) {
    // Handle error
    $data = array("error" => "An error occurred: " . curl_error($ch));
} else {
    // Decode the response
    $data = json_decode($response, true);
}

// Close cURL
curl_close($ch);

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($data);
?>