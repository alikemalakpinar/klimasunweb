$(document).ready(function() {
    // Telefon numarası maskeleme
    $('#phone').mask('(000) 000 00 00', {
        placeholder: "(___) ___ __ __"
    });

    // Formdaki girişlerin otomatik doğrulanması
    const validateInput = function(input) {
        const value = $(input).val().trim();
        const formGroup = $(input).closest('.form-group');
        
        // Boş alanları kontrol et
        if ($(input).prop('required') && value === '') {
            formGroup.addClass('error').removeClass('success');
            
            // Error mesajı yoksa ekle
            if (formGroup.find('.error-message').length === 0) {
                formGroup.append('<div class="error-message">Bu alan boş bırakılamaz</div>');
            }
            return false;
        }
        
        // E-posta doğrulama
        if ($(input).attr('type') === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                formGroup.addClass('error').removeClass('success');
                
                // Error mesajı yoksa ekle veya güncelle
                if (formGroup.find('.error-message').length === 0) {
                    formGroup.append('<div class="error-message">Geçerli bir e-posta adresi giriniz</div>');
                } else {
                    formGroup.find('.error-message').text('Geçerli bir e-posta adresi giriniz');
                }
                return false;
            }
        }
        
        // Select alanlarını kontrol et
        if ($(input).is('select') && $(input).prop('required')) {
            if (value === '' || value === null) {
                formGroup.addClass('error').removeClass('success');
                
                // Error mesajı yoksa ekle
                if (formGroup.find('.error-message').length === 0) {
                    formGroup.append('<div class="error-message">Lütfen bir seçenek belirleyin</div>');
                }
                return false;
            }
        }
        
        // Checkbox kontrol (kullanım şartları)
        if ($(input).attr('id') === 'terms') {
            if (!$(input).prop('checked')) {
                const checkboxGroup = $(input).closest('.checkbox-group');
                checkboxGroup.addClass('error').removeClass('success');
                
                // Error mesajı yoksa ekle
                if (checkboxGroup.find('.error-message').length === 0) {
                    checkboxGroup.append('<div class="error-message">Devam etmek için şartları kabul etmelisiniz</div>');
                }
                return false;
            } else {
                $(input).closest('.checkbox-group').removeClass('error').addClass('success');
                $(input).closest('.checkbox-group').find('.error-message').remove();
            }
        }
        
        // Doğrulama başarılı oldu
        formGroup.removeClass('error').addClass('success');
        formGroup.find('.error-message').remove();
        return true;
    };

    // İnput alanları için blur olayı
    $('.form-group input, .form-group select, .form-group textarea').blur(function() {
        validateInput(this);
    });

    // Checkbox değişimleri için change olayı
    $('.checkbox-container input[type="checkbox"]').change(function() {
        validateInput(this);
    });

    // Form gönderimi
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Tüm gerekli alanları doğrula
        $(this).find('input, select, textarea').each(function() {
            if (!validateInput(this) && isValid) {
                isValid = false;
                $(this).focus();
            }
        });
        
        if (isValid) {
            // Form gönderilebilir - Ajax gönderimi burada olabilir
            // Örnek:
            /*
            $.ajax({
                url: 'your-endpoint.php',
                type: 'POST',
                data: $('#contact-form').serialize(),
                success: function(response) {
                    // Başarılı yanıt
                    showSuccessModal();
                },
                error: function(xhr, status, error) {
                    // Hata yanıtı
                    alert('Form gönderilirken bir hata oluştu.');
                }
            });
            */
            
            // Şimdilik sadece başarılı modeli göster
            showSuccessModal();
        }
    });

    // Kullanım şartları modeli
    $('.terms-link').click(function(e) {
        e.preventDefault();
        const modalId = $(this).data('modal');
        $('#' + modalId).addClass('show');
        setTimeout(function() {
            $('#' + modalId + ' .modal-content').css({
                'transform': 'translateY(0)',
                'opacity': '1'
            });
        }, 50);
    });

    // Modal kapatma
    $('.close-modal, .modal-ok-btn').click(function() {
        closeActiveModal();
    });

    // Modal dışına tıklama
    $('.modal').click(function(e) {
        if ($(e.target).is('.modal')) {
            closeActiveModal();
        }
    });

    // Escape tuşuyla modal kapatma
    $(document).keydown(function(e) {
        if (e.key === "Escape" && $('.modal.show').length > 0) {
            closeActiveModal();
        }
    });

    // Aktif modalı kapatma fonksiyonu
    function closeActiveModal() {
        $('.modal.show .modal-content').css({
            'transform': 'translateY(-30px)',
            'opacity': '0'
        });
        
        setTimeout(function() {
            $('.modal.show').removeClass('show');
        }, 300);
    }

    // Kullanım şartları kabul/ret
    $('#accept-terms').click(function() {
        $('#terms').prop('checked', true).trigger('change');
        closeActiveModal();
    });

    $('#decline-terms').click(function() {
        $('#terms').prop('checked', false).trigger('change');
        closeActiveModal();
    });

    // Başarı modalını gösterme
    function showSuccessModal() {
        // Form'u temizle
        $('#contact-form')[0].reset();
        $('.form-group').removeClass('error success');
        
        // Başarı modalını göster
        $('#success-modal').addClass('show');
        setTimeout(function() {
            $('#success-modal .modal-content').css({
                'transform': 'translateY(0)',
                'opacity': '1'
            });
        }, 50);
    }

    // Hero bölümü animasyonları
    setTimeout(function() {
        $('.contact-hero-content').addClass('animate__fadeIn');
    }, 300);

    // Scroll ile animasyon
    function animateOnScroll() {
        $('.contact-info-box, .contact-form-box, .map-section').each(function() {
            const position = $(this).offset().top;
            const scroll = $(window).scrollTop();
            const windowHeight = $(window).height();
            
            if (scroll + windowHeight > position) {
                $(this).addClass('fade-in');
            }
        });
    }

    // İlk yüklemede ve scroll'da çalıştır
    animateOnScroll();
    $(window).scroll(function() {
        animateOnScroll();
    });
});