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
    // Get POST data
    $baslik = $conn->real_escape_string($_POST['title']);
    $icerik = $conn->real_escape_string($_POST['content']);
    $gorunurluk = isset($_POST['isVisible']) ? 1 : 0;

    // Handle image upload
    $gorsel_url = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = __DIR__ . '/../uploads/';
        
        // Create uploads directory if it doesn't exist
        if (!file_exists($upload_dir)) {
            if (!mkdir($upload_dir, 0777, true)) {
                die(json_encode([
                    'success' => false,
                    'message' => 'Uploads dizini oluşturulamadı. Dizin izinlerini kontrol edin.'
                ]));
            }
        }

        // Check if directory is writable
        if (!is_writable($upload_dir)) {
            die(json_encode([
                'success' => false,
                'message' => 'Uploads dizinine yazma izni yok. Dizin izinlerini kontrol edin.'
            ]));
        }

        $file_extension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $file_name = uniqid() . '.' . $file_extension;
        $target_file = $upload_dir . $file_name;

        // Check if image file is valid
        $valid_extensions = array("jpg", "jpeg", "png", "gif");
        if (!in_array($file_extension, $valid_extensions)) {
            die(json_encode([
                'success' => false,
                'message' => 'Geçersiz dosya formatı. Sadece JPG, JPEG, PNG ve GIF dosyaları kabul edilir.'
            ]));
        }

        // Verify it's an actual image
        if (!getimagesize($_FILES['image']['tmp_name'])) {
            die(json_encode([
                'success' => false,
                'message' => 'Yüklenen dosya geçerli bir görsel değil.'
            ]));
        }

        // Try to move the uploaded file
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            $upload_error = error_get_last();
            die(json_encode([
                'success' => false,
                'message' => 'Görsel yüklenirken bir hata oluştu: ' . ($upload_error ? $upload_error['message'] : 'Bilinmeyen hata')
            ]));
        }

        // Store relative path in database
        $gorsel_url = 'uploads/' . $file_name;
    } else {
        // Handle file upload errors
        if (isset($_FILES['image'])) {
            $upload_errors = array(
                UPLOAD_ERR_INI_SIZE => 'Yüklenen dosya PHP.ini dosyasında izin verilen maksimum boyutu aşıyor.',
                UPLOAD_ERR_FORM_SIZE => 'Yüklenen dosya HTML formunda belirtilen MAX_FILE_SIZE değerini aşıyor.',
                UPLOAD_ERR_PARTIAL => 'Dosya sadece kısmen yüklendi.',
                UPLOAD_ERR_NO_FILE => 'Hiçbir dosya yüklenmedi.',
                UPLOAD_ERR_NO_TMP_DIR => 'Geçici klasör eksik.',
                UPLOAD_ERR_CANT_WRITE => 'Dosya diske yazılamadı.',
                UPLOAD_ERR_EXTENSION => 'Bir PHP uzantısı dosya yüklemesini durdurdu.'
            );
            $error_code = $_FILES['image']['error'];
            $error_message = isset($upload_errors[$error_code]) ? $upload_errors[$error_code] : 'Bilinmeyen yükleme hatası.';
            
            die(json_encode([
                'success' => false,
                'message' => 'Görsel yükleme hatası: ' . $error_message
            ]));
        }
    }

    // Insert into database
    $sql = "INSERT INTO makaleler (baslik, icerik, gorsel_url, gorunurluk) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $baslik, $icerik, $gorsel_url, $gorunurluk);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Blog başarıyla kaydedildi.',
            'id' => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Blog kaydedilirken bir hata oluştu: ' . $stmt->error
        ]);
    }

    $stmt->close();
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch all blogs
    $sql = "SELECT * FROM makaleler ORDER BY olusturma_tarihi DESC";
    $result = $conn->query($sql);

    $blogs = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $blogs[] = [
                'id' => $row['id'],
                'title' => $row['baslik'],
                'content' => $row['icerik'],
                'image' => $row['gorsel_url'],
                'isVisible' => (bool)$row['gorunurluk'],
                'createdAt' => $row['olusturma_tarihi']
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'data' => $blogs
    ]);
}

$conn->close();
?> 