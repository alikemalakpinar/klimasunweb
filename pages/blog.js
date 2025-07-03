// Blog JavaScript - İyileştirilmiş Versiyon
document.addEventListener('DOMContentLoaded', () => {
    // Sayfalama fonksiyonları
    initPagination();
    
    // Beğeni butonları için olay dinleyiciler
    initLikeButtons();
    
    // Paylaşım butonları için olay dinleyiciler
    initShareButtons();
    
    // Modal işlemleri
    initModal();
    
    // Animasyonlu giriş efekti
    animateEntrance();
    
    // Newsletter form işlemleri
    initNewsletterForm();
});

// Sayfalama işlevselliği
function initPagination() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const articleGrid = document.querySelector('.article-grid');
    const pageIndicator = document.querySelector('.page-indicator');
    
    if (prevBtn && nextBtn && articleGrid) {
        let currentPage = 1;
        const articlesPerPage = 3;
        const totalArticles = articleGrid.children.length;
        const totalPages = Math.ceil(totalArticles / articlesPerPage);
        
        // ARIA etiketlerini ekle
        prevBtn.setAttribute('aria-label', 'Önceki sayfa');
        nextBtn.setAttribute('aria-label', 'Sonraki sayfa');
        
        function updateArticlesVisibility() {
            const start = (currentPage - 1) * articlesPerPage;
            const end = start + articlesPerPage;

            // Tüm makaleleri gizle ve ARIA özelliklerini güncelle
            Array.from(articleGrid.children).forEach((article, index) => {
                const isVisible = (index >= start && index < end);
                article.style.display = isVisible ? 'block' : 'none';
                article.setAttribute('aria-hidden', !isVisible);
                
                // Görünür makaleler için animasyon ekle
                if (isVisible) {
                    article.classList.add('animate-in');
                    // Animasyonu sıfırla
                    setTimeout(() => {
                        article.classList.remove('animate-in');
                    }, 500);
                }
            });

            // Buton durumlarını güncelle
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
            prevBtn.setAttribute('aria-disabled', currentPage === 1);
            nextBtn.setAttribute('aria-disabled', currentPage === totalPages);

            // Buton stillerini güncelle
            prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
            nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
            
            // Sayfa göstergesini güncelle
            if (pageIndicator) {
                pageIndicator.textContent = `${currentPage} / ${totalPages}`;
                pageIndicator.setAttribute('aria-label', `Sayfa ${currentPage} / ${totalPages}`);
            }
        }

        // Önceki sayfa butonu için olay dinleyici
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateArticlesVisibility();
                
                // Ekran okuyucuları için bildirim
                announcePageChange();
            }
        });

        // Sonraki sayfa butonu için olay dinleyici
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateArticlesVisibility();
                
                // Ekran okuyucuları için bildirim
                announcePageChange();
            }
        });
        
        // Ekran okuyucuları için sayfa değişimini bildir
        function announcePageChange() {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Sayfa ${currentPage} görüntüleniyor`;
            document.body.appendChild(announcement);
            
            // Bildirimi kaldır
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }

        // Klavye gezinimini etkinleştir
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
                prevBtn.click();
                prevBtn.focus();
            } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
                nextBtn.click();
                nextBtn.focus();
            }
        });

        // Sayfa yüklendiğinde ilk görünümü ayarla
        updateArticlesVisibility();
    }
}

// Beğeni butonları için işlevsellik
function initLikeButtons() {
    document.querySelectorAll('.like-btn, .like-btn-card').forEach(button => {
        // ARIA etiketlerini ekle
        button.setAttribute('aria-label', 'Bu makaleyi beğen');
        button.setAttribute('aria-pressed', 'false');
        
        button.addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const icon = btn.querySelector('i');
            const span = btn.querySelector('span');
            let count = span ? parseInt(span.textContent) : 0;
            
            // Beğeni durumunu değiştir
            const isLiked = btn.classList.contains('liked');
            btn.classList.toggle('liked');
            btn.setAttribute('aria-pressed', !isLiked);
            
            // İkon ve sayıyı güncelle
            if (isLiked) {
                icon.classList.replace('fas', 'far');
                if(span) span.textContent = count - 1;
                // Renk animasyonu
                btn.style.color = '#666';
            } else {
                icon.classList.replace('far', 'fas');
                if(span) span.textContent = count + 1;
                // Beğeni animasyonu
                animateLike(btn);
            }
            
            // Kullanıcıya görsel ve sesli geri bildirim
            giveFeedback(btn, !isLiked ? 'Beğenildi' : 'Beğeni kaldırıldı');
            
            // Yerel depolamada beğeni durumunu kaydet
            saveUserInteraction(btn.closest('.featured-post-section, .article-card')?.dataset.postId, 'like', !isLiked);
        });
    });
}

// Paylaşım butonları için işlevsellik
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        // ARIA etiketi ekle
        button.setAttribute('aria-label', 'Bu makaleyi paylaş');
        
        button.addEventListener('click', function() {
            // İçerik bilgilerini al
            const container = button.closest('.featured-post-section, .article-card, .modal-content');
            const title = container.querySelector('h1, h2, h4, .modal-title')?.textContent || 'Klimasun Blog';
            const url = window.location.href;
            
            // Paylaşım menüsünü göster (eğer Web Share API destekleniyorsa)
            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: 'Klimasun blogdan ilginç bir makale: ' + title,
                    url: url
                })
                .then(() => {
                    giveFeedback(button, 'Paylaşıldı');
                })
                .catch(error => {
                    console.error('Paylaşım hatası:', error);
                    copyToClipboard(url, button);
                });
            } else {
                // Web Share API desteklenmiyorsa URL'yi panoya kopyala
                copyToClipboard(url, button);
            }
        });
    });
}

// URL'yi panoya kopyalama
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text)
        .then(() => {
            giveFeedback(button, 'URL kopyalandı!');
        })
        .catch(err => {
            console.error('Kopyalama hatası:', err);
            giveFeedback(button, 'Kopyalanamadı', false);
        });
}

// Kullanıcıya görsel geri bildirim ver
function giveFeedback(element, message, isSuccess = true) {
    // Geri bildirim elementi oluştur
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.className = 'feedback-toast ' + (isSuccess ? 'success' : 'error');
    feedback.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${isSuccess ? '#00A0E4' : '#ff3b30'};
        color: white;
        padding: 10px 20px;
        border-radius: 30px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // ARIA özellikleri
    feedback.setAttribute('role', 'alert');
    feedback.setAttribute('aria-live', 'polite');
    
    // Geri bildirimi göster
    document.body.appendChild(feedback);
    setTimeout(() => {
        feedback.style.opacity = '1';
    }, 10);
    
    // Geri bildirimi kaldır
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
    
    // Element üzerinde animasyon efekti
    element.classList.add('pulse-animation');
    setTimeout(() => {
        element.classList.remove('pulse-animation');
    }, 800);
}

// Beğeni animasyonu
function animateLike(button) {
    button.style.color = '#ff3b30';
    
    // Kalp efekti
    const heart = document.createElement('span');
    heart.className = 'heart-animation';
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        animation: heart-fly 1s forwards;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.appendChild(heart);
    
    // Animasyon bitince kaldır
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// Blog modal işlevselliği
function initModal() {
    const modal = document.querySelector('.blog-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalDate = modal?.querySelector('.modal-date span');
    const modalTitle = modal?.querySelector('.modal-title');
    const modalBody = modal?.querySelector('.modal-body');
    const modalReadingTime = modal?.querySelector('.modal-meta .minutes');
    
    if (!modal) return;
    
    // Blog içerikleri (gerçek veriler API'den gelecek)
    const blogPosts = {
        'featured': {
            title: 'Bakım ve Onarım Alanında Satın Alma İş Birliklerinin Gerçek Hikayesi',
            date: '17 Şubat 2025',
            readingTime: '5 Dakika',
            content: `
                <p>Bakım alanında çalışan herkes, eskimiş parçaları bulma sürecinin ne kadar zorlu olduğunu bilir. Eksik bir bileşen tüm operasyonu durdurabilir ve aniden üretimi sürdürmek için telaşa kapılırsınız. İşte bu noktada güçlü iş birlikleri paha biçilmez hale gelir.</p>
                
                <p>Bakım, Onarım ve İşletme (MRO) dünyasında, güvenilir satın alma ortaklıklarına sahip olmak sadece kolaylık meselesi değil, aynı zamanda hayatta kalma meselesidir. Üretim hatları yaşlanan ekipmanlara bağlı olduğunda ve yedek parçaları bulmak giderek zorlaştığında, bu ilişkiler maliyetli çalışmama süreleri ile sorunsuz işlemler arasındaki farkı belirleyebilir.</p>
                
                <p>Bu ortaklıkların neden işe yaradığını ve günümüz üretim ortamında neden her zamankinden daha kritik olduklarını inceleyelim.</p>
                
                <h3>MRO Satın Alma Sürecinin Evrimi</h3>
                
                <p>Geleneksel satın alma yöntemleri genellikle birden fazla tedarikçi, uzun teklif süreçleri ve belirsiz teslimat süreleri içeriyordu. Modern MRO ortaklıkları tüm bu süreci kolaylaştırır ve şunları sunar:</p>
                
                <ul>
                    <li>Tek kaynaklı çözümler</li>
                    <li>Özel hesap yönetimi</li>
                    <li>Zor bulunan parçalara öncelikli erişim</li>
                    <li>Özelleştirilmiş envanter çözümleri</li>
                </ul>
                
                <p>Bu ortaklıklar, basit tedarikçi ilişkilerinden uzun vadeli operasyonel başarıyı destekleyen stratejik ittifaklara dönüşmüştür.</p>
                
                <h3>İş Operasyonları Üzerindeki Etki</h3>
                
                <p>Doğru ortaklık, bir işletmenin bakım ve onarımları nasıl ele aldığını dönüştürebilir. Proaktif parça tedariki ve envanter yönetimi sayesinde müşterilerin çalışmama sürelerini %60'a kadar azalttığını gördük. Bu sadece makineleri çalışır durumda tutmakla ilgili değil, aynı zamanda giderek zorlaşan bir pazarda rekabet avantajını korumakla ilgilidir.</p>
            `
        },
        'summer-shutdown': {
            title: 'Yaz Dönemi Fabrika Kapanışları Yaklaşıyor: Klimasun Önerileri',
            date: '12 Haziran 2025',
            readingTime: '4 Dakika',
            image: '../images/blog1.jpg',
            content: `
                <p>Yaz yaklaşırken, birçok üretici yıllık fabrika kapanışlarını planlıyor. Bu kritik dönem sadece üretimde bir duraklama değil, aynı zamanda gelecek yıl için sorunsuz operasyonları sağlayacak gerekli bakım ve yükseltmeleri gerçekleştirme fırsatıdır.</p>

                <p>Klimasun, yıllardır üreticilerin kapanış dönemlerine hazırlanmalarına ve bu değerli zamanı en iyi şekilde değerlendirmelerine yardımcı oluyor. İşte bu önemli zamanı en verimli şekilde kullanma konusunda öğrendiklerimiz.</p>

                <h3>Temel Hazırlık Adımları</h3>

                <p>Başarılı kapanışlar dikkatli planlama ve hazırlık gerektirir:</p>

                <ul>
                    <li>Kapsamlı ekipman denetimi</li>
                    <li>Parça envanteri değerlendirmesi</li>
                    <li>Bakım programı optimizasyonu</li>
                    <li>Ekip koordinasyonu ve eğitimi</li>
                </ul>

                <p>Asıl önemli olan, potansiyel sorunları sorun haline gelmeden önce belirlemek ve gerekli tüm kaynakların hazır olmasını sağlamaktır.</p>

                <h3>Kaçınılması Gereken Yaygın Hatalar</h3>

                <p>Kapanış dönemlerinde birçok şirketin benzer hatalar yaptığını gördük. İşte akılda tutulması gereken bazı önemli noktalar:</p>

                <ul>
                    <li>Parça tedarik sürelerini küçümsemeyin</li>
                    <li>Çok fazla görev planlamaktan kaçının</li>
                    <li>Uygun belgelendirmeyi sağlayın</li>
                    <li>Beklenmedik sorunlar için planlama yapın</li>
                </ul>
            `
        },
        'counterfeit-parts': {
            title: 'Tedarik Zincirinde Sahte Parçaları Tespit Etmek',
            date: '28 Eylül 2025',
            readingTime: '3 Dakika',
            image: '../images/anasayfa.png',
            content: `
                <p>Sahte bileşenler sadece ucuz taklitlerden ibaret değildir. Otomatik endüstriyel parçaların kusursuz etkileşimine bağlı üretim süreçleri için ciddi riskler oluştururlar. Bu standart altı bileşenler şunlara yol açabilir:</p>

                <ul>
                    <li>Ekipman arızası</li>
                    <li>Üretim gecikmeleri</li>
                    <li>Güvenlik tehlikeleri</li>
                    <li>Garanti sorunları</li>
                </ul>

                <h3>Sahte Parçaları Nasıl Tanırsınız</h3>

                <p>Sahte parçaları tanımlamak, detaylara dikkat etmeyi ve neye bakılacağını bilmeyi gerektirir:</p>

                <ol>
                    <li>Ambalaj kalitesini ve güvenlik özelliklerini doğrulayın</li>
                    <li>Seri numaralarını üretici veritabanlarına karşı kontrol edin</li>
                    <li>Fiziksel özellikleri dikkatle inceleyin</li>
                    <li>Mümkün olduğunda işlevselliği test edin</li>
                </ol>

                <h3>Tedarik Zincirinizi Koruma</h3>

                <p>Sahte parçalara karşı en iyi savunma, sağlam bir tedarik zinciri stratejisidir:</p>

                <ul>
                    <li>Yetkili distribütörlerle çalışın</li>
                    <li>Kapsamlı denetim prosedürleri uygulayın</li>
                    <li>Detaylı belgelendirme yapın</li>
                    <li>Personeli tanımlama yöntemleri konusunda eğitin</li>
                </ul>
            `
        },
        'lead-times': {
            title: 'Uzun Teslimat Sürelerini Aşmanın Yolları',
            date: '6 Şubat 2025',
            readingTime: '4 Dakika',
            image: '../images/blog2.jpg',
            content: `
                <p>Uzun teslimat süreleri hepimizi etkiliyor, ancak bunların sebep olduğu sorunları aşmanın yolları var. Sektörümüzdeki en büyük sorunlardan biri, tedarikçilerin sipariş kazanmak için bilerek daha kısa teslimat süresi vermesidir.</p>

                <p>Klimasun'da şeffaflığa ve gerçekçi zaman çizelgelerine inanıyoruz. İşte müşterilerimiz için uzun teslimat sürelerinin zorluklarını nasıl hafiflettiğimiz.</p>

                <h3>Teslimat Süresi Zorluğunu Anlamak</h3>

                <p>Endüstriyel otomasyon sektöründe uzun teslimat sürelerine katkıda bulunan birkaç faktör vardır:</p>

                <ul>
                    <li>Küresel tedarik zinciri aksaklıkları</li>
                    <li>Yarı iletken sıkıntısı</li>
                    <li>Özel bileşenlere olan talebin artması</li>
                    <li>Azaltılmış üretim kapasitesi</li>
                </ul>

                <p>Tutamayacağımız sözler vermek yerine, gerçekten işe yarayan çözümlere odaklanıyoruz.</p>

                <h3>Proaktif Yaklaşımımız</h3>

                <p>Müşterilerimizin uzun teslimat sürelerini yönetmelerine yardımcı olmak için birkaç strateji geliştirdik:</p>

                <ol>
                    <li>Kritik bileşenlerin stratejik envanterini tutmak</li>
                    <li>Alternatif tedarik kanalları geliştirmek</li>
                    <li>Onarım ve yenileme seçenekleri sunmak</li>
                    <li>Düzenli güncellemelerle şeffaf zaman çizelgeleri sağlamak</li>
                </ol><p>Bu yaklaşımları birleştirerek, standart sektör teslimat sürelerine kıyasla bekleme sürelerini ortalama %40 azaltabildik.</p>
            `
        }
    };

    // Modal'ı aç
    function openModal(postId) {
        const post = blogPosts[postId];
        if (!post) return;

        // Modal içeriğini güncelle
        modalDate.textContent = post.date;
        modalTitle.textContent = post.title;
        modalBody.innerHTML = post.content;
        
        if (modalReadingTime) {
            modalReadingTime.textContent = post.readingTime || '5 Dakika';
        }
        
        // Beğeni durumunu kontrol et ve güncelle
        const likeBtn = modal.querySelector('.like-btn');
        const isLiked = checkUserInteraction(postId, 'like');
        
        if (likeBtn) {
            const icon = likeBtn.querySelector('i');
            
            if (isLiked) {
                likeBtn.classList.add('liked');
                likeBtn.setAttribute('aria-pressed', 'true');
                icon.classList.replace('far', 'fas');
            } else {
                likeBtn.classList.remove('liked');
                likeBtn.setAttribute('aria-pressed', 'false');
                icon.classList.replace('fas', 'far');
            }
        }
        
        // Modal'ı göster
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Erişilebilirlik: Odağı modal'a taşı
        modalTitle.setAttribute('tabindex', '-1');
        modalTitle.focus();

        // Scroll'u en başa al
        modal.querySelector('.modal-text').scrollTop = 0;
        
        // Geçmiş API'si ile URL'yi güncelle (geri düğmesi ile modal kapatma için)
        const currentPath = window.location.pathname;
        history.pushState({modal: true, postId: postId}, "", `${currentPath}?post=${postId}`);
    }

    // Modal'ı kapat
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // URL'yi geri al
        history.pushState({}, "", window.location.pathname);
        
        // Son odaklanan elemente geri dön
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    // Son odaklanan elementi takip et
    let lastFocusedElement;
    
    // Event listeners
    if (modalClose && modalOverlay) {
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
    }

    // ESC tuşu ile kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Erişilebilirlik: Klavye tuzağı (focus trap)
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            // SHIFT+TAB ile geriye hareket
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } 
            // TAB ile ileriye hareket
            else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // Tarayıcı geçmişi için event listener
    window.addEventListener('popstate', function(event) {
        if (modal.classList.contains('active')) {
            closeModal();
        } else if (event.state && event.state.modal) {
            openModal(event.state.postId);
        }
    });

    // Read More butonlarına tıklama
    document.querySelectorAll('.read-more-btn, .read-more-link').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            lastFocusedElement = e.target;
            
            const article = e.target.closest('.featured-post-section, .article-card');
            let postId;

            if (article.classList.contains('featured-post-section')) {
                postId = 'featured';
            } else {
                const title = article.querySelector('h4').textContent.toLowerCase();
                if (title.includes('yaz')) postId = 'summer-shutdown';
                else if (title.includes('sahte')) postId = 'counterfeit-parts';
                else if (title.includes('teslimat')) postId = 'lead-times';
            }

            if (postId) openModal(postId);
        });
    });
    
    // URL parametrelerini kontrol et
    checkUrlForPostId();
}

// URL'den post ID'sini kontrol et
function checkUrlForPostId() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    
    if (postId) {
        // Timeout, sayfa yüklendikten sonra modal'ı aç
        setTimeout(() => {
            const openModalFn = getFunction('openModal');
            if (typeof openModalFn === 'function') {
                openModalFn(postId);
            }
        }, 500);
    }
}

// Newsletter form işlemleri
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Form gönderimi simülasyonu
                const submitButton = this.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
                
                setTimeout(() => {
                    // Başarılı abone olma
                    emailInput.value = '';
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Abone Ol <i class="fas fa-paper-plane"></i>';
                    
                    // Başarı mesajı
                    giveFeedback(newsletterForm, 'Bültenimize başarıyla abone oldunuz!');
                    
                    // Yerel depolamada kaydet
                    try {
                        localStorage.setItem('newsletter_subscribed', 'true');
                    } catch (e) {
                        console.error('Yerel depolama hatası:', e);
                    }
                }, 1500);
            } else {
                // Geçersiz e-posta
                giveFeedback(newsletterForm, 'Lütfen geçerli bir e-posta adresi girin', false);
            }
        });
    }
}

// E-posta doğrulama
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Kullanıcı etkileşimlerini kaydet
function saveUserInteraction(postId, type, state) {
    if (!postId) return;
    
    try {
        const interactions = JSON.parse(localStorage.getItem('blog_interactions')) || {};
        
        if (!interactions[postId]) {
            interactions[postId] = {};
        }
        
        interactions[postId][type] = state;
        localStorage.setItem('blog_interactions', JSON.stringify(interactions));
    } catch (e) {
        console.error('Kullanıcı etkileşimi kaydedilemedi:', e);
    }
}

// Kullanıcı etkileşimlerini kontrol et
function checkUserInteraction(postId, type) {
    if (!postId) return false;
    
    try {
        const interactions = JSON.parse(localStorage.getItem('blog_interactions')) || {};
        return interactions[postId] && interactions[postId][type] === true;
    } catch (e) {
        console.error('Kullanıcı etkileşimi okunamadı:', e);
        return false;
    }
}

// Sayfa giriş animasyonları
function animateEntrance() {
    const elements = [
        '.featured-post-section',
        '.section-title',
        '.article-card',
        '.newsletter-section'
    ];
    
    elements.forEach((selector, index) => {
        const items = document.querySelectorAll(selector);
        items.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100 * (index + i));
        });
    });
}

// Yardımcı: Fonksiyon adına göre fonksiyonu bul
function getFunction(name) {
    const functions = {
        openModal: function(postId) {
            const modal = document.querySelector('.blog-modal');
            const modalDate = modal?.querySelector('.modal-date span');
            const modalTitle = modal?.querySelector('.modal-title');
            const modalBody = modal?.querySelector('.modal-body');
            const modalReadingTime = modal?.querySelector('.modal-meta .minutes');
            
            // Blog içerikleri ve açma mantığı burada tekrarlanır
            // (Bu, basitleştirilmiş bir yaklaşımdır, gerçek uygulamada daha iyi bir mimari kullanılmalıdır)
            if (!modal) return;
            
            // Gerçek blogPosts içeriğini kullan
            // ...
            
            // Makaleyi bul ve modalı aç
            const posts = document.querySelectorAll('.featured-post-section, .article-card');
            for (let post of posts) {
                if (post.dataset.postId === postId || 
                    post.querySelector('h4')?.textContent.toLowerCase().includes(postId)) {
                    const readMoreLink = post.querySelector('.read-more-btn, .read-more-link');
                    if (readMoreLink) {
                        readMoreLink.click();
                        return;
                    }
                }
            }
        }
    };
    
    return functions[name];
}