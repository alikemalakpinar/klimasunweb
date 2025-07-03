// Header ve RFQ Modal için geliştirilmiş JavaScript kodu
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM yüklendi, script çalışıyor");
    
    // --------------- HEADER İŞLEMLERİ ---------------
    
    // Aktif sayfayı işaretle
    function setActivePage() {
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        
        navLinks.forEach(link => {
            const pageName = link.getAttribute('href');
            if (currentPage.includes(pageName)) {
                link.classList.add('active');
            }
        });
    }

    // Sayfa scroll olduğunda header'ı daralt
    function initScrollEffect() {
        const header = document.querySelector('.header');
        const scrollThreshold = 50;

        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobil menu işlemleri
    function initMobileMenu() {
        const mobileButton = document.querySelector('.mobile-menu-button');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileButton && navMenu) {
            mobileButton.addEventListener('click', function(e) {
                e.stopPropagation();
                navMenu.classList.toggle('active');
                
                // Menü açıldığında buton ikonunu değiştir
                const icon = mobileButton.querySelector('i');
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            // Dışarı tıklandığında menüyü kapat
            document.addEventListener('click', function(event) {
                if (!navMenu.contains(event.target) && !mobileButton.contains(event.target) && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = mobileButton.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            // Mobil menüdeki linklere tıklandığında menüyü kapat
            const mobileLinks = navMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    const icon = mobileButton.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                });
            });
        }
    }

    // --------------- RFQ MODAL İŞLEMLERİ ---------------

    // Modal açma kapama işlemleri
    function initModal() {
        const rfqButton = document.getElementById('rfqButton');
        const rfqModal = document.getElementById('rfqModal');
        const rfqCloseButton = document.getElementById('rfqCloseButton');
        
        console.log("Modal elemanları:", rfqButton, rfqModal, rfqCloseButton);

        if (rfqButton && rfqModal && rfqCloseButton) {
            // Modal açma işlemi
            rfqButton.addEventListener('click', function(e) {
                console.log("RFQ butonuna tıklandı!");
                e.preventDefault();
                document.body.style.overflow = 'hidden';
                rfqModal.style.display = 'flex';
                
                // Animasyon için timeout
                setTimeout(() => {
                    rfqModal.classList.add('show');
                }, 10);
            });

            // Modal kapatma işlemi
            function closeModal() {
                console.log("Modal kapatılıyor");
                rfqModal.classList.remove('show');
                
                // Animasyon bittikten sonra tamamen kapat
                setTimeout(() => {
                    rfqModal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 300);
            }

            // Kapatma butonuna tıklama
            rfqCloseButton.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal();
            });

            // Modal dışına tıklama
            rfqModal.addEventListener('click', function(event) {
                if (event.target === rfqModal) {
                    closeModal();
                }
            });

            // ESC tuşuna basma
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && rfqModal.style.display === 'flex') {
                    closeModal();
                }
            });
        } else {
            console.error("Modal elemanları bulunamadı!");
        }
    }

    // Ürün satırı ekleme ve silme
    function initProductRows() {
        const addMoreBtn = document.getElementById('addMoreProducts');
        const productTable = document.querySelector('.product-table');
        
        if (addMoreBtn && productTable) {
            // Yeni ürün satırı ekle
            addMoreBtn.addEventListener('click', function() {
                const newRow = document.createElement('div');
                newRow.className = 'product-input-row';
                newRow.innerHTML = `
                    <input type="text" class="product-input" placeholder="Ürün(ler)" aria-label="Ürün adı">
                    <input type="number" class="qty-input" value="1" min="1" aria-label="Miktar">
                    <div class="condition-icons">
                        <button class="condition-icon" title="Yeni paketlenmiş" aria-label="Yeni paketlenmiş"><i class="fas fa-box"></i></button>
                        <button class="condition-icon" title="Açık kutu" aria-label="Açık kutu"><i class="fas fa-box-open"></i></button>
                        <button class="condition-icon" title="Yenilenmiş" aria-label="Yenilenmiş"><i class="fas fa-sync"></i></button>
                        <button class="condition-icon" title="Kullanılmış" aria-label="Kullanılmış"><i class="fas fa-cog"></i></button>
                        <button class="condition-icon remove-row" title="Satırı sil" aria-label="Satırı sil"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                productTable.appendChild(newRow);
                
                // Yeni satıra olay dinleyicileri ekle
                initRowEventListeners(newRow);
            });
            
            // Mevcut satırlar için olay dinleyicileri ekle
            const existingRows = productTable.querySelectorAll('.product-input-row');
            existingRows.forEach(row => {
                initRowEventListeners(row);
            });
        }
    }
    
    // Satır içindeki olay dinleyicileri
    function initRowEventListeners(row) {
        // Satır silme butonu
        const removeButton = row.querySelector('.remove-row');
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                // İlk satırı silme, sadece içeriğini temizle
                const allRows = document.querySelectorAll('.product-input-row');
                if (allRows.length === 1) {
                    const inputs = row.querySelectorAll('input');
                    inputs.forEach(input => {
                        input.value = input.type === 'number' ? 1 : '';
                    });
                    // Durum ikonlarını sıfırla
                    const activeIcons = row.querySelectorAll('.condition-icon.active:not(.remove-row)');
                    activeIcons.forEach(icon => {
                        icon.classList.remove('active');
                    });
                } else {
                    // Birden fazla satır varsa sil
                    row.remove();
                }
            });
        }
        
        // Durum ikonları
        const conditionIcons = row.querySelectorAll('.condition-icon:not(.remove-row)');
        conditionIcons.forEach(icon => {
            icon.addEventListener('click', function() {
                // Diğer ikonları deaktif et, sadece tıklanan aktif olsun
                conditionIcons.forEach(otherIcon => {
                    otherIcon.classList.remove('active');
                });
                // Tıklanan ikonu aktif et
                icon.classList.add('active');
            });
        });
    }

    // Dosya yükleme işlemleri
    function initFileUpload() {
        const dropArea = document.getElementById('dropArea');
        const fileInput = document.getElementById('fileInput');
        const browseButton = document.getElementById('browseFiles');
        const uploadedFiles = document.getElementById('uploadedFiles');
        const fileCountElem = dropArea ? dropArea.querySelector('.file-count') : null;
        
        // Maksimum dosya sayısı ve boyutu
        const MAX_FILES = 5;
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
        
        // Yüklenen dosyaları takip et
        let uploadedFileList = [];
        
        if (dropArea && fileInput && browseButton) {
            // Dosya seçme butonu
            browseButton.addEventListener('click', () => {
                fileInput.click();
            });
            
            // Drag & Drop olayları
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Sürükleme başladığında stil değişimi
            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, () => {
                    dropArea.classList.add('drag-over');
                });
            });
            
            // Sürükleme bittiğinde stil değişimi
            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, () => {
                    dropArea.classList.remove('drag-over');
                });
            });
            
            // Dosya bırakıldığında
            dropArea.addEventListener('drop', function(e) {
                const files = e.dataTransfer.files;
                handleFiles(files);
            });
            
            // Dosya seçildiğinde
            fileInput.addEventListener('change', function() {
                handleFiles(fileInput.files);
                fileInput.value = ''; // Input'u sıfırla
            });
            
            // Dosyaları işle
            function handleFiles(files) {
                if (uploadedFileList.length >= MAX_FILES) {
                    alert(`En fazla ${MAX_FILES} dosya yükleyebilirsiniz.`);
                    return;
                }
                
                const remainingSlots = MAX_FILES - uploadedFileList.length;
                const filesToAdd = Array.from(files).slice(0, remainingSlots);
                
                filesToAdd.forEach(file => {
                    // Dosya boyutu kontrolü
                    if (file.size > MAX_FILE_SIZE) {
                        alert(`${file.name} dosyası çok büyük. Maksimum dosya boyutu 20MB'dir.`);
                        return;
                    }
                    
                    // Dosya uzantısı kontrolü
                    const validExtensions = ['.jpg', '.jpeg', '.JPG', '.png', '.pdf', '.doc', '.docx', '.csv', '.xls', '.xlsx'];
                    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
                    
                    if (!validExtensions.includes(fileExt)) {
                        alert(`${file.name} dosyası desteklenmiyor. Lütfen geçerli bir dosya formatı seçin.`);
                        return;
                    }
                    
                    // Dosyayı listeye ekle
                    uploadedFileList.push(file);
                    displayFile(file);
                });
                
                // Dosya sayısını güncelle
                updateFileCount();
            }
            
            // Dosyayı görüntüle
            function displayFile(file) {
                const fileElement = document.createElement('div');
                fileElement.className = 'uploaded-file';
                
                // Dosya tipine göre ikon belirleme
                let fileIcon = 'fa-file';
                const fileExt = file.name.split('.').pop().toLowerCase();
                
                if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
                    fileIcon = 'fa-file-image';
                } else if (['pdf'].includes(fileExt)) {
                    fileIcon = 'fa-file-pdf';
                } else if (['doc', 'docx'].includes(fileExt)) {
                    fileIcon = 'fa-file-word';
                } else if (['xls', 'xlsx', 'csv'].includes(fileExt)) {
                    fileIcon = 'fa-file-excel';
                }
                
                fileElement.innerHTML = `
                    <i class="fas ${fileIcon} uploaded-file-icon"></i>
                    <span class="uploaded-file-name">${file.name}</span>
                    <button type="button" class="uploaded-file-remove" aria-label="Dosyayı Sil">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Dosya silme butonu
                const removeButton = fileElement.querySelector('.uploaded-file-remove');
                removeButton.addEventListener('click', function() {
                    const index = uploadedFileList.findIndex(f => f.name === file.name);
                    if (index !== -1) {
                        uploadedFileList.splice(index, 1);
                        fileElement.remove();
                        updateFileCount();
                    }
                });
                
                uploadedFiles.appendChild(fileElement);
            }
            
            // Dosya sayısını güncelle
            function updateFileCount() {
                if (fileCountElem) {
                    fileCountElem.textContent = `${uploadedFileList.length} / ${MAX_FILES}`;
                }
            }
        }
    }

    // Form doğrulama
    function initFormValidation() {
        const rfqForm = document.getElementById('rfqForm');
        
        if (rfqForm) {
            rfqForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Tüm form alanlarını doğrula
                const isValid = validateForm();
                
                if (isValid) {
                    // Form geçerliyse gönder
                    submitForm();
                }
            });
            
            // Input'larda değişiklik olduğunda hata mesajlarını gizle
            const inputs = rfqForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    const formGroup = this.closest('.form-group') || this.closest('.terms-checkbox');
                    if (formGroup) {
                        formGroup.classList.remove('has-error');
                    }
                });
            });
        }
        
        // Form doğrulama fonksiyonu
        function validateForm() {
            let isValid = true;
            
            // Ad alanı
            const nameInput = document.getElementById('nameInput');
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Lütfen adınızı girin');
                isValid = false;
            }
            
            // Şirket adı
            const companyInput = document.getElementById('companyInput');
            if (!companyInput.value.trim()) {
                showError(companyInput, 'Lütfen şirket adını girin');
                isValid = false;
            }
            
            // Telefon numarası
            const phoneInput = document.getElementById('phoneInput');
            if (phoneInput.value.trim() && !validatePhone(phoneInput.value)) {
                showError(phoneInput, 'Lütfen geçerli bir telefon numarası girin');
                isValid = false;
            }
            
            // E-posta
            const emailInput = document.getElementById('emailInput');
            if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
                showError(emailInput, 'Lütfen geçerli bir e-posta adresi girin');
                isValid = false;
            }
            
            // Şartlar ve koşullar onayı
            const termsCheckbox = document.getElementById('terms');
            if (!termsCheckbox.checked) {
                showError(termsCheckbox, 'Devam etmek için şartları kabul etmelisiniz');
                isValid = false;
            }
            
            return isValid;
        }
        
        // Hata mesajı gösterme
        function showError(input, message) {
            const formGroup = input.closest('.form-group') || input.closest('.terms-checkbox');
            
            if (formGroup) {
                formGroup.classList.add('has-error');
                const errorElement = formGroup.querySelector('.error-message');
                
                if (errorElement) {
                    errorElement.textContent = message;
                }
                
                // Hata animasyonu ekle
                formGroup.classList.add('shake');
                setTimeout(() => {
                    formGroup.classList.remove('shake');
                }, 500);
            }
        }
        
        // E-posta doğrulama
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        // Telefon numarası doğrulama
        function validatePhone(phone) {
            const re = /^[0-9]{10}$/; // Basit bir Türkiye telefon numarası kontrolü (10 rakam)
            return re.test(String(phone).replace(/\s/g, ''));
        }
        
        // Form gönderme
        function submitForm() {
            const submitButton = document.getElementById('submitButton');
            
            if (submitButton) {
                // Gönder butonunu devre dışı bırak
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GÖNDERİLİYOR...';
                
                // Form gönderildi simülasyonu
                setTimeout(() => {
                    // Gerçek uygulamada burada API isteği yapılır
                    alert('Talebiniz başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.');
                    
                    // Formu sıfırla
                    document.getElementById('rfqForm').reset();
                    
                    // Ürün satırlarını sıfırla
                    resetProductRows();
                    
                    // Dosyaları sıfırla
                    resetFiles();
                    
                    // Modal'ı kapat
                    const rfqModal = document.getElementById('rfqModal');
                    rfqModal.classList.remove('show');
                    setTimeout(() => {
                        rfqModal.style.display = 'none';
                        document.body.style.overflow = '';
                    }, 300);
                    
                    // Butonu normal haline getir
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>GÖNDER</span><i class="fas fa-arrow-right"></i>';
                }, 2000);
            }
        }
        
        // Ürün satırlarını sıfırlama
        function resetProductRows() {
            const productTable = document.querySelector('.product-table');
            const firstRow = productTable.querySelector('.product-input-row');
            
            // İlk satır dışındaki tüm satırları kaldır
            Array.from(productTable.querySelectorAll('.product-input-row')).forEach((row, index) => {
                if (index !== 0) {
                    row.remove();
                }
            });
            
            // İlk satırı sıfırla
            const inputs = firstRow.querySelectorAll('input');
            inputs.forEach(input => {
                input.value = input.type === 'number' ? 1 : '';
            });
            
            // Durum ikonlarını sıfırla
            const activeIcons = firstRow.querySelectorAll('.condition-icon.active:not(.remove-row)');
            activeIcons.forEach(icon => {
                icon.classList.remove('active');
            });
        }
        
        // Dosyaları sıfırlama
        function resetFiles() {
            const uploadedFiles = document.getElementById('uploadedFiles');
            const fileCountElem = document.querySelector('.file-count');
            
            if (uploadedFiles) {
                uploadedFiles.innerHTML = '';
            }
            
            if (fileCountElem) {
                fileCountElem.textContent = '0 / 5';
            }
        }
    }

    // Tüm fonksiyonları çalıştır
    setActivePage();
    initScrollEffect();
    initMobileMenu();
    initModal();
    initProductRows();
    initFileUpload();
    initFormValidation();
});