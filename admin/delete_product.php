<?php
header('Content-Type: application/json');
require_once 'db_config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        throw new Exception('Product ID is required');
    }

    // First get the image URL to delete the file
    $stmt = $conn->prepare("SELECT image_url FROM urunler WHERE id = ?");
    $stmt->execute([$data['id']]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product && $product['image_url']) {
        $image_path = '../' . $product['image_url'];
        if (file_exists($image_path)) {
            unlink($image_path);
        }
    }

    // Delete from database
    $stmt = $conn->prepare("DELETE FROM urunler WHERE id = ?");
    $stmt->execute([$data['id']]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Ürün başarıyla silindi'
        ]);
    } else {
        throw new Exception('Ürün bulunamadı');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 