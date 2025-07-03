$(document).ready(function() {
    // Adalar için hover efekti
    $('.island').hover(
        function() {
            $(this).addClass('island-hover');
            // Konfeti efekti
            createConfetti(this, 5);
        },
        function() {
            $(this).removeClass('island-hover');
        }
    );

    // Sub-locations için açılır kapanır menu
    $('.island-title').click(function() {
        const island = $(this).parent();
        const subLocations = island.find('.sub-locations');
        
        if (subLocations.length) {
            // Açık olan diğer alt menüleri kapat
            $('.island.expanded').not(island).removeClass('expanded');
            $('.sub-locations').not(subLocations).slideUp(300);
            
            island.toggleClass('expanded');
            
            if (island.hasClass('expanded')) {
                subLocations.slideDown(300);
                // Daha fazla konfeti
                createConfetti(island[0], 15);
            } else {
                subLocations.slideUp(300);
            }
        }
    });

    // Zoom kontrolleri
    let currentZoom = 1;
    let isDragging = false;
    let lastPosition = { x: 0, y: 0 };
    let containerPosition = { x: 0, y: 0 };
    
    // Zoom In butonu
    $('#zoom-in').click(function() {
        if (currentZoom < 1.5) {
            currentZoom += 0.1;
            updateMapTransform();
        }
    });
    
    // Zoom Out butonu
    $('#zoom-out').click(function() {
        if (currentZoom > 0.6) {
            currentZoom -= 0.1;
            updateMapTransform();
        }
    });
    
    // Reset View butonu
    $('#reset-view').click(function() {
        currentZoom = 1;
        containerPosition = { x: 0, y: 0 };
        updateMapTransform();
    });
    
    // Haritayı sürüklemek için
    $('.sitemap-container').on('mousedown', function(e) {
        isDragging = true;
        lastPosition = { x: e.clientX, y: e.clientY };
        $(this).css('cursor', 'grabbing');
    });
    
    $(document).on('mousemove', function(e) {
        if (isDragging) {
            const deltaX = e.clientX - lastPosition.x;
            const deltaY = e.clientY - lastPosition.y;
            
            containerPosition.x += deltaX;
            containerPosition.y += deltaY;
            
            lastPosition = { x: e.clientX, y: e.clientY };
            updateMapTransform();
        }
    });
    
    $(document).on('mouseup', function() {
        isDragging = false;
        $('.sitemap-container').css('cursor', 'grab');
    });
    
    // Harita transformunu güncelleme fonksiyonu
    function updateMapTransform() {
        $('.sitemap-container').css('transform', 
            `scale(${currentZoom}) translate(${containerPosition.x / currentZoom}px, ${containerPosition.y / currentZoom}px)`
        );
    }
    
    // Başlangıçta alt menüleri gizle
    $('.sub-locations').hide();
    
    // Rastgele bazı adalara "yeni" etiketi ekle
    const allIslands = $('.island').get();
    const randomIslands = $(allIslands).get().sort(() => 0.5 - Math.random()).slice(0, 2);
    $(randomIslands).addClass('new-location');

    // Aktif sayfayı işaretle
    markActivePage();
    
    // Pusula animasyonu
    animateCompass();
    
    // Okyanus dalgaları animasyonu
    animateOcean();
    
    // Deniz yolları animasyonu
    animateSeaRoutes();
    
    // Mobil için dokunmatik olaylar
    setupTouchEvents();
    
    // Easter egg: Başlığa tıklandığında konfeti yağmuru
    $('.map-header h1').on('click', function() {
        createConfettiShower();
        $(this).addClass('rainbow-text');
        
        setTimeout(() => {
            $(this).removeClass('rainbow-text');
        }, 5000);
    });
});

// Aktif sayfayı işaretleme fonksiyonu
function markActivePage() {
    // Gerçek uygulamada window.location.pathname ile hangi
    // sayfada olduğunu tespit edebilirsiniz
    // Örnek olarak ana sayfayı aktif gösterelim:
    $('.home-island').addClass('current-location');
    
    // URL'den aktif sayfayı belirleme
    const currentPage = window.location.pathname.split('/').pop() || 'anasayfa.html';
    
    $('.island').each(function() {
        const islandLink = $(this).find('a').attr('href');
        if (islandLink === currentPage) {
            $(this).addClass('current-location');
        }
    });
}

// Konfeti efekti
function createConfetti(element, particleCount) {
    const colors = ['#2ABCFF', '#56c8ff', '#0088cc', '#FFC107', '#FF5722'];
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4;
        
        particle.classList.add('confetti-particle');
        particle.style.cssText = `
            position: fixed;
            top: ${rect.top + rect.height / 2}px;
            left: ${rect.left + rect.width / 2}px;
            width: ${size}px;
            height: ${size}px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            z-index: 1000;
        `;
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 50 + 30;
        const xVel = Math.cos(angle) * velocity;
        const yVel = Math.sin(angle) * velocity;
        const rotation = Math.random() * 360;
        
        particle.animate(
            [
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${xVel}px, ${yVel}px) rotate(${rotation}deg)`, opacity: 0 }
            ],
            {
                duration: Math.random() * 600 + 400,
                easing: 'cubic-bezier(0,0,0.2,1)'
            }
        );
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Büyük konfeti yağmuru
function createConfettiShower() {
    const colors = ['#2ABCFF', '#56c8ff', '#0088cc', '#FFC107', '#FF5722', '#4CAF50', '#9C27B0'];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const size = Math.random() * 12 + 6;
            const shape = Math.random() > 0.5 ? 'square' : 'circle';
            
            particle.classList.add('confetti-particle');
            particle.style.cssText = `
                position: fixed;
                top: -20px;
                left: ${Math.random() * window.innerWidth}px;
                width: ${size}px;
                height: ${shape === 'circle' ? size : Math.random() * 12 + 4}px;
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${shape === 'circle' ? '50%' : '0'};
                pointer-events: none;
                z-index: 1000;
            `;
            
            const duration = Math.random() * 3000 + 2000;
            const xDistance = (Math.random() - 0.5) * 200;
            const yDistance = window.innerHeight + 100;
            
            particle.animate(
                [
                    { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                    { transform: `translate(${xDistance}px, ${yDistance}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
                ],
                {
                    duration: duration,
                    easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
                }
            );
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, duration);
        }, Math.random() * 1000);
    }
}

// Pusula animasyonu
function animateCompass() {
    const compass = document.querySelector('.compass');
    let rotation = 0;
    
    setInterval(() => {
        rotation += 0.2;
        if (compass) {
            compass.style.transform = `rotate(${rotation}deg)`;
        }
    }, 50);
}

// Okyanus dalgaları animasyonu
function animateOcean() {
    const ocean = document.querySelector('.ocean-waves');
    let wavePosition = 0;
    
    setInterval(() => {
        wavePosition -= 0.5;
        if (ocean) {
            ocean.style.backgroundPosition = `${wavePosition}px 0`;
        }
    }, 50);
}

// Deniz yolları animasyonu
function animateSeaRoutes() {
    const routes = document.querySelectorAll('.route');
    
    routes.forEach(route => {
        // Her 10 saniyede bir rastgele bir deniz yolunda parçacık oluştur
        setInterval(() => {
            const particle = document.createElement('div');
            particle.classList.add('route-particle');
            
            particle.style.cssText = `
                position: absolute;
                top: -2px;
                left: 0;
                width: 10px;
                height: 7px;
                background: rgba(42, 188, 255, 0.7);
                border-radius: 4px;
                pointer-events: none;
            `;
            
            route.appendChild(particle);
            
            particle.animate(
                [
                    { left: '0%', opacity: 0 },
                    { left: '10%', opacity: 1 },
                    { left: '90%', opacity: 1 },
                    { left: '100%', opacity: 0 }
                ],
                {
                    duration: 3000,
                    easing: 'linear'
                }
            );
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }, Math.random() * 5000 + 3000);
    });
}

// Mobil için dokunmatik olaylar
function setupTouchEvents() {
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;
    let containerPosition = { x: 0, y: 0 };
    let currentZoom = 1;
    
    // Dokunma başlangıcı
    $('.sitemap-container').on('touchstart', function(e) {
        const touch = e.originalEvent.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isDragging = true;
    });
    
    // Dokunma hareketi
    $('.sitemap-container').on('touchmove', function(e) {
        if (!isDragging) return;
        
        const touch = e.originalEvent.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        containerPosition.x += deltaX;
        containerPosition.y += deltaY;
        
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        
        $(this).css('transform', 
            `scale(${currentZoom}) translate(${containerPosition.x / currentZoom}px, ${containerPosition.y / currentZoom}px)`
        );
        
        // Sayfanın kaymasını engelle
        e.preventDefault();
    });
    
    // Dokunma bitişi
    $('.sitemap-container').on('touchend', function() {
        isDragging = false;
    });
    
    // Pinch to zoom (iki parmak zoom)
    let initialPinchDistance = 0;
    
    $('.sitemap-container').on('touchstart', function(e) {
        if (e.originalEvent.touches.length === 2) {
            initialPinchDistance = calculatePinchDistance(e.originalEvent.touches);
        }
    });
    
    $('.sitemap-container').on('touchmove', function(e) {
        if (e.originalEvent.touches.length === 2) {
            const currentPinchDistance = calculatePinchDistance(e.originalEvent.touches);
            const pinchDelta = currentPinchDistance - initialPinchDistance;
            
            if (Math.abs(pinchDelta) > 10) {
                // Zoom faktörünü ayarla
                let zoomDelta = pinchDelta * 0.005;
                currentZoom = Math.max(0.6, Math.min(1.5, currentZoom + zoomDelta));
                
                $(this).css('transform', 
                    `scale(${currentZoom}) translate(${containerPosition.x / currentZoom}px, ${containerPosition.y / currentZoom}px)`
                );
                
                initialPinchDistance = currentPinchDistance;
                e.preventDefault();
            }
        }
    });
    
    // İki parmak arasındaki mesafeyi hesapla
    function calculatePinchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// Adaları ve deniz yollarını dinamik olarak oluştur
function generateIslandsAndRoutes() {
    const continent = document.querySelector('.continent');
    const categories = [
        { id: 'home', name: 'Ana Sayfa', icon: 'fa-home', link: 'anasayfa.html', position: { x: 50, y: 50 } },
        { id: 'products', name: 'Ürünlerimiz', icon: 'fa-box', link: 'urunlerimiz.html', position: { x: 20, y: 30 } },
        { id: 'manufacturers', name: 'Üreticiler', icon: 'fa-industry', link: 'ureticiler.html', position: { x: 80, y: 25 } },
        { id: 'about', name: 'Hakkımızda', icon: 'fa-info-circle', link: 'hakkimizda.html', position: { x: 25, y: 70 } },
        { id: 'contact', name: 'İletişim', icon: 'fa-envelope', link: 'iletisim.html', position: { x: 75, y: 75 } },
        { id: 'blog', name: 'Blog', icon: 'fa-blog', link: 'blog.html', position: { x: 25, y: 35 } },
        { id: 'others', name: 'Diğer Sayfalar', icon: 'fa-file-alt', link: '#', position: { x: 80, y: 60 } }
    ];
    
    const subcategories = {
        'products': [
            { name: 'Endüstriyel PC & PG', icon: 'fa-desktop', link: '#' },
            { name: 'PLC Ekipmanları', icon: 'fa-wrench', link: '#' },
            { name: 'Sürücü Teknolojileri', icon: 'fa-cog', link: '#' },
            { name: 'Motor Enkoder', icon: 'fa-sync', link: '#' }
        ],
        'manufacturers': [
            { name: 'Allen Bradley', icon: 'fa-building', link: 'allenbradley.html' },
            { name: 'Siemens', icon: 'fa-building', link: 'siemens.html' },
            { name: 'Lenze', icon: 'fa-building', link: 'lenze.html' },
            { name: 'Schneider Electric', icon: 'fa-building', link: 'schneiderelectrics.html' },
            { name: 'Mitsubishi Electric', icon: 'fa-building', link: 'mitsibushielectric.html' },
            { name: 'Indramat', icon: 'fa-building', link: 'indramat.html' }
        ],
        'others': [
            { name: 'Sıkça Sorulan Sorular', icon: 'fa-question-circle', link: 'faq.html' },
            { name: 'Gizlilik Politikası', icon: 'fa-shield-alt', link: 'privacy.html' },
            { name: 'Kullanım Koşulları', icon: 'fa-file-contract', link: 'terms.html' }
        ]
    };
    
    // İlk önce ana kıtayı temizle
    continent.innerHTML = `
        <div class="continent-title">
            <i class="fas fa-globe-europe"></i>
            <span>Klimasun Dünyası</span>
        </div>
        <div class="sea-routes"></div>
    `;
    
    const seaRoutes = continent.querySelector('.sea-routes');
    
    // Adaları oluştur
    categories.forEach(category => {
        // Ana ada elementini oluştur
        const island = document.createElement('div');
        island.classList.add('island', `${category.id}-island`);
        island.style.left = `${category.position.x}%`;
        island.style.top = `${category.position.y}%`;
        
        // Ada içeriğini oluştur
        island.innerHTML = `
            <div class="island-title">
                <i class="fas ${category.icon}"></i>
                <a href="${category.link}">${category.name}</a>
            </div>
            <div class="location-marker"></div>
        `;
        
        // Alt kategorileri varsa ekle
        if (subcategories[category.id]) {
            const subLocations = document.createElement('div');
            subLocations.classList.add('sub-locations');
            
            let subList = '<ul>';
            subcategories[category.id].forEach(sub => {
                subList += `
                    <li>
                        <i class="fas ${sub.icon}"></i>
                        <a href="${sub.link}">${sub.name}</a>
                    </li>
                `;
            });
            subList += '</ul>';
            
            subLocations.innerHTML = subList;
            island.appendChild(subLocations);
        }
        
        // Adayı kıtaya ekle
        continent.appendChild(island);
        
        // Eğer ana sayfa değilse, ana sayfa ile arasında deniz yolu oluştur
        if (category.id !== 'home') {
            const route = document.createElement('div');
            route.classList.add('route', `home-${category.id}`);
            
            // Yolun açısını ve uzunluğunu hesapla
            const angle = Math.atan2(
                category.position.y - 50,
                category.position.x - 50
            ) * (180 / Math.PI);
            
            const distance = Math.sqrt(
                Math.pow(category.position.x - 50, 2) +
                Math.pow(category.position.y - 50, 2)
            );
            
            route.style.width = `${distance * 0.9}%`;
            route.style.top = '50%';
            route.style.left = '50%';
            route.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
            
            seaRoutes.appendChild(route);
        }
    });
}

// Harita üzerinde kaybolmuş hazine sandığı gizle
function hideHiddenTreasure() {
    const treasure = document.createElement('div');
    treasure.classList.add('hidden-treasure');
    treasure.innerHTML = '<i class="fas fa-treasure-chest"></i>';
    
    // Rastgele bir konum seç
    const randomX = Math.floor(Math.random() * 80) + 10;
    const randomY = Math.floor(Math.random() * 80) + 10;
    
    treasure.style.cssText = `
        position: absolute;
        top: ${randomY}%;
        left: ${randomX}%;
        width: 30px;
        height: 30px;
        opacity: 0.1;
        cursor: pointer;
        z-index: 1;
        transition: all 0.3s ease;
    `;
    
    // Hazine sandığına tıklandığında konfeti patlaması
    treasure.addEventListener('click', function() {
        createConfettiShower();
        
        // Gizli mesajı göster
        const message = document.createElement('div');
        message.classList.add('treasure-message');
        message.innerHTML = 'Tebrikler! Gizli hazineyi buldunuz!';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 30px rgba(255, 193, 7, 0.8);
            z-index: 1000;
            animation: treasure-reveal 1s ease;
        `;
        
        document.body.appendChild(message);
        
        // Bir süre sonra mesajı kaldır
        setTimeout(() => {
            message.remove();
        }, 3000);
        
        // Hazineyi kaldır
        this.remove();
    });
    
    document.querySelector('.continent').appendChild(treasure);
}

// Yeni ziyaretçiler için karşılama turu
function welcomeTour() {
    // LocalStorage'da ziyaretçinin daha önce gelip gelmediğini kontrol et
    if (!localStorage.getItem('sitemap_visited')) {
        // İlk kez ziyaret eden kullanıcıya özel mesaj göster
        const welcomeMessage = document.createElement('div');
        welcomeMessage.classList.add('welcome-message');
        welcomeMessage.innerHTML = `
            <div class="welcome-title">
                <i class="fas fa-map-marked-alt"></i>
                Klimasun Keşif Haritasına Hoş Geldiniz!
            </div>
            <p>Bu interaktif harita ile sitemizin tüm bölümlerini keşfedebilirsiniz.</p>
            <ul>
                <li>Adaların üzerine tıklayarak alt kategorileri görebilirsiniz.</li>
                <li>Sol üstteki butonlarla haritayı yakınlaştırıp uzaklaştırabilirsiniz.</li>
                <li>Fare ile sürükleyerek haritada gezinebilirsiniz.</li>
            </ul>
            <button id="start-tour">Keşfe Başla</button>
            <button id="skip-tour">Geç</button>
        `;
        
        welcomeMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            max-width: 400px;
            width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(welcomeMessage);
        
        // Tur başlatma butonuna tıklandığında
        document.getElementById('start-tour').addEventListener('click', function() {
            welcomeMessage.remove();
            startGuidedTour();
        });
        
        // Geç butonuna tıklandığında
        document.getElementById('skip-tour').addEventListener('click', function() {
            welcomeMessage.remove();
        });
        
        // Bu kullanıcının artık ziyaret ettiğini kaydet
        localStorage.setItem('sitemap_visited', 'true');
    }
}

// Rehberli tur
function startGuidedTour() {
    const tourSteps = [
        { 
            element: '.home-island', 
            title: 'Ana Sayfa', 
            message: 'Sitenin giriş noktası burası.' 
        },
        { 
            element: '.products-island', 
            title: 'Ürünlerimiz', 
            message: 'Tüm ürün kategorilerimizi burada bulabilirsiniz.' 
        },
        { 
            element: '.manufacturers-island', 
            title: 'Üreticiler', 
            message: 'Çalıştığımız markalar ve üreticileri keşfedin.' 
        },
        { 
            element: '.map-controls', 
            title: 'Harita Kontrolleri', 
            message: 'Bu butonlarla haritayı yakınlaştırabilir ve sıfırlayabilirsiniz.' 
        }
    ];
    
    let currentStep = 0;
    
    function showTourStep() {
        if (currentStep >= tourSteps.length) {
            // Tur tamamlandı
            const completionMessage = document.createElement('div');
            completionMessage.innerHTML = `
                <div class="tour-complete">
                    <i class="fas fa-check-circle"></i>
                    <h3>Keşif Turu Tamamlandı!</h3>
                    <p>Artık haritayı daha iyi tanıyorsunuz. Keşfe devam edin!</p>
                    <button id="end-tour">Tamam</button>
                </div>
            `;
            completionMessage.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                text-align: center;
            `;
            
            document.body.appendChild(completionMessage);
            
            document.getElementById('end-tour').addEventListener('click', function() {
                completionMessage.remove();
            });
            
            return;
        }
        
        const step = tourSteps[currentStep];
        const element = document.querySelector(step.element);
        
        // Eğer element varsa
        if (element) {
            // Vurgulayıcı oluştur
            const highlight = document.createElement('div');
            highlight.classList.add('tour-highlight');
            highlight.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: inherit;
                box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.6);
                z-index: 999;
                pointer-events: none;
            `;
            
            // Element pozisyonunu ayarla
            element.style.position = 'relative';
            element.style.zIndex = '1000';
            element.appendChild(highlight);
            
            // Açıklama kutusunu oluştur
            const tooltip = document.createElement('div');
            tooltip.classList.add('tour-tooltip');
            tooltip.innerHTML = `
                <div class="tooltip-title">${step.title}</div>
                <div class="tooltip-content">${step.message}</div>
                <div class="tooltip-controls">
                    ${currentStep > 0 ? '<button id="prev-step">Geri</button>' : ''}
                    <button id="next-step">${currentStep < tourSteps.length - 1 ? 'İleri' : 'Bitir'}</button>
                </div>
            `;
            
            // Tooltip pozisyonunu ayarla
            const elementRect = element.getBoundingClientRect();
            tooltip.style.cssText = `
                position: absolute;
                top: ${elementRect.height + 10}px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                z-index: 1001;
                width: 250px;
                text-align: center;
            `;
            
            element.appendChild(tooltip);
            
            // İleri düğmesine tıklandığında
            document.getElementById('next-step').addEventListener('click', function() {
                // Önceki adımın vurgusunu ve açıklamasını kaldır
                element.removeChild(highlight);
                element.removeChild(tooltip);
                element.style.zIndex = '';
                
                currentStep++;
                showTourStep();
            });
            
            // Geri düğmesi varsa
            if (currentStep > 0) {
                document.getElementById('prev-step').addEventListener('click', function() {
                    // Önceki adımın vurgusunu ve açıklamasını kaldır
                    element.removeChild(highlight);
                    element.removeChild(tooltip);
                    element.style.zIndex = '';
                    
                    currentStep--;
                    showTourStep();
                });
            }
        } else {
            // Element bulunamadıysa, sonraki adıma geç
            currentStep++;
            showTourStep();
        }
    }
    
    // Turu başlat
    showTourStep();
}