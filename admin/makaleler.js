$(document).ready(function() {
    const modal = $("#blogModal");
    const yeniBlogBtn = $("#yeniBlogBtn");
    const closeBtn = $(".close");
    const blogForm = $("#blogForm");
    const imageInput = $("#blogImage");
    const imagePreview = $("#imagePreview");
    const blogList = $("#blogList");
    const fileInputBtn = $(".file-input-btn");

    // Blogları veritabanından yükle
    function loadBlogs() {
        $.get('save_blog.php')
            .done(function(response) {
                if (response.success) {
                    blogList.empty();
                    response.data.forEach(blog => {
                        blogList.append(createBlogCard(blog));
                    });
                } else {
                    showNotification('Bloglar yüklenirken bir hata oluştu.', 'error');
                }
            })
            .fail(function() {
                showNotification('Sunucu ile bağlantı kurulamadı.', 'error');
            });
    }

    // Blog kartı oluşturma fonksiyonu
    function createBlogCard(blog) {
        const visibilityIcon = blog.isVisible ? 'fa-eye' : 'fa-eye-slash';
        const visibilityText = blog.isVisible ? 'Gizle' : 'Göster';
        const cardClass = blog.isVisible ? 'blog-card' : 'blog-card hidden';
        
        // Görsel yolunu düzelt
        const imageUrl = blog.image.startsWith('http') ? blog.image : 
                        blog.image.startsWith('/') ? blog.image : 
                        '../' + blog.image;
        
        return `
            <div class="${cardClass}" data-id="${blog.id}">
                <div class="blog-image-container">
                    <img src="${imageUrl}" alt="${blog.title}" onerror="this.src='../assets/images/default-blog.jpg'">
                </div>
                <div class="blog-content">
                    <h3>${blog.title}</h3>
                    <p>${blog.content}</p>
                    <div class="blog-actions">
                        <button class="edit-btn">
                            <i class="fas fa-edit"></i>
                            Düzenle
                        </button>
                        <button class="visibility-btn">
                            <i class="fas ${visibilityIcon}"></i>
                            ${visibilityText}
                        </button>
                        <button class="delete-btn">
                            <i class="fas fa-trash"></i>
                            Sil
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Modal'ı aç
    yeniBlogBtn.click(function() {
        modal.fadeIn(300);
        $('body').css('overflow', 'hidden');
    });

    // Modal'ı kapat
    function closeModal() {
        modal.fadeOut(300);
        blogForm[0].reset();
        imagePreview.empty();
        $('body').css('overflow', 'auto');
    }

    closeBtn.click(closeModal);

    // Modal dışına tıklandığında kapat
    $(window).click(function(event) {
        if (event.target == modal[0]) {
            closeModal();
        }
    });

    // Özel dosya input butonu
    fileInputBtn.click(function() {
        imageInput.click();
    });

    // Görsel önizleme
    imageInput.change(function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.html(`
                    <img src="${e.target.result}" alt="Seçilen görsel">
                    <button type="button" class="remove-image">
                        <i class="fas fa-times"></i>
                    </button>
                `);
            };
            reader.readAsDataURL(file);
        }
    });

    // Görsel kaldırma
    imagePreview.on('click', '.remove-image', function() {
        imageInput.val('');
        imagePreview.empty();
    });

    // Form gönderimi
    blogForm.submit(function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', $("#blogTitle").val());
        formData.append('content', $("#blogContent").val());
        formData.append('isVisible', true);
        formData.append('image', imageInput[0].files[0]);

        $.ajax({
            url: 'save_blog.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    closeModal();
                    loadBlogs();
                    showNotification(response.message, 'success');
                } else {
                    showNotification(response.message, 'error');
                }
            },
            error: function() {
                showNotification('Sunucu ile bağlantı kurulamadı.', 'error');
            }
        });
    });

    // Görünürlük değiştirme
    $(document).on('click', '.visibility-btn', function() {
        const blogCard = $(this).closest('.blog-card');
        const blogId = blogCard.data('id');
        const isCurrentlyVisible = !blogCard.hasClass('hidden');
        const $button = $(this);
        const $icon = $button.find('i');
        
        $.ajax({
            url: 'toggle_visibility.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: blogId,
                isVisible: !isCurrentlyVisible // Mevcut durumun tersini gönderiyoruz
            }),
            success: function(response) {
                if (response.success) {
                    // Görsel efektlerle durumu güncelle
                    blogCard.fadeOut(300, function() {
                        if (isCurrentlyVisible) {
                            // Gizleme
                            blogCard.addClass('hidden');
                            $icon.removeClass('fa-eye').addClass('fa-eye-slash');
                            $button.html('<i class="fas fa-eye-slash"></i> Göster');
                        } else {
                            // Gösterme
                            blogCard.removeClass('hidden');
                            $icon.removeClass('fa-eye-slash').addClass('fa-eye');
                            $button.html('<i class="fas fa-eye"></i> Gizle');
                        }
                        blogCard.fadeIn(300);
                    });
                    showNotification(response.message, 'success');
                } else {
                    showNotification(response.message, 'error');
                }
            },
            error: function() {
                showNotification('Sunucu ile bağlantı kurulamadı.', 'error');
            }
        });
    });

    // Düzenle butonu işlevi
    $(document).on('click', '.edit-btn', function() {
        const blogCard = $(this).closest('.blog-card');
        const blogId = blogCard.data('id');
        showNotification('Düzenleme özelliği yakında eklenecek!', 'info');
    });

    // Sil butonu işlevi
    $(document).on('click', '.delete-btn', function() {
        const blogCard = $(this).closest('.blog-card');
        const blogId = blogCard.data('id');
        
        if (confirm('Bu blogu silmek istediğinizden emin misiniz?')) {
            $.ajax({
                url: 'delete_blog.php',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: blogId
                }),
                success: function(response) {
                    if (response.success) {
                        blogCard.fadeOut(300, function() {
                            loadBlogs();
                        });
                        showNotification(response.message, 'success');
                    } else {
                        showNotification(response.message, 'error');
                    }
                },
                error: function() {
                    showNotification('Sunucu ile bağlantı kurulamadı.', 'error');
                }
            });
        }
    });

    // Bildirim gösterme fonksiyonu
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="notification ${type}">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                ${message}
            </div>
        `);
        
        $('body').append(notification);
        notification.fadeIn(300);
        
        setTimeout(() => {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // Sayfa yüklendiğinde blogları getir
    loadBlogs();
});
