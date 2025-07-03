// Ürün verileri
const products = [
    {
        id: 1,
        name: 'E1012',
        image: 'assets/products/E1012.jpg',
        availability: 'Mevcut',
        manufacturer: 'Beijer Electronics HMI'
    },
    {
        id: 2,
        name: 'SH100/50030/0/0/00/0/0/00/11/00',
        image: 'assets/products/SH100.jpg',
        availability: 'Mevcut',
        manufacturer: 'SCHNEIDER ELECTRIC SERVO MOTOR'
    },
    {
        id: 3,
        name: 'ATV71HU15M3',
        image: 'assets/products/ATV71.jpg',
        availability: 'Mevcut',
        manufacturer: 'SCHNEIDER SPEED DRIVE'
    },
    {
        id: 4,
        name: 'MDX61B0014-5A3-4-00',
        image: 'assets/products/MDX61B.jpg',
        availability: 'Mevcut',
        manufacturer: 'SEW EURODRIVE DRIVE TECHNOLOGY'
    },
    {
        id: 5,
        name: 'KM3420',
        image: 'assets/products/KM3420.jpg',
        availability: 'Mevcut',
        manufacturer: 'KONE Electronics'
    },
    {
        id: 6,
        name: 'DRV-240',
        image: 'assets/products/DRV240.jpg',
        availability: 'Mevcut',
        manufacturer: 'Delta Electronics'
    },
    {
        id: 7,
        name: 'PLC-S7-300',
        image: 'assets/products/S7300.jpg',
        availability: 'Mevcut',
        manufacturer: 'Siemens Automation'
    },
    {
        id: 8,
        name: 'VFD-M100',
        image: 'assets/products/VFDM100.jpg',
        availability: 'Mevcut',
        manufacturer: 'ABB Drives'
    },
    {
        id: 9,
        name: 'TC-500',
        image: 'assets/products/TC500.jpg',
        availability: 'Mevcut',
        manufacturer: 'Toshiba Controls'
    },
    {
        id: 10,
        name: 'FR-E720',
        image: 'assets/products/FRE720.jpg',
        availability: 'Mevcut',
        manufacturer: 'Mitsubishi Electric'
    },
    {
        id: 11,
        name: 'CP1H',
        image: 'assets/products/CP1H.jpg',
        availability: 'Mevcut',
        manufacturer: 'Omron Industrial'
    },
    {
        id: 12,
        name: 'LC100',
        image: 'assets/products/LC100.jpg',
        availability: 'Mevcut',
        manufacturer: 'LG Controls'
    }
];

// Sayfalama değişkenleri
let currentPage = 1;
let itemsPerPage = 12;
let filteredProducts = [...products];

// DOM yüklendikten sonra çalışacak fonksiyonlar
$(document).ready(function() {
    // Sayfa yüklendiğinde ürünleri göster
    renderProducts();
    renderPagination();
    
    // Animasyonları etkinleştir
    initAnimations();

    // Görünüm değiştirme butonları
    $('.view-options button').click(function() {
        $('.view-options button').removeClass('active');
        $(this).addClass('active');
        
        if ($(this).hasClass('grid-view')) {
            $('.products-grid').removeClass('list-view');
            localStorage.setItem('viewPreference', 'grid');
        } else {
            $('.products-grid').addClass('list-view');
            localStorage.setItem('viewPreference', 'list');
        }
    });

    // Sayfa başına ürün sayısı değişimi
    $('.per-page select').change(function() {
        itemsPerPage = parseInt($(this).val());
        currentPage = 1;
        renderProducts();
        renderPagination();
    });

    // Arama kutusu
    $('.search-box input').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterProducts();
    });

    // Üretici filtresi
    $('.manufacturer-filter input').on('input', function() {
        filterProducts();
    });

    // Filtre butonu
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        // Kategori filtre işlemi burada yapılabilir
        filterProducts();
    });

    // Ürün kartına tıklama (Hızlı Talep butonları için)
    $(document).on('click', '.quick-quote', function(e) {
        e.preventDefault();
        const productCard = $(this).closest('.product-card');
        const productName = productCard.find('h3').text();
        const manufacturer = productCard.find('.manufacturer').text();
        
        // Ürün adını modal'a ekle
        $('#quickQuoteModalLabel .product-name').text(productName);
        
        // Modal'ı göster
        const modal = new bootstrap.Modal(document.getElementById('quickQuoteModal'));
        modal.show();
        
        // Modal içerik animasyonu
        $('.modal-content').addClass('animate__animated animate__fadeInUp');
    });

    // Ürün seçenekleri butonları
    $('.option-btn').click(function() {
        $('.option-btn').removeClass('active');
        $(this).addClass('active');
    });

    // Form gönderimi
    $('#quoteForm').submit(function(e) {
        e.preventDefault();
        showLoading();
        
        // Form verilerini topla
        const formData = {
            productName: $('#quickQuoteModalLabel .product-name').text(),
            name: $('#name').val(),
            companyName: $('#companyName').val(),
            email: $('#email').val(),
            phone: '+90' + $('#phone').val(),
            option: $('.option-btn.active').data('option'),
            quantity: $('#quantity').val(),
            acceptedTerms: $('#terms').is(':checked')
        };

        // Simülasyon: Form gönderimi (gerçekte bu bir AJAX isteği olacaktır)
        setTimeout(function() {
            hideLoading();
            
            // Modal'ı kapat
            const modal = bootstrap.Modal.getInstance(document.getElementById('quickQuoteModal'));
            modal.hide();
            
            // Formu sıfırla
            $('#quoteForm')[0].reset();
            
            // Başarı mesajı göster
            showNotification('Teklif talebiniz başarıyla gönderildi!', 'success');
        }, 1500);
    });

    // Listeye ekle butonu
    $('.add-list-btn').click(function() {
        const productName = $('#quickQuoteModalLabel .product-name').text();
        showNotification(`${productName} listenize eklendi!`, 'info');
    });

    // Sayfalama işlemleri
    $(document).on('click', '.pagination .page-link', function(e) {
        e.preventDefault();
        const targetPage = $(this).data('page');
        if (targetPage && targetPage !== currentPage) {
            currentPage = targetPage;
            renderProducts();
            
            // Sayfayı ürünlerin başlangıcına kaydır
            $('html, body').animate({
                scrollTop: $('.products-grid-wrapper').offset().top - 20
            }, 500);
        }
    });
    
    // Görünüm tercihini yerel depolamadan yükle
    const savedView = localStorage.getItem('viewPreference');
    if (savedView === 'list') {
        $('.list-view').click();
    }
});

// Filtreleme fonksiyonu
function filterProducts() {
    const searchTerm = $('.search-box input').val().toLowerCase();
    const manufacturerTerm = $('.manufacturer-filter input').val().toLowerCase();
    
    // Hem arama terimini hem de üretici filtresini uygula
    filteredProducts = products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const manufacturerMatch = product.manufacturer.toLowerCase().includes(manufacturerTerm);
        return nameMatch && (manufacturerTerm === '' || manufacturerMatch);
    });
    
    currentPage = 1;
    renderProducts();
    renderPagination();
}

// Ürünleri render etme fonksiyonu
function renderProducts() {
    const productsGrid = $('#products-container');
    productsGrid.empty();
    
    showLoading();
    
    setTimeout(() => {
        // Mevcut sayfadaki ürünleri hesapla
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentProducts = filteredProducts.slice(startIndex, endIndex);
        
        // Sonuç olup olmadığını kontrol et
        if (currentProducts.length === 0) {
            $('.no-results').show();
        } else {
            $('.no-results').hide();
            
            // Ürünleri render et
            currentProducts.forEach((product, index) => {
                const productCard = createProductCard(product, index);
                productsGrid.append(productCard);
            });
            
            // Ürün kartlarına hover efekti ekle
            initProductCardEffects();
        }
        
        hideLoading();
    }, 500); // Biraz gecikme ile yükleniyor efekti göster
}

// Ürün kartı oluşturma fonksiyonu
function createProductCard(product, index) {
    return `
        <div class="product-card animate__animated animate__fadeIn" style="animation-delay: ${index * 0.1}s">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/products/placeholder.jpg'">
                <span class="product-badge">${product.availability}</span>
            </div>
            <div class="product-content">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="availability">${product.availability}</p>
                    <p class="manufacturer">${product.manufacturer}</p>
                </div>
                <button class="quick-quote">
                    <i class="fas fa-bolt me-2"></i>Hızlı Talep
                </button>
            </div>
        </div>
    `;
}

// Sayfalama render etme fonksiyonu
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    // Sayfalama HTML'ini oluştur
    let paginationHtml = '';
    
    if (totalPages > 1) {
        paginationHtml = `
            <nav aria-label="Ürün Sayfalaması">
                <ul class="pagination">
                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Önceki">
                            <i class="fas fa-chevron-left"></i>
                        </a>
                    </li>
        `;

        // Sayfa numaralarını ekle
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || 
                i === totalPages || 
                (i >= currentPage - 2 && i <= currentPage + 2)
            ) {
                paginationHtml += `
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `;
            } else if (
                i === currentPage - 3 || 
                i === currentPage + 3
            ) {
                paginationHtml += `
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `;
            }
        }

        paginationHtml += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Sonraki">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            </ul>
        </nav>
        `;
    }
    
    // Sayfalama HTML'ini ekle veya varsa güncelle
    if ($('.pagination-container').length) {
        $('.pagination-container').html(paginationHtml);
    } else {
        $('.products-container').append(`<div class="pagination-container">${paginationHtml}</div>`);
    }
}

// Yükleniyor durumu göster/gizle
function showLoading() {
    $('.loading-indicator').fadeIn(200);
}

function hideLoading() {
    $('.loading-indicator').fadeOut(200);
}

// Bildirim gösterme fonksiyonu
function showNotification(message, type = 'success') {
    // Eğer bildirim div'i yoksa oluştur
    if (!$('#notification').length) {
        $('body').append('<div id="notification" class="notification"></div>');
    }
    
    // Bildirim tipine göre sınıf ekle
    const classes = {
        success: 'notification-success',
        info: 'notification-info',
        warning: 'notification-warning',
        error: 'notification-error'
    };
    
    // İcon ekle
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        error: '<i class="fas fa-times-circle"></i>'
    };
    
    // Bildirimi göster
    $('#notification')
        .removeClass()
        .addClass(`notification ${classes[type]}`)
        .html(`${icons[type]} ${message}`)
        .fadeIn(300)
        .delay(3000)
        .fadeOut(300);
}

// Animasyonları başlat
function initAnimations() {
    // Hero bölümü animasyonları burada başlatılabilir
    $('.hero-section h1').addClass('animate__animated animate__fadeInDown');
    $('.hero-section p').addClass('animate__animated animate__fadeInUp animate__delay-1s');
}

// Ürün kartı efektlerini başlat
function initProductCardEffects() {
    // Ürün resimlerine hover efekti ekle
    $('.product-card').hover(
        function() {
            $(this).find('img').css('transform', 'scale(1.05)');
        },
        function() {
            $(this).find('img').css('transform', 'scale(1)');
        }
    );
}

// CSS eklemek için stil ekle
function addStyles() {
    const styles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 9999;
            display: none;
            max-width: 350px;
            font-weight: 500;
        }
        
        .notification i {
            margin-right: 10px;
        }
        
        .notification-success {
            background-color: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        
        .notification-info {
            background-color: #d1ecf1;
            color: #0c5460;
            border-left: 4px solid #17a2b8;
        }
        
        .notification-warning {
            background-color: #fff3cd;
            color: #856404;
            border-left: 4px solid #ffc107;
        }
        
        .notification-error {
            background-color: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }
    `;
    
    $('<style>').text(styles).appendTo('head');
}

// Stil ekleme fonksiyonunu çağır
addStyles();