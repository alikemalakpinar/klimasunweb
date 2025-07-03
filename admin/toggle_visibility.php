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
    
    if (isset($data['id']) && isset($data['isVisible'])) {
        $id = (int)$data['id'];
        $isVisible = $data['isVisible'] ? 1 : 0;

        // First check if the blog exists
        $check_sql = "SELECT id FROM makaleler WHERE id = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param("i", $id);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        
        if ($result->num_rows === 0) {
            die(json_encode([
                'success' => false,
                'message' => 'Blog bulunamadı.'
            ]));
        }
        
        $check_stmt->close();

        // Update visibility
        $sql = "UPDATE makaleler SET gorunurluk = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $isVisible, $id);

        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => $isVisible ? 'Blog görünür yapıldı.' : 'Blog gizlendi.',
                'isVisible' => (bool)$isVisible
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Görünürlük durumu güncellenirken bir hata oluştu.'
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