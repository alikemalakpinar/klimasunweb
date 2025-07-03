<?php
$servername = "localhost";
$username = "root";
$password = "123qwe";
$dbname = "world";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8");
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?> 