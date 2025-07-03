// Geliştirilmiş Header JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    const searchBox = document.querySelector('.search-box');
    const navLinks = document.querySelectorAll('.nav-link');
    const logo = document.querySelector('.logo img');
    const talepButton = document.querySelector('.talep-button');
    const megaMenuLinks = document.querySelectorAll('.has-mega-menu');
    
    // Konsola bilgi yazdırarak debugging kolaylığı sağlayalım
    console.log('Header JS yüklendi');

    // Sayfa yüklendiğinde aktif menü öğesini belirle
    setActiveNavLink();

    // Sayfa kaydırma efekti - Sadece bir yöntem kullanıyoruz (class-based approach)
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.scrollY;
        
        // Scrolled class'ı ekleyip çıkarma
        if (currentScrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Header'ı göster/gizle (sadece class ile yapıyoruz, manuel style değiştirmiyoruz)
        if (currentScrollTop > lastScrollTop && currentScrollTop > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = currentScrollTop;
    });

    // Mobil menü toggle
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Dışarı tıklama işlemini engelle
            
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    } else {
        console.warn('Mobil menü butonu bulunamadı');
    }

    // Menü dışına tıklandığında menüyü kapat
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.mobile-menu-button')) {
            closeMenu();
        }
    });

    // Mobil menüde link tıklandığında menüyü kapat
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Mega menü linki ise ve mobilse, default davranışı engelle
                if (link.parentElement.classList.contains('has-mega-menu') && window.innerWidth <= 768) {
                    e.preventDefault();
                    // Zaten açıksa ve tekrar tıklandıysa, yönlendir
                    const megaMenu = link.nextElementSibling;
                    if (megaMenu && megaMenu.classList.contains('show')) {
                        window.location.href = link.getAttribute('href');
                    } else {
                        // Mega menüyü aç/kapat
                        toggleMegaMenu(link.parentElement);
                    }
                    return;
                }
                
                // Normal link ve mobilde ise menüyü kapat
                if (window.innerWidth <= 768 && !link.parentElement.classList.contains('has-mega-menu')) {
                    closeMenu();
                }
            });
        });
    }

    // Arama kutusu işlevselliği
    if (searchBox) {
        searchBox.addEventListener('click', function() {
            toggleSearchBox();
        });
    }

    // Pencere boyutunu değiştirme işlevselliği
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Masaüstü moda geçildiğinde, açık menüyü kapat
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.style.display = '';
                navMenu.classList.remove('active');
                updateMobileMenuIcon(false);
            }
            
            // Mega menü hover eventlerini aktifleştir
            setupMegaMenuHover(true);
        } else {
            // Mobil moda geçildiğinde hover eventleri devre dışı bırak
            setupMegaMenuHover(false);
        }
    });

    // ESC tuşuna basıldığında menüyü ve açık modları kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Menü açıksa kapat
            if (navMenu && navMenu.classList.contains('active')) {
                closeMenu();
            }
            
            // Açık mega menü varsa kapat
            document.querySelectorAll('.mega-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
            
            // Açık arama var mı kontrol et
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer) {
                searchContainer.classList.remove('show');
                setTimeout(() => {
                    searchContainer.remove();
                }, 300);
            }
        }
    });

    // Logo hover animasyonu
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }

    // Mega menü işlevselliği
    setupMegaMenuHover(window.innerWidth > 768);
    setupMegaMenuClick();

    // Aktif sayfa için menü öğesini işaretle
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (currentPath.includes(href) || 
                (currentPath.endsWith('/') && href === 'anasayfa.html'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Menu açma fonksiyonu
    function openMenu() {
        console.log('Menü açılıyor');
        if (!navMenu) return;
        
        navMenu.classList.add('active');
        navMenu.style.display = 'block';
        updateMobileMenuIcon(true);

        // Menü açılma animasyonu
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    // Menü kapatma fonksiyonu
    function closeMenu() {
        console.log('Menü kapanıyor');
        if (!navMenu) return;
        
        const menuItems = navMenu.querySelectorAll('li');
        
        // Tüm açık mega menüleri de kapat
        document.querySelectorAll('.mega-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
        
        // Önce menü öğelerini kapat
        menuItems.forEach((item, index) => {
            const delay = (menuItems.length - index - 1) * 50;
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
            }, delay);
        });

        // Sonra menüyü kapat
        setTimeout(() => {
            navMenu.classList.remove('active');
            updateMobileMenuIcon(false);
            
            // Resetleme
            menuItems.forEach(item => {
                setTimeout(() => {
                    item.style.opacity = '';
                    item.style.transform = '';
                    item.style.transition = '';
                }, 300);
            });
        }, menuItems.length * 50 + 100);
    }

    // Mobil menü ikonunu güncelle
    function updateMobileMenuIcon(isOpen) {
        if (!mobileMenuButton) return;
        
        const icon = mobileMenuButton.querySelector('i');
        if (!icon) return;
        
        if (isOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            mobileMenuButton.classList.add('active');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            mobileMenuButton.classList.remove('active');
        }
    }

    // Mega menü hover işlevselliği
    function setupMegaMenuHover(enable) {
        megaMenuLinks.forEach(link => {
            const megaMenu = link.querySelector('.mega-menu');
            
            // Önce tüm event listener'ları kaldır (varsa)
            link.removeEventListener('mouseenter', showMegaMenu);
            link.removeEventListener('mouseleave', hideMegaMenu);
            
            // Masaüstü modunda hover eventlerini ekle
            if (enable && megaMenu) {
                link.addEventListener('mouseenter', showMegaMenu);
                link.addEventListener('mouseleave', hideMegaMenu);
            }
        });
    }
    
    function showMegaMenu() {
        const megaMenu = this.querySelector('.mega-menu');
        if (megaMenu) {
            megaMenu.classList.add('show');
        }
    }
    
    function hideMegaMenu() {
        const megaMenu = this.querySelector('.mega-menu');
        if (megaMenu) {
            megaMenu.classList.remove('show');
        }
    }

    // Mega menü tıklama işlevselliği (mobil için)
    function setupMegaMenuClick() {
        megaMenuLinks.forEach(link => {
            const navLink = link.querySelector('.nav-link');
            
            if (navLink) {
                navLink.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        toggleMegaMenu(link);
                    }
                });
            }
        });
    }
    
    function toggleMegaMenu(parentLink) {
        const megaMenu = parentLink.querySelector('.mega-menu');
        if (!megaMenu) return;
        
        const isExpanded = megaMenu.classList.contains('show');
        
        // Önce tüm diğer açık mega menüleri kapat
        document.querySelectorAll('.mega-menu.show').forEach(menu => {
            if (menu !== megaMenu) {
                menu.classList.remove('show');
            }
        });
        
        // Seçilen mega menüyü aç/kapat
        megaMenu.classList.toggle('show');
        
        // İkon değişimi (varsa)
        const icon = parentLink.querySelector('.nav-link i');
        if (icon) {
            if (isExpanded) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        }
    }

    // Arama kutusu toggle fonksiyonu
    function toggleSearchBox() {
        // Zaten açık bir arama varsa, işlem yapma
        if (document.querySelector('.search-container')) {
            console.log('Arama zaten açık');
            return;
        }
        
        console.log('Arama açılıyor');
        
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        const searchForm = document.createElement('form');
        searchForm.className = 'search-form';
        searchForm.setAttribute('role', 'search');
        
        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.className = 'search-input';
        searchInput.placeholder = 'Arama yapın...';
        searchInput.setAttribute('aria-label', 'Ara');
        
        const searchButton = document.createElement('button');
        searchButton.type = 'submit';
        searchButton.className = 'search-button';
        
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search';
        
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'search-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Aramayı kapat');
        
        searchButton.appendChild(searchIcon);
        searchForm.appendChild(searchInput);
        searchForm.appendChild(searchButton);
        searchForm.appendChild(closeButton);
        searchContainer.appendChild(searchForm);
        
        document.body.appendChild(searchContainer);
        
        // Force reflow & sonra animasyonu başlat
        searchContainer.offsetHeight;
        searchContainer.classList.add('show');
        setTimeout(() => {
            searchInput.focus();
        }, 100);
        
        // Arama fonksiyonu
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log('Aranan terim:', searchTerm);
                
                const searchMessage = document.createElement('div');
                searchMessage.className = 'search-message';
                searchMessage.textContent = `"${searchTerm}" için arama sonuçları yükleniyor...`;
                searchContainer.appendChild(searchMessage);
                
                setTimeout(() => {
                    closeSearchBox(searchContainer);
                }, 2000);
            }
        });
        
        // Kapatma butonu
        closeButton.addEventListener('click', function() {
            closeSearchBox(searchContainer);
        });
        
        // Dışarı tıklama ile kapat
        searchContainer.addEventListener('click', function(e) {
            if (e.target === searchContainer) {
                closeSearchBox(searchContainer);
            }
        });
    }
    
    function closeSearchBox(container) {
        if (!container) {
            container = document.querySelector('.search-container');
            if (!container) return;
        }
        
        console.log('Arama kapanıyor');
        container.classList.remove('show');
        setTimeout(() => {
            container.remove();
        }, 300);
    }

    // Talep butonu efekti
    if (talepButton) {
        talepButton.addEventListener('mouseenter', function() {
            this.classList.add('animate-pulse');
        });
        
        talepButton.addEventListener('mouseleave', function() {
            this.classList.remove('animate-pulse');
        });
    }
});