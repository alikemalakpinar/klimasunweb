$(document).ready(function() {
    // Banner içeriğine sayfa yüklendikten sonra animasyon sınıfı ekleme
    setTimeout(function() {
        $('.banner-content').addClass('animate__fadeIn');
    }, 300);

    // Kategori filtreleme işlevselliği
    $('.filter-btn').click(function() {
        const category = $(this).data('category');
        
        // Aktif düğme durumunu güncelleme
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        // "Tümü" kategorisi seçiliyse hepsini göster
        if (category === 'all') {
            $('.brand-card').show();
            $('#no-results').hide();
            return;
        }
        
        // Aksi takdirde kategoriye göre filtrele
        let visibleCount = 0;
        $('.brand-card').each(function() {
            const cardCategories = $(this).data('category').split(' ');
            if (cardCategories.includes(category)) {
                $(this).show();
                visibleCount++;
            } else {
                $(this).hide();
            }
        });
        
        // Hiçbir şey eşleşmezse "sonuç yok" mesajını göster
        if (visibleCount === 0) {
            $('#no-results').show();
        } else {
            $('#no-results').hide();
        }
    });

    // Arama işlevselliği
    $('#brand-search').on('input', function() {
        const searchTerm = $(this).val().toLowerCase().trim();
        
        // Girişe bağlı olarak temizleme düğmesini göster/gizle
        if (searchTerm.length > 0) {
            $('#clear-search').show();
        } else {
            $('#clear-search').hide();
        }
        
        // Arama yaparken kategori filtresini sıfırla
        $('.filter-btn').removeClass('active');
        $('.filter-btn[data-category="all"]').addClass('active');
        
        // Aramaya göre markaları filtrele
        let visibleCount = 0;
        $('.brand-card').each(function() {
            const brandName = $(this).find('h3').text().toLowerCase();
            const brandDesc = $(this).find('.brand-description').text().toLowerCase();
            const brandCategories = $(this).data('category').toLowerCase();
            
            if (brandName.includes(searchTerm) || 
                brandDesc.includes(searchTerm) || 
                brandCategories.includes(searchTerm)) {
                $(this).show();
                visibleCount++;
            } else {
                $(this).hide();
            }
        });
        
        // Hiçbir şey eşleşmezse "sonuç yok" mesajını göster
        if (visibleCount === 0 && searchTerm.length > 0) {
            $('#no-results').show();
        } else {
            $('#no-results').hide();
        }
    });

    // Aramayı temizleme düğmesi
    $('#clear-search').click(function() {
        $('#brand-search').val('').trigger('input');
        $(this).hide();
    });

    // Arama etiketleri işlevselliği
    $('.search-tag').click(function() {
        const term = $(this).data('term');
        $('#brand-search').val(term).trigger('input');
    });

    // Geliştirilmiş işlevsellikle marka kartı tıklama işleyicisi
    $('.brand-card').click(function(e) {
        if (!$(e.target).closest('.view-products').length) {
            const brandPage = $(this).attr('href');
            if (brandPage) {
                window.location.href = brandPage;
            }
        }
    });

    // Tüm Ürünleri Görüntüle tıklama işleyicisi
    $('.view-products').click(function(e) {
        e.preventDefault();
        e.stopPropagation(); // Üst marka kartı tıklamasının tetiklenmesini önler
        const brandCard = $(this).closest('.brand-card');
        const brandPage = brandCard.attr('href');
        if (brandPage) {
            window.location.href = brandPage;
        }
    });

    // Hızlı Teklif modalı
    $('#quote-request').click(function(e) {
        e.preventDefault();
        $('#quote-modal').addClass('show');
        setTimeout(function() {
            $('#quote-modal .modal-content').css({
                'transform': 'translateY(0)',
                'opacity': '1'
            });
        }, 50);
    });

    // Modalı kapat
    $('.close-modal').click(function() {
        $('#quote-modal .modal-content').css({
            'transform': 'translateY(-50px)',
            'opacity': '0'
        });
        setTimeout(function() {
            $('#quote-modal').removeClass('show');
        }, 300);
    });

    // Dışarı tıklandığında modalı kapat
    $(window).click(function(e) {
        if ($(e.target).is('#quote-modal')) {
            $('.close-modal').click();
        }
    });

    // Form gönderimi
    $('#quote-form').submit(function(e) {
        e.preventDefault();
        
        // Basit form doğrulama
        let isValid = true;
        $(this).find('[required]').each(function() {
            if ($(this).val().trim() === '') {
                $(this).css('border-color', 'red');
                isValid = false;
            } else {
                $(this).css('border-color', '');
            }
        });
        
        if (isValid) {
            // Başarı mesajı göster (gerçek bir uygulamada, form verilerini bir sunucuya gönderirsiniz)
            $(this).html('<div class="success-message"><i class="fas fa-check-circle"></i><h3>Teşekkürler!</h3><p>Teklif isteğiniz başarıyla gönderildi. Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p></div>');
            
            // 3 saniye sonra modalı kapat
            setTimeout(function() {
                $('.close-modal').click();
            }, 3000);
        }
    });

    // Yukarı çık düğmesi
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#back-to-top').addClass('visible');
        } else {
            $('#back-to-top').removeClass('visible');
        }
    });

    $('#back-to-top').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
        return false;
    });

    // Daha fazla marka yükle düğmesi
    $('#load-more').click(function() {
        // Gerçek bir uygulamada, daha fazla markayı bir sunucudan yüklersiniz
        // Bu demo için, mevcut markaları klonlayarak simüle edeceğiz
        const brandsToAdd = $('.brands-grid .brand-card').slice(0, 6).clone();
        
        // Farklı görünmeleri için bazı özellikleri değiştir
        brandsToAdd.each(function(index) {
            // Yeni ID'ler ekle ve içeriği biraz değiştir
            $(this).find('h3').text($(this).find('h3').text() + ' ' + (index + 7));
            
            // Animasyonlar ekle
            $(this).css('animation-delay', (index * 0.1) + 's');
        });
        
        // Izgaraya ekle
        $('.brands-grid').append(brandsToAdd);
        
        // Yeni kartlar için tıklama olaylarını yeniden bağla
        $('.brand-card').off('click').click(function(e) {
            if (!$(e.target).closest('.view-products').length) {
                const brandPage = $(this).attr('href');
                if (brandPage) {
                    window.location.href = brandPage;
                }
            }
        });
        
        // İkinci tıklamadan sonra düğmeyi gizle (sayfalama sınırlaması örneği)
        if ($(this).data('clicked')) {
            $(this).hide();
            $('<p class="all-loaded">Tüm üreticiler yüklendi</p>')
                .insertAfter(this)
                .hide()
                .fadeIn();
        } else {
            $(this).data('clicked', true);
        }
    });
    
    // Resim yükleme animasyonu ekle
    $('.brand-image-container img').each(function() {
        $(this).on('load', function() {
            $(this).addClass('loaded');
        });
        
        if (this.complete) {
            $(this).addClass('loaded');
        }
    });
    
    // Klavye erişilebilirliği
    $('.brand-card').attr('tabindex', '0');
    $('.brand-card').keypress(function(e) {
        if (e.which === 13) { // Enter tuşu
            $(this).click();
        }
    });
    
    // Gerekirse ipuçlarını başlat
    $('[data-toggle="tooltip"]').each(function() {
        const tooltipText = $(this).data('tooltip');
        $(this).append('<span class="tooltip-text">' + tooltipText + '</span>');
    });
    
    // İsteğe bağlı: Banner'a hafif bir parallax efekti ekle
    $(window).scroll(function() {
        const scrollPosition = $(window).scrollTop();
        if (scrollPosition < 600) {
            $('.banner-image').css('transform', 'scale(1.05) translateY(' + (scrollPosition * 0.2) + 'px)');
        }
    });
    
    // İsteğe bağlı: Kaydırırken animasyon için kesişim gözlemcisi ekle
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.brand-card, .showed-container h2, .showed-container p, .button-group')
            .forEach(el => observer.observe(el));
    }
});