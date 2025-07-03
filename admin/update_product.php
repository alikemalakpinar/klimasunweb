<?php
header('Content-Type: application/json');
require_once 'db_config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Log incoming data for debugging
    error_log("Received data: " . print_r($data, true));
    
    if (!isset($data['id'])) {
        throw new Exception('Product ID is required');
    }

    // For visibility toggle, convert boolean to integer
    if (isset($data['visible'])) {
        $data['visible'] = $data['visible'] ? 1 : 0;
    }

    $updates = [];
    $params = [];

    // Handle optional updates
    if (isset($data['name'])) {
        $updates[] = "name = ?";
        $params[] = $data['name'];
    }
    if (isset($data['category'])) {
        $updates[] = "category = ?";
        $params[] = $data['category'];
    }
    if (isset($data['stock'])) {
        $updates[] = "stock = ?";
        $params[] = $data['stock'];
    }
    if (isset($data['visible'])) {
        $updates[] = "visible = ?";
        $params[] = $data['visible'];
    }

    if (empty($updates)) {
        throw new Exception('No fields to update');
    }

    // Add ID to params
    $params[] = $data['id'];

    // Create update query
    $query = "UPDATE urunler SET " . implode(", ", $updates) . " WHERE id = ?";
    
    // Log the query and parameters
    error_log("Query: " . $query);
    error_log("Parameters: " . print_r($params, true));
    
    $stmt = $conn->prepare($query);
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
        // Get the updated product data
        $select = $conn->prepare("SELECT * FROM urunler WHERE id = ?");
        $select->execute([$data['id']]);
        $updatedProduct = $select->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Ürün başarıyla güncellendi',
            'product' => $updatedProduct
        ]);
    } else {
        throw new Exception('Ürün bulunamadı veya değişiklik yapılmadı');
    }

} catch (Exception $e) {
    error_log("Error in update_product.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 