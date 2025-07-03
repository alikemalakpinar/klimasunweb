class KlimasunApp {
    constructor() {
        // DOM elementleri
        this.body = document.body;
        this.heroSection = document.querySelector('.hero-section');
        this.heroContent = document.querySelector('.hero-content');
        this.categoryTitles = document.querySelectorAll('.category-title');
        this.manufacturersSection = document.querySelector('.image-section');
        this.categoriesSection = document.querySelector('.product-categories-section');
        this.backToTopButton = document.getElementById('backToTop');
        this.floatingRfqBtn = document.getElementById('floatingRfqBtn');
        this.rfqModal = document.getElementById('rfqModal');
        this.rfqCloseButton = document.getElementById('rfqCloseButton');
        this.headerRfqButton = document.getElementById('rfqButton');
        this.productButton = document.querySelector('.btn-primary');
        this.requestButton = document.querySelector('.btn-secondary');
        this.animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        // Form elemanları
        this.rfqForm = document.getElementById('rfqForm');
        this.nameInput = document.getElementById('nameInput');
        this.companyInput = document.getElementById('companyInput');
        this.phoneInput = document.getElementById('phoneInput');
        this.emailInput = document.getElementById('emailInput');
        this.termsCheckbox = document.getElementById('terms');
        this.submitButton = document.getElementById('submitButton');
        this.addMoreProductsBtn = document.getElementById('addMoreProducts');
        this.dropArea = document.getElementById('dropArea');
        this.fileInput = document.getElementById('fileInput');
        this.browseFilesBtn = document.getElementById('browseFiles');
        this.uploadedFilesContainer = document.getElementById('uploadedFiles');
        this.notesTextarea = document.getElementById('notesTextarea');
        
        // Durumlar
        this.isMenuOpen = false;
        this.isRfqModalOpen = false;
        this.scrollPosition = 0;
        this.uploadedFiles = [];
        
        // Event listener'ları başlat
        this.initEventListeners();
        
        // Sayfa yükleme animasyonları
        this.initPageLoadAnimations();
        
        // Intersection Observer başlat
        this.initIntersectionObserver();
        
        // Mobil menü oluştur
        this.createMobileMenu();
        
        // Duruma göre elementleri göster/gizle
        this.initVisibilityState();
        
        // AOS başlat (varsa)
        this.initAOS();
        
        console.log('Klimasun uygulaması başlatıldı');
    }
    
    // Event listener'ları başlat
    initEventListeners() {
        // Sayfa scroll event'i
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Geri yukarı çık butonu
        if (this.backToTopButton) {
            this.backToTopButton.addEventListener('click', this.scrollToTop.bind(this));
        }
        
        // RFQ modal butonları
        if (this.floatingRfqBtn) {
            this.floatingRfqBtn.addEventListener('click', this.openRfqModal.bind(this));
        }
        
        if (this.headerRfqButton) {
            this.headerRfqButton.addEventListener('click', e => {
                e.preventDefault();
                this.openRfqModal();
            });
        }
        
        if (this.rfqCloseButton) {
            this.rfqCloseButton.addEventListener('click', e => {
                e.preventDefault();
                this.closeRfqModal();
            });
        }
        
        if (this.rfqModal) {
            this.rfqModal.addEventListener('click', e => {
                if (e.target === this.rfqModal) {
                    this.closeRfqModal();
                }
            });
        }
        
        // ESC tuşu ile modal kapatma
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isRfqModalOpen) {
                this.closeRfqModal();
            }
        });
        
        // Kategori geçişleri
        if (this.categoryTitles.length) {
            this.categoryTitles.forEach(title => {
                title.addEventListener('click', () => this.handleCategoryClick(title));
            });
        }
        
        // Ürün butonu
        if (this.productButton) {
            this.productButton.addEventListener('click', this.handleProductButtonClick.bind(this));
        }
        
        // İletişim butonu
        if (this.requestButton) {
            this.requestButton.addEventListener('click', this.handleRequestButtonClick.bind(this));
        }
        
        // Kart tıklama efektleri
        document.body.addEventListener('click', this.handleCardClicks.bind(this));
        
        // Form işlemleri
        if (this.rfqForm) {
            this.rfqForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
        
        // Ürün ekleme butonu
        if (this.addMoreProductsBtn) {
            this.addMoreProductsBtn.addEventListener('click', this.addProductRow.bind(this));
        }
        
        // Dosya yükleme işlemleri
        if (this.dropArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.preventDefaults, false);
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.highlight.bind(this), false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.unhighlight.bind(this), false);
            });
            
            this.dropArea.addEventListener('drop', this.handleDrop.bind(this), false);
        }
        
        if (this.browseFilesBtn) {
            this.browseFilesBtn.addEventListener('click', () => {
                this.fileInput.click();
            });
        }
        
        if (this.fileInput) {
            this.fileInput.addEventListener('change', () => {
                this.handleFiles(this.fileInput.files);
            });
        }
        
        // Sayfa geçişi için bekleyin, önce yüklemeleri tamamlayın
        window.addEventListener('beforeunload', () => {
            document.querySelector('.page-transition')?.classList.add('active');
        });
    }
    
    // Sayfa yükleme animasyonları
    initPageLoadAnimations() {
        // Hero içeriğini görünür yap
        if (this.heroContent) {
            setTimeout(() => {
                this.heroContent.classList.add('animate-in');
            }, 500);
        }
        
        // Preloader'ı temizle
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hide');
                setTimeout(() => {
                    this.body.classList.add('loaded');
                    if (preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 500);
            }, 800);
        } else {
            this.body.classList.add('loaded');
        }
    }
    
    // Intersection Observer ile animasyonları başlat
    initIntersectionObserver() {
        if (!this.animatedElements.length) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const handleIntersect = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const observer = new IntersectionObserver(handleIntersect, observerOptions);
        
        this.animatedElements.forEach(el => {
            observer.observe(el);
        });
        
        // Parallax efektleri için ayrı bir observer
        this.initParallaxEffects();
    }
    
    // Parallax efektleri
    initParallaxEffects() {
        const parallaxSections = document.querySelectorAll('.image-section, .product-categories-section, .blogs');
        
        if (!parallaxSections.length) return;
        
        const handleParallaxScroll = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const distance = scrollTop - sectionTop;
                
                if (scrollTop > sectionTop - window.innerHeight && scrollTop < sectionTop + section.offsetHeight) {
                    const img = section.querySelector('img');
                    if (img) {
                        // Daha yumuşak bir parallax efekti
                        img.style.transform = `translateY(${distance * 0.08}px)`;
                    }
                }
            });
        };
        
        // Performans için throttled scroll event
        let lastScrollTime = 0;
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollTime > 16) { // ~60fps
                lastScrollTime = now;
                requestAnimationFrame(handleParallaxScroll);
            }
        });
    }
    
    // Mobil menü oluştur
    createMobileMenu() {
        // Eğer zaten mobil menü varsa, yeniden oluşturma
        if (document.querySelector('.mobile-menu-wrapper')) return;
        
        // Hamburger butonu ekle (header'da varsa)
        const header = document.querySelector('header');
        if (header) {
            const navToggle = document.createElement('button');
            navToggle.className = 'hamburger-btn';
            navToggle.setAttribute('aria-label', 'Menüyü aç/kapat');
            
            for (let i = 0; i < 3; i++) {
                const line = document.createElement('span');
                line.className = 'hamburger-line';
                navToggle.appendChild(line);
            }
            
            header.querySelector('.header-right')?.prepend(navToggle);
            
            navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Mobil menü yapısını oluştur
        const mobileMenuWrapper = document.createElement('div');
        mobileMenuWrapper.className = 'mobile-menu-wrapper';
        mobileMenuWrapper.innerHTML = `
            <div class="mobile-menu">
                <button class="mobile-menu-close" aria-label="Kapat">&times;</button>
                <div class="mobile-menu-header">
                    <img src="../images/logo.png" alt="Klimasun Logo" class="mobile-logo">
                </div>
                <ul class="mobile-nav-menu">
                    <li class="mobile-nav-item"><a href="index.html" class="mobile-nav-link active">Ana Sayfa</a></li>
                    <li class="mobile-nav-item has-submenu">
                        <a href="hakkimizda.html" class="mobile-nav-link">Hakkımızda</a>
                        <button class="submenu-toggle"><i class="fas fa-chevron-down"></i></button>
                        <ul class="mobile-submenu">
                            <li class="mobile-submenu-item"><a href="vizyon-misyon.html" class="mobile-submenu-link">Vizyon & Misyon</a></li>
                            <li class="mobile-submenu-item"><a href="insan-kaynaklari.html" class="mobile-submenu-link">İnsan Kaynakları</a></li>
                        </ul>
                    </li>
                    <li class="mobile-nav-item has-submenu">
                        <a href="ureticiler.html" class="mobile-nav-link">Üreticiler</a>
                        <button class="submenu-toggle"><i class="fas fa-chevron-down"></i></button>
                        <ul class="mobile-submenu">
                            <li class="mobile-submenu-item"><a href="siemens.html" class="mobile-submenu-link">Siemens</a></li>
                            <li class="mobile-submenu-item"><a href="allen-bradley.html" class="mobile-submenu-link">Allen Bradley</a></li>
                            <li class="mobile-submenu-item"><a href="schneider-electric.html" class="mobile-submenu-link">Schneider Electric</a></li>
                        </ul>
                    </li>
                    <li class="mobile-nav-item"><a href="blog.html" class="mobile-nav-link">Blog</a></li>
                    <li class="mobile-nav-item"><a href="iletisim.html" class="mobile-nav-link">İletişim</a></li>
                </ul>
                <div class="mobile-menu-footer">
                    <div class="mobile-social-links">
                        <a href="#" class="mobile-social-link"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="mobile-social-link"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="mobile-social-link"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="mobile-social-link"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                    <div class="mobile-contact-info">
                        <div class="mobile-contact-item">
                            <i class="fas fa-phone-alt mobile-contact-icon"></i>
                            <span>+90 212 123 45 67</span>
                        </div>
                        <div class="mobile-contact-item">
                            <i class="fas fa-envelope mobile-contact-icon"></i>
                            <span>info@klimasun.com</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.body.appendChild(mobileMenuWrapper);
        
        // Mobil menü event'leri
        const mobileMenuClose = mobileMenuWrapper.querySelector('.mobile-menu-close');
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Alt menü toggle
        const submenuToggles = mobileMenuWrapper.querySelectorAll('.submenu-toggle');
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const hasActive = toggle.classList.contains('active');
                toggle.classList.toggle('active');
                
                const submenu = toggle.nextElementSibling;
                if (submenu && submenu.classList.contains('mobile-submenu')) {
                    if (hasActive) {
                        submenu.style.maxHeight = '0px';
                        setTimeout(() => {
                            submenu.classList.remove('open');
                        }, 300);
                    } else {
                        submenu.classList.add('open');
                        submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    }
                }
            });
        });
    }
    
    // Mobil menüyü aç/kapat
    toggleMobileMenu() {
        const mobileMenuWrapper = document.querySelector('.mobile-menu-wrapper');
        if (!mobileMenuWrapper) return;
        
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            mobileMenuWrapper.classList.add('active');
            this.body.style.overflow = 'hidden';
            // Hamburger butonunu "X" şekline getir
            const hamburgerBtn = document.querySelector('.hamburger-btn');
            if (hamburgerBtn) {
                hamburgerBtn.classList.add('active');
            }
        } else {
            mobileMenuWrapper.classList.remove('active');
            this.body.style.overflow = '';
            // Hamburger butonunu normal haline getir
            const hamburgerBtn = document.querySelector('.hamburger-btn');
            if (hamburgerBtn) {
                hamburgerBtn.classList.remove('active');
            }
        }
    }
    
    // Scroll olayını yönet
    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Header scroll durumu
        const header = document.querySelector('header');
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Back to top butonunu göster/gizle
        if (this.backToTopButton) {
            if (scrollTop > 300) {
                this.backToTopButton.classList.add('visible');
            } else {
                this.backToTopButton.classList.remove('visible');
            }
        }
    }
    
    // Sayfa başına scroll
    scrollToTop(e) {
        if (e) e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // RFQ modalını aç
    openRfqModal() {
        if (!this.rfqModal) return;
        
        this.isRfqModalOpen = true;
        this.scrollPosition = window.pageYOffset;
        this.body.style.overflow = 'hidden';
        this.rfqModal.style.display = 'flex';
        
        setTimeout(() => {
            this.rfqModal.classList.add('show');
        }, 10);
    }
    
    // RFQ modalını kapat
    closeRfqModal() {
        if (!this.rfqModal) return;
        
        this.isRfqModalOpen = false;
        this.rfqModal.classList.remove('show');
        
        setTimeout(() => {
            this.rfqModal.style.display = 'none';
            this.body.style.overflow = '';
            window.scrollTo(0, this.scrollPosition);
        }, 300);
    }
    
    // Kategori tıklama işlemleri
    handleCategoryClick(clickedTitle) {
        const category = clickedTitle.dataset.category;
        console.log(`Kategori tıklandı: ${category}`);
        
        // Tüm seçimleri temizle
        this.categoryTitles.forEach(title => {
            title.classList.remove('selected');
        });
        
        // Tıklanan kategoriyi seç
        clickedTitle.classList.add('selected');
        
        // Geçiş animasyonu
        const targetSection = category === 'categories' ? this.categoriesSection : this.manufacturersSection;
        const hideSection = category === 'categories' ? this.manufacturersSection : this.categoriesSection;
        
        if (!targetSection || !hideSection) return;
        
        // Mevcut bölümü gizle
        hideSection.classList.add('fade-out');
        
        setTimeout(() => {
            hideSection.style.display = 'none';
            hideSection.classList.remove('fade-out');
            
            // Yeni bölümü göster
            targetSection.style.display = 'block';
            targetSection.classList.add('fade-in');
            
            setTimeout(() => {
                targetSection.classList.remove('fade-in');
            }, 500);
        }, 400);
    }
    
    // Ürün butonuna tıklama
    handleProductButtonClick(e) {
        if (e) e.preventDefault();
        
        this.productButton.classList.add('clicked');
        
        setTimeout(() => {
            window.location.href = 'urunlerimiz.html';
        }, 300);
        
        setTimeout(() => {
            this.productButton.classList.remove('clicked');
        }, 600);
    }
    
    // İletişim butonuna tıklama
    handleRequestButtonClick(e) {
        if (e) e.preventDefault();
        
        this.requestButton.classList.add('clicked');
        
        setTimeout(() => {
            window.location.href = 'iletisim.html';
        }, 300);
        
        setTimeout(() => {
            this.requestButton.classList.remove('clicked');
        }, 600);
    }
    
    // Kart tıklama efektleri
    handleCardClicks(e) {
        // Marka kartları için delegasyon
        const brandCard = e.target.closest('.brand-card');
        if (brandCard) {
            brandCard.classList.add('clicked');
            
            setTimeout(() => {
                brandCard.classList.remove('clicked');
            }, 300);
        }
        
        // Kategori kartları için delegasyon
        const categoryCard = e.target.closest('.category-card');
        if (categoryCard) {
            categoryCard.classList.add('clicked');
            
            setTimeout(() => {
                categoryCard.classList.remove('clicked');
            }, 300);
        }
        
        // Blog bağlantıları için delegasyon
        const blogLink = e.target.closest('.blog-link');
        if (blogLink) {
            const icon = blogLink.querySelector('i');
            
            if (icon) {
                icon.classList.add('icon-animate');
                
                setTimeout(() => {
                    icon.classList.remove('icon-animate');
                }, 300);
            }
        }
    }
    
    // Form gönderimi
    handleFormSubmit(e) {
        e.preventDefault();
        
        // Form doğrulama
        if (!this.validateForm()) {
            return;
        }
        
        // Form verilerini al
        const formData = new FormData();
        formData.append('name', this.nameInput.value);
        formData.append('company', this.companyInput.value);
        formData.append('phone', this.phoneInput.value);
        formData.append('email', this.emailInput.value);
        
        // Ürün bilgilerini al
        const productRows = document.querySelectorAll('.product-input-row');
        const products = [];
        
        productRows.forEach(row => {
            const productName = row.querySelector('.product-input').value;
            const quantity = row.querySelector('.qty-input').value;
            
            // Aktif durum butonu
            const activeCondition = row.querySelector('.condition-icon.active');
            const condition = activeCondition ? activeCondition.getAttribute('title') : 'Yeni paketlenmiş';
            
            if (productName) {
                products.push({
                    name: productName,
                    quantity: quantity,
                    condition: condition
                });
            }
        });
        
        formData.append('products', JSON.stringify(products));
        
        // Notları ekle
        if (this.notesTextarea) {
            formData.append('notes', this.notesTextarea.value);
        }
        
        // Dosyaları ekle
        this.uploadedFiles.forEach(file => {
            formData.append('files', file);
        });
        
        // Gönder butonunun durumunu güncelle
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<span>Gönderiliyor...</span> <i class="fas fa-spinner fa-spin"></i>';
        
        // Form gönderimi simülasyonu (gerçek uygulamada fetch API ile sunucuya gönderin)
        setTimeout(() => {
            console.log('Form verileri:', Object.fromEntries(formData));
            
            // İşlem başarılı
            this.submitButton.innerHTML = '<span>Başarıyla Gönderildi!</span> <i class="fas fa-check"></i>';
            
            // Formu sıfırla
            setTimeout(() => {
                this.rfqForm.reset();
                this.clearUploadedFiles();
                this.closeRfqModal();
                
                // Başarı mesajı göster
                this.showSuccessMessage();
                
                // Butonu eski haline getir
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = '<span>GÖNDER</span> <i class="fas fa-arrow-right"></i>';
            }, 1500);
        }, 2000);
    }
    
    // Form doğrulama
    validateForm() {
        let isValid = true;
        
        // İsim alanı
        if (!this.nameInput.value.trim()) {
            this.showError(this.nameInput, 'Lütfen adınızı girin');
            isValid = false;
        } else {
            this.hideError(this.nameInput);
        }
        
        // Şirket alanı
        if (!this.companyInput.value.trim()) {
            this.showError(this.companyInput, 'Lütfen şirket adını girin');
            isValid = false;
        } else {
            this.hideError(this.companyInput);
        }
        
        // E-posta alanı
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.emailInput.value.trim() || !emailRegex.test(this.emailInput.value)) {
            this.showError(this.emailInput, 'Lütfen geçerli bir e-posta adresi girin');
            isValid = false;
        } else {
            this.hideError(this.emailInput);
        }
        
        // Telefon alanı (opsiyonel)
        if (this.phoneInput.value.trim()) {
            const phoneRegex = /^[0-9\+\-\s\(\)]{7,20}$/;
            if (!phoneRegex.test(this.phoneInput.value)) {
                this.showError(this.phoneInput, 'Lütfen geçerli bir telefon numarası girin');
                isValid = false;
            } else {
                this.hideError(this.phoneInput);
            }
        }
        
        // Şartlar ve koşullar
        if (!this.termsCheckbox.checked) {
            this.showError(this.termsCheckbox, 'Devam etmek için şartları kabul etmelisiniz');
            isValid = false;
        } else {
            this.hideError(this.termsCheckbox);
        }
        
        return isValid;
    }
    
    // Hata mesajı göster
    showError(input, message) {
        const formGroup = input.closest('.form-group') || input.closest('.terms-checkbox');
        const errorMessage = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }
    
    // Hata mesajını gizle
    hideError(input) {
        const formGroup = input.closest('.form-group') || input.closest('.terms-checkbox');
        const errorMessage = formGroup.querySelector('.error-message');
        
        formGroup.classList.remove('error');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
    
    // Başarı mesajı göster
    showSuccessMessage() {
        // Eğer başarı mesajı zaten mevcutsa, kaldır
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Yeni başarı mesajı oluştur
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <div class="success-content">
                <h3>Talebiniz Başarıyla Gönderildi!</h3>
                <p>En kısa sürede sizinle iletişime geçeceğiz.</p>
            </div>
            <button class="success-close"><i class="fas fa-times"></i></button>
        `;
        
        this.body.appendChild(successMessage);
        
        // Animasyonla göster
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);
        
        // Kapatma butonu
        const closeButton = successMessage.querySelector('.success-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                successMessage.classList.remove('show');
                setTimeout(() => {
                    successMessage.remove();
                }, 300);
            });
        }
        
        // 5 saniye sonra otomatik kapat
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                successMessage.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(successMessage)) {
                        successMessage.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Yeni ürün satırı ekle
    addProductRow() {
        const productTable = document.querySelector('.product-table');
        if (!productTable) return;
        
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
        
        // Yeni satıra event listener'lar ekle
        const conditionIcons = newRow.querySelectorAll('.condition-icon');
        conditionIcons.forEach(icon => {
            if (!icon.classList.contains('remove-row')) {
                icon.addEventListener('click', () => {
                    // Önce tüm aktif iconları temizle
                    conditionIcons.forEach(i => {
                        if (!i.classList.contains('remove-row')) {
                            i.classList.remove('active');
                        }
                    });
                    // Tıklanan iconu aktif yap
                    icon.classList.add('active');
                });
            } else {
                // Satır silme butonu
                icon.addEventListener('click', () => {
                    newRow.classList.add('removing');
                    setTimeout(() => {
                        if (newRow.parentNode) {
                            newRow.parentNode.removeChild(newRow);
                        }
                    }, 300);
                });
            }
        });
        
        // İlk satırı seçili yap
        conditionIcons[0].classList.add('active');
        
        // Yeni eklenen satıra odaklan
        newRow.querySelector('.product-input').focus();
    }
    
    // Drag & Drop işlemleri
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    highlight() {
        this.dropArea.classList.add('highlight');
    }
    
    unhighlight() {
        this.dropArea.classList.remove('highlight');
    }
    
    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        this.handleFiles(files);
    }
    
    handleFiles(files) {
        const fileArray = [...files];
        
        // Dosya sayısı kontrolü (en fazla 5)
        if (this.uploadedFiles.length + fileArray.length > 5) {
            this.showFileError('En fazla 5 dosya yükleyebilirsiniz.');
            return;
        }
        
        // Dosya boyutu kontrolü (en fazla 20MB)
        const oversizedFiles = fileArray.filter(file => file.size > 20 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            this.showFileError('Bazı dosyalar 20MB\'dan büyük.');
            return;
        }
        
        // Dosya türü kontrolü
        const allowedTypes = ['.jpg', '.jpeg', '.JPG', '.png', '.pdf', '.doc', '.docx', '.csv', '.xls', '.xlsx'];
        const invalidFiles = fileArray.filter(file => {
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            return !allowedTypes.includes(ext);
        });
        
        if (invalidFiles.length > 0) {
            this.showFileError('Desteklenmeyen dosya türü.');
            return;
        }
        
        // Geçerli dosyaları ekle
        fileArray.forEach(file => {
            this.uploadedFiles.push(file);
            this.previewFile(file);
        });
        
        // Dosya sayısını güncelle
        this.updateFileCount();
    }
    
    previewFile(file) {
        if (!this.uploadedFilesContainer) return;
        
        const reader = new FileReader();
        const fileDisplay = document.createElement('div');
        fileDisplay.className = 'file-display';
        
        // Dosya türüne göre icon belirle
        let fileIcon = '';
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
            fileIcon = '<i class="fas fa-file-image"></i>';
        } else if (fileExt === 'pdf') {
            fileIcon = '<i class="fas fa-file-pdf"></i>';
        } else if (['doc', 'docx'].includes(fileExt)) {
            fileIcon = '<i class="fas fa-file-word"></i>';
        } else if (['xls', 'xlsx', 'csv'].includes(fileExt)) {
            fileIcon = '<i class="fas fa-file-excel"></i>';
        } else {
            fileIcon = '<i class="fas fa-file"></i>';
        }
        
        fileDisplay.innerHTML = `
            <div class="file-icon">${fileIcon}</div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${this.formatFileSize(file.size)}</div>
            </div>
            <button class="file-remove" data-name="${file.name}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.uploadedFilesContainer.appendChild(fileDisplay);
        
        // Dosya önizleme görüntüsü
        if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'file-preview';
                
                const fileIcon = fileDisplay.querySelector('.file-icon');
                fileIcon.innerHTML = '';
                fileIcon.appendChild(img);
            };
            
            reader.readAsDataURL(file);
        }
        
        // Dosya silme butonu
        const removeButton = fileDisplay.querySelector('.file-remove');
        if (removeButton) {
            removeButton.addEventListener('click', () => {
                const fileName = removeButton.getAttribute('data-name');
                this.removeFile(fileName, fileDisplay);
            });
        }
    }
    
    removeFile(fileName, fileDisplay) {
        // Dosyayı diziden kaldır
        this.uploadedFiles = this.uploadedFiles.filter(file => file.name !== fileName);
        
        // Dosya görüntüsünü kaldır
        if (fileDisplay && fileDisplay.parentNode) {
            fileDisplay.classList.add('removing');
            setTimeout(() => {
                fileDisplay.parentNode.removeChild(fileDisplay);
            }, 300);
        }
        
        // Dosya sayısını güncelle
        this.updateFileCount();
    }
    
    clearUploadedFiles() {
        this.uploadedFiles = [];
        
        if (this.uploadedFilesContainer) {
            this.uploadedFilesContainer.innerHTML = '';
        }
        
        this.updateFileCount();
    }
    
    updateFileCount() {
        const fileCountElement = this.dropArea.querySelector('.file-count');
        if (fileCountElement) {
            fileCountElement.textContent = `${this.uploadedFiles.length} / 5`;
            
            // Maksimum sayıya ulaşıldıysa uyarı ver
            if (this.uploadedFiles.length >= 5) {
                fileCountElement.classList.add('max-reached');
            } else {
                fileCountElement.classList.remove('max-reached');
            }
        }
    }
    
    showFileError(message) {
        // Mevcut hata mesajını kaldır
        const existingError = this.dropArea.querySelector('.file-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Yeni hata mesajı oluştur
        const errorElement = document.createElement('div');
        errorElement.className = 'file-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        this.dropArea.appendChild(errorElement);
        
        // 3 saniye sonra otomatik kaldır
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.classList.add('fade-out');
                setTimeout(() => {
                    if (errorElement.parentNode) {
                        errorElement.parentNode.removeChild(errorElement);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    // AOS kütüphanesi başlat (varsa)
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                disable: 'mobile'
            });
        }
    }
    
    // Sayfa görünürlük durumunu başlat
    initVisibilityState() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // Sayfa tekrar görünür olduğunda
                this.handleVisibilityVisible();
            } else {
                // Sayfa görünmez olduğunda
                this.handleVisibilityHidden();
            }
        });
    }
    
    // Sayfa görünür olduğunda
    handleVisibilityVisible() {
        // Hero içeriğini güncelle
        if (this.heroContent && !this.heroContent.classList.contains('animate-in')) {
            this.heroContent.classList.add('animate-in');
        }
        
        // Animasyonları tekrar başlat
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    // Sayfa görünmez olduğunda
    handleVisibilityHidden() {
        // Opsiyonel: Bazı işlemleri duraklat
    }
}

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    window.klimasunApp = new KlimasunApp();
});

// Sayfa geçişleri için
class PageTransitions {
    constructor() {
        this.isAnimating = false;
        this.links = document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target])');
        
        this.init();
    }
    
    init() {
        // Sayfa geçiş elementi oluştur
        if (!document.querySelector('.page-transition')) {
            const transitionElement = document.createElement('div');
            transitionElement.className = 'page-transition';
            document.body.appendChild(transitionElement);
        }
        
        // Link tıklamalarını dinle
        this.links.forEach(link => {
            link.addEventListener('click', this.handleLinkClick.bind(this));
        });
        
        // Tarayıcı geri/ileri butonları için
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }
    
    handleLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Aynı sayfaya yönlendirme veya # bağlantıları için kontrol
        if (href === window.location.pathname || href.startsWith('#') || link.target === '_blank') {
            return;
        }
        
        e.preventDefault();
        
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const transition = document.querySelector('.page-transition');
        transition.classList.add('active');
        
        setTimeout(() => {
            window.location.href = href;
        }, 600);
    }
    
    handlePopState() {
        const transition = document.querySelector('.page-transition');
        transition.classList.add('active');
        
        setTimeout(() => {
            transition.classList.remove('active');
            this.isAnimating = false;
        }, 600);
    }
}

// Sayfaya ilk giriş animasyonu
class EntryAnimation {
    constructor() {
        this.body = document.body;
        this.heroSection = document.querySelector('.hero-section');
        this.heroContent = document.querySelector('.hero-content');
        
        if (this.heroContent) {
            this.init();
        }
    }
    
    init() {
        // Sayfa ilk kez ziyaret ediliyorsa
        if (!sessionStorage.getItem('visited')) {
            this.playEntryAnimation();
            sessionStorage.setItem('visited', 'true');
        } else {
            // Tekrar ziyarette daha kısa animasyon
            this.playReturnAnimation();
        }
    }
    
    playEntryAnimation() {
        // Hero elementlerini hazırla
        const heroElements = {
            heading: this.heroContent.querySelector('h1'),
            subheading: this.heroContent.querySelector('h2'),
            text: this.heroContent.querySelector('p'),
            buttons: this.heroContent.querySelector('.hero-buttons')
        };
        
        // Elementleri görünmez yap
        Object.values(heroElements).forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
            }
        });
        
        // Animasyon zamanlaması
        setTimeout(() => {
            this.heroContent.classList.add('animate-in');
            
            // Her elementi sırayla göster
            setTimeout(() => {
                if (heroElements.heading) {
                    heroElements.heading.style.opacity = '1';
                    heroElements.heading.style.transform = 'translateY(0)';
                }
            }, 300);
            
            setTimeout(() => {
                if (heroElements.subheading) {
                    heroElements.subheading.style.opacity = '1';
                    heroElements.subheading.style.transform = 'translateY(0)';
                }
            }, 500);
            
            setTimeout(() => {
                if (heroElements.text) {
                    heroElements.text.style.opacity = '1';
                    heroElements.text.style.transform = 'translateY(0)';
                }
            }, 700);
            
            setTimeout(() => {
                if (heroElements.buttons) {
                    heroElements.buttons.style.opacity = '1';
                    heroElements.buttons.style.transform = 'translateY(0)';
                }
            }, 900);
            
        }, 500);
    }
    
    playReturnAnimation() {
        // Daha hızlı animasyon
        setTimeout(() => {
            this.heroContent.classList.add('animate-in');
        }, 200);
    }
}

// Yükleme performansını geliştirme
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Font Yükleme Optimizasyonu
        this.optimizeFonts();
        
        // Resimleri önbelleğe alma
        this.precacheImages();
        
        // JavaScript modüllerini geciktirme
        this.lazyLoadScripts();
    }
    
    optimizeFonts() {
        // Font Display Swap
        const fontStyle = document.createElement('style');
        fontStyle.textContent = `
            @font-face {
                font-family: 'Montserrat';
                font-display: swap;
            }
        `;
        document.head.appendChild(fontStyle);
        
        // Font API kullanımı
        if ('fonts' in document) {
            Promise.all([
                document.fonts.load('400 1em Montserrat'),
                document.fonts.load('500 1em Montserrat'),
                document.fonts.load('600 1em Montserrat'),
                document.fonts.load('700 1em Montserrat')
            ]).then(() => {
                document.documentElement.classList.add('fonts-loaded');
            });
        }
    }
    
    precacheImages() {
        // Önemli resimleri önbelleğe al
        const imagesToPrecache = [
            '../images/anasayfa.png',
            '../images/anasayfa2.jpg',
            '../images/anasayfa3.jpg'
        ];
        
        // Kullanıcı etkileşiminden sonra önbelleğe al
        const precacheAfterInteraction = () => {
            imagesToPrecache.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        };
        
        // Kullanıcı etkileşimini dinle
        ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
            window.addEventListener(event, () => {
                precacheAfterInteraction();
                // Her dinleyiciyi bir kez çalıştır
                ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(e => {
                    window.removeEventListener(e, precacheAfterInteraction);
                });
            }, { once: true, passive: true });
        });
    }
    
    lazyLoadScripts() {
        // Kritik olmayan scriptleri geciktirerek yükle
        const lazyScripts = document.querySelectorAll('script[data-src]');
        
        if (lazyScripts.length === 0) return;
        
        const loadLazyScript = (script) => {
            script.src = script.dataset.src;
            script.removeAttribute('data-src');
        };
        
        if ('IntersectionObserver' in window) {
            const scriptObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadLazyScript(entry.target);
                        scriptObserver.unobserve(entry.target);
                    }
                });
            });
            
            lazyScripts.forEach(script => {
                scriptObserver.observe(script);
            });
        } else {
            // Fallback: Sayfa yüklendikten 3 saniye sonra yükle
            setTimeout(() => {
                lazyScripts.forEach(loadLazyScript);
            }, 3000);
        }
    }
}

// Dokunmatik Cihaz Kontrolü ve Optimizasyonları
class TouchDeviceOptimizer {
    constructor() {
        this.isTouchDevice = this.checkTouchDevice();
        this.init();
    }
    
    checkTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    }
    
    init() {
        if (this.isTouchDevice) {
            document.documentElement.classList.add('touch-device');
            this.optimizeForTouch();
        } else {
            document.documentElement.classList.add('no-touch');
            this.enhanceForDesktop();
        }
    }
    
    optimizeForTouch() {
        // Hover durumlarını iyileştir
        this.improveTouchInteractions();
        
        // Input elementlerini optimize et
        this.optimizeInputs();
        
        // Scroll performansını artır
        this.improveScrolling();
    }
    
    improveTouchInteractions() {
        // Tüm tıklanabilir elementlere dokunma stillerini uygula
        const clickables = document.querySelectorAll('a, button, .card, .btn, [role="button"]');
        
        clickables.forEach(element => {
            // Aktif durumları iyileştir
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 100);
            }, { passive: true });
        });
    }
    
    optimizeInputs() {
        // Input elementlerini mobil için optimize et
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // iOS zoom sorununu önlemek için font boyutunu ayarla
            if (input.type !== 'checkbox' && input.type !== 'radio') {
                input.style.fontSize = '16px';
            }
            
            // Dokunma alanını genişlet
            const parent = input.parentElement;
            if (parent) {
                parent.style.minHeight = '44px';
            }
        });
    }
    
    improveScrolling() {
        // Sayfa scroll performansını artır
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Scroll eden elementleri optimize et
        const scrollContainers = document.querySelectorAll('.scroll-container');
        
        scrollContainers.forEach(container => {
            container.style.webkitOverflowScrolling = 'touch';
            container.style.overscrollBehavior = 'contain';
        });
    }
    
    enhanceForDesktop() {
        // Masaüstü için ek etkileşimler ekle
        this.addHoverEffects();
    }
    
    addHoverEffects() {
        // Kartyarı için gelişmiş hover efektleri
        const cards = document.querySelectorAll('.category-card, .brand-card, .feature-card, .blog-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover-enhanced');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover-enhanced');
            });
        });
    }
}

// Sayfa yüklendiğinde tüm geliştirmeleri başlat
document.addEventListener('DOMContentLoaded', () => {
    // Ana uygulamayı başlat
    window.klimasunApp = new KlimasunApp();
    
    // Sayfa geçişlerini etkinleştir
    new PageTransitions();
    
    // Giriş animasyonunu başlat
    new EntryAnimation();
    
    // Performans optimizasyonlarını uygula
    new PerformanceOptimizer();
    
    // Dokunmatik cihaz optimizasyonlarını uygula
    new TouchDeviceOptimizer();
});