<?php
header('Content-Type: application/json');
require_once 'db_config.php';

try {
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name']) || !isset($data['category']) || !isset($data['stock']) || !isset($data['image'])) {
        throw new Exception('Missing required fields');
    }

    // Handle base64 image
    $image_data = $data['image'];
    // Remove the data URL part if present
    if (strpos($image_data, ',') !== false) {
        $image_data = explode(',', $image_data)[1];
    }
    
    // Create images directory if it doesn't exist
    $upload_dir = __DIR__ . '/../uploads/products/';
    if (!file_exists($upload_dir)) {
        if (!mkdir($upload_dir, 0777, true)) {
            throw new Exception('Failed to create upload directory');
        }
        chmod($upload_dir, 0777);
    }

    // Generate unique filename
    $file_name = uniqid() . '.png';
    $file_path = $upload_dir . $file_name;
    
    // Save the image
    $decoded_image = base64_decode($image_data);
    if ($decoded_image === false) {
        throw new Exception('Invalid image data');
    }
    
    if (file_put_contents($file_path, $decoded_image) === false) {
        throw new Exception('Failed to save image');
    }
    
    chmod($file_path, 0644); // Make file readable

    // Store the relative path in database
    $image_url = 'uploads/products/' . $file_name;

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO urunler (name, category, stock, image_url, visible) VALUES (?, ?, ?, ?, 1)");
    $stmt->execute([
        $data['name'],
        $data['category'],
        $data['stock'],
        $image_url
    ]);

    $product_id = $conn->lastInsertId();

    // Return the complete product data
    $select = $conn->prepare("SELECT * FROM urunler WHERE id = ?");
    $select->execute([$product_id]);
    $product = $select->fetch(PDO::FETCH_ASSOC);

    // Log success
    error_log("Product added successfully. Image saved at: " . $file_path);
    error_log("Database image_url: " . $image_url);

    echo json_encode([
        'success' => true,
        'message' => 'Ürün başarıyla eklendi',
        'product' => $product
    ]);

} catch (Exception $e) {
    error_log("Error in add_product.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 