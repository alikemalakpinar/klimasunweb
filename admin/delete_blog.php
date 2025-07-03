<?php
header('Content-Type: application/json');

// Database connection parameters
$host = '127.0.0.1';
$username = 'root';
$password = 'Enes.aktas2326';
$database = 'world';
$port = 3306;

// Create connection
$conn = new mysqli($host, $username, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Veritabanı bağlantısı başarısız: ' . $conn->connect_error
    ]));
}

// Set character set to UTF8
$conn->set_charset("utf8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['id'])) {
        $id = (int)$data['id'];

        // First get the image URL to delete the file
        $sql = "SELECT gorsel_url FROM makaleler WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            $image_path = '../' . $row['gorsel_url'];
            if (file_exists($image_path)) {
                unlink($image_path);
            }
        }
        
        $stmt->close();

        // Now delete the database record
        $sql = "DELETE FROM makaleler WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Blog başarıyla silindi.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Blog silinirken bir hata oluştu.'
            ]);
        }

        $stmt->close();
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Geçersiz istek parametreleri.'
        ]);
    }
}

$conn->close();
?> 