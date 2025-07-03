// siemens-enhanced.js - İleri seviye UX fonksiyonları ve gelişmiş filtreleme sistemi

$(document).ready(function() {
    // Ana fonksiyonları başlat
    initViewToggle();
    initAdvancedFilters();
    initQuickQuote();
    initResponsiveFeatures();
    initAnimations();
    
    // Performans için görüntüleri lazy-load et
    lazyLoadImages();
});

// Izgara ve liste görünümü arasında geçiş
function initViewToggle() {
    $(".grid-view").click(function() {
        $(this).addClass("active");
        $(".list-view").removeClass("active");
        $(".product-grid").removeClass("list-layout").addClass("grid-layout");
        localStorage.setItem("siemens-view", "grid");
    });
    
    $(".list-view").click(function() {
        $(this).addClass("active");
        $(".grid-view").removeClass("active");
        $(".product-grid").removeClass("grid-layout").addClass("list-layout");
        localStorage.setItem("siemens-view", "list");
    });
    
    // Kullanıcının önceki görünüm tercihini geri yükle
    const savedView = localStorage.getItem("siemens-view");
    if (savedView === "list") {
        $(".list-view").click();
    }
}

// Gelişmiş filtreleme sistemi
function initAdvancedFilters() {
    const $productItems = $(".product-item");
    const $filterInputs = $(".advanced-filters select, .advanced-filters input");
    const $textFilter = $("#text-filter");
    const $categoryFilter = $("#category-filter");
    const $stockFilter = $("#stock-filter");
    const $activeFilters = $(".active-filters");
    const $clearFilters = $(".clear-filters");
    const $totalProducts = $(".total-products");
    let debounceTimer;
    
    // Filtreleri uygula
    function applyFilters() {
        clearTimeout(debounceTimer);
        
        debounceTimer = setTimeout(function() {
            const searchText = $textFilter.val().toLowerCase();
            const categoryFilter = $categoryFilter.val();
            const stockFilter = $stockFilter.val();
            
            // Aktif filtre etiketlerini güncelle
            updateActiveFilterTags();
            
            // Tüm ürünleri gizle ve uygun olanları göster
            $productItems.each(function() {
                const $item = $(this);
                const productTitle = $item.find("h3").text().toLowerCase();
                const productDesc = $item.find(".description").text().toLowerCase();
                const productCategory = $item.data("category");
                const isAvailable = $item.find(".availability i.fa-check-circle").length > 0;
                
                // Her filtre kriterini kontrol et
                const matchesText = productTitle.includes(searchText) || productDesc.includes(searchText) || searchText === "";
                const matchesCategory = categoryFilter === "" || productCategory === categoryFilter;
                const matchesStock = stockFilter === "" || 
                                    (stockFilter === "available" && isAvailable) || 
                                    (stockFilter === "outofstock" && !isAvailable);
                
                // Tüm kriterlere uyan ürünleri göster
                if (matchesText && matchesCategory && matchesStock) {
                    $item.fadeIn(300);
                    
                    // Aranan metni vurgula
                    if (searchText) {
                        highlightSearchText($item, searchText);
                    } else {
                        // Vurgulamayı kaldır
                        $item.find('.highlight').each(function() {
                            $(this).replaceWith($(this).text());
                        });
                    }
                } else {
                    $item.fadeOut(300);
                }
            });
            
            // Görünen ürün sayısını güncelle
            updateProductCounter();
            
            // URL'i güncelle (sayfa geçmişi için)
            updateURL();
            
            // Sonuç yoksa mesaj göster
            showNoResultsMessage();
        }, 300); // Debounce süresi (ms)
    }
    
    // Aranan metni vurgula
    function highlightSearchText($item, searchText) {
        const $title = $item.find("h3");
        const $desc = $item.find(".description");
        
        // Önce önceki vurguları temizle
        $title.find('.highlight').each(function() {
            $(this).replaceWith($(this).text());
        });
        $desc.find('.highlight').each(function() {
            $(this).replaceWith($(this).text());
        });
        
        // Fonksiyon: Text içinde eşleşen kelimeleri <span> içine al
        function wrapMatches(text, searchText) {
            const regex = new RegExp('(' + searchText + ')', 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        }
        
        // Başlık ve açıklamada vurgulama yap
        if ($title.length) {
            $title.html(wrapMatches($title.text(), searchText));
        }
        if ($desc.length) {
            $desc.html(wrapMatches($desc.text(), searchText));
        }
    }
    
    // Aktif filtre etiketlerini güncelle
    function updateActiveFilterTags() {
        $activeFilters.empty();
        let hasActiveFilters = false;
        
        // Kategori filtresi
        if ($categoryFilter.val()) {
            const categoryText = $categoryFilter.find("option:selected").text();
            addFilterTag(categoryText, function() {
                $categoryFilter.val("").trigger("change");
            });
            hasActiveFilters = true;
        }
        
        // Stok filtresi
        if ($stockFilter.val()) {
            const stockText = $stockFilter.find("option:selected").text();
            addFilterTag(stockText, function() {
                $stockFilter.val("").trigger("change");
            });
            hasActiveFilters = true;
        }
        
        // Metin araması
        if ($textFilter.val()) {
            addFilterTag(`"${$textFilter.val()}"`, function() {
                $textFilter.val("").trigger("keyup");
            });
            hasActiveFilters = true;
        }
        
        // Filtreleri temizle butonunu göster/gizle
        if (hasActiveFilters) {
            $clearFilters.fadeIn(200);
        } else {
            $clearFilters.fadeOut(200);
        }
    }
    
    // Filtre etiketi ekle
    function addFilterTag(text, onRemove) {
        const $tag = $(`<span class="filter-tag">${text} <i class="fas fa-times"></i></span>`);
        $tag.appendTo($activeFilters);
        
        $tag.on("click", function() {
            onRemove();
        });
    }
    
    // Görünür ürün sayısını güncelle
    function updateProductCounter() {
        const visibleCount = $productItems.filter(":visible").length;
        const totalCount = $productItems.length;
        $totalProducts.text(`${visibleCount} / ${totalCount} Ürün`);
    }
    
    // URL'i güncelle (filtrelerle)
    function updateURL() {
        if (history.pushState) {
            const searchParams = new URLSearchParams();
            
            if ($categoryFilter.val()) {
                searchParams.set('category', $categoryFilter.val());
            }
            
            if ($stockFilter.val()) {
                searchParams.set('stock', $stockFilter.val());
            }
            
            if ($textFilter.val()) {
                searchParams.set('search', $textFilter.val());
            }
            
            const newURL = window.location.pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');
            history.pushState({path: newURL}, '', newURL);
        }
    }
    
    // URL'den filtreleri yükle
    function loadFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        const category = urlParams.get('category');
        if (category) {
            $categoryFilter.val(category);
        }
        
        const stock = urlParams.get('stock');
        if (stock) {
            $stockFilter.val(stock);
        }
        
        const search = urlParams.get('search');
        if (search) {
            $textFilter.val(search);
        }
        
        // Eğer URL'de filtre varsa, uygula
        if (category || stock || search) {
            applyFilters();
        }
    }
    
    // Sonuç yoksa mesaj göster
    function showNoResultsMessage() {
        const visibleProducts = $productItems.filter(":visible").length;
        
        if (visibleProducts === 0) {
            if ($(".no-results").length === 0) {
                $(".product-grid").append(`
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
                        <button class="clear-all-filters">Filtreleri Temizle</button>
                    </div>
                `);
                
                $(".clear-all-filters").on("click", clearAllFilters);
            }
        } else {
            $(".no-results").remove();
        }
    }
    
    // Tüm filtreleri temizle
    function clearAllFilters() {
        $categoryFilter.val("");
        $stockFilter.val("");
        $textFilter.val("");
        applyFilters();
    }
    
    // Filtre değişikliklerini dinle
    $filterInputs.on("change keyup", applyFilters);
    
    // "Filtreleri Temizle" butonunu ayarla
    $clearFilters.on("click", clearAllFilters);
    
    // URL'den filtreleri yükle
    loadFiltersFromURL();
    
    // Mobil filtre panelini kur
    setupMobileFilters();
    
    // İlk yükleme için sayacı güncelle
    updateProductCounter();
}

// Mobil filtre panelini kur
function setupMobileFilters() {
    const $filterToggle = $(".mobile-filter-toggle");
    const $mobileFilterPanel = $(".mobile-filter-panel");
    const $closePanel = $(".close-filter-panel");
    const $applyFilters = $(".apply-filters");
    
    $filterToggle.click(function() {
        $mobileFilterPanel.addClass("show");
        $("body").addClass("no-scroll");
    });
    
    $closePanel.click(function() {
        $mobileFilterPanel.removeClass("show");
        $("body").removeClass("no-scroll");
    });
    
    $applyFilters.click(function() {
        $mobileFilterPanel.removeClass("show");
        $("body").removeClass("no-scroll");
    });
    
    // Panel dışına tıklandığında kapat
    $(document).mouseup(function(e) {
        if (!$mobileFilterPanel.is(e.target) && $mobileFilterPanel.has(e.target).length === 0) {
            $mobileFilterPanel.removeClass("show");
            $("body").removeClass("no-scroll");
        }
    });
}

// Hızlı teklif isteme fonksiyonu
function initQuickQuote() {
    $(".quick-quote").click(function() {
        const $product = $(this).closest(".product-item");
        const productCode = $product.find("h3").text();
        const productName = $product.find(".description").text();
        
        // Modal içeriğini ürüne göre güncelle ve göster
        showQuoteModal(productCode, productName);
    });
}

// Teklif modalı göster
function showQuoteModal(productCode, productName) {
    // Modal yoksa oluştur
    if ($("#quick-quote-modal").length === 0) {
        $("body").append(`
            <div id="quick-quote-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Teklif İsteyin</h2>
                    <div class="product-summary">
                        <div class="product-code-highlight"></div>
                        <p class="product-name-display"></p>
                    </div>
                    <form id="quote-form">
                        <div class="form-group">
                            <label for="product-code">Ürün Kodu:</label>
                            <input type="text" id="product-code" readonly>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="customer-name">Adınız Soyadınız:</label>
                                <input type="text" id="customer-name" required>
                            </div>
                            <div class="form-group">
                                <label for="customer-company">Firma Adı:</label>
                                <input type="text" id="customer-company">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="customer-email">E-posta:</label>
                                <input type="email" id="customer-email" required>
                            </div>
                            <div class="form-group">
                                <label for="customer-phone">Telefon:</label>
                                <input type="tel" id="customer-phone">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="quantity">Adet:</label>
                            <input type="number" id="quantity" value="1" min="1">
                        </div>
                        <div class="form-group">
                            <label for="message">Ek Bilgi:</label>
                            <textarea id="message" rows="3"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="cancel-quote">Vazgeç</button>
                            <button type="submit" class="submit-quote">Teklif İste</button>
                        </div>
                    </form>
                </div>
            </div>
        `);
        
        // Modal fonksiyonları
        $(".close-modal, .cancel-quote").click(function() {
            $("#quick-quote-modal").removeClass("show");
            setTimeout(() => {
                $("#quick-quote-modal").hide();
            }, 300);
        });
        
        $(window).click(function(e) {
            if ($(e.target).is("#quick-quote-modal")) {
                $("#quick-quote-modal").removeClass("show");
                setTimeout(() => {
                    $("#quick-quote-modal").hide();
                }, 300);
            }
        });
        
        $("#quote-form").submit(function(e) {
            e.preventDefault();
            $("#quick-quote-modal").removeClass("show");
            setTimeout(() => {
                $("#quick-quote-modal").hide();
                showConfirmation();
            }, 300);
        });
    }
    
    // Ürün bilgilerini güncelle
    $("#product-code").val(productCode);
    $(".product-code-highlight").text(productCode);
    $(".product-name-display").text(productName);
    
    // Modalı göster
    $("#quick-quote-modal").show();
    setTimeout(() => {
        $("#quick-quote-modal").addClass("show");
    }, 10);
}

// Teklif onayını göster
function showConfirmation() {
    // Toast bildirimi ekle
    if ($("#confirmation-toast").length === 0) {
        $("body").append(`
            <div id="confirmation-toast" class="toast">
                <div class="toast-content">
                    <i class="fas fa-check-circle"></i>
                    <div class="toast-message">
                        <p>Teklif talebiniz gönderildi!</p>
                        <p>24 saat içinde sizinle iletişime geçeceğiz.</p>
                    </div>
                    <button class="close-toast"><i class="fas fa-times"></i></button>
                </div>
                <div class="toast-progress-bar">
                    <div class="progress"></div>
                </div>
            </div>
        `);
        
        // Toast kapatma butonu
        $(".close-toast").click(function() {
            $("#confirmation-toast").removeClass("show");
            setTimeout(() => {
                $("#confirmation-toast").remove();
            }, 300);
        });
    }
    
    // Toastı göster
    $("#confirmation-toast").addClass("show");
    
    // İlerleme çubuğunu başlat
    $(".toast-progress-bar .progress").css("width", "0%");
    $(".toast-progress-bar .progress").animate({
        width: "100%"
    }, 5000, function() {
        // İlerleme tamamlandığında kapat
        $("#confirmation-toast").removeClass("show");
        setTimeout(() => {
            $("#confirmation-toast").remove();
        }, 300);
    });
}

// Duyarlı özellikler
function initResponsiveFeatures() {
    // Sayfalama için
    $(".pagination button").click(function() {
        if ($(this).is("[disabled]") || $(this).hasClass("active")) {
            return;
        }
        
        if ($(this).hasClass("prev-page")) {
            // Önceki sayfa
            const $activePage = $(".page-numbers button.active");
            const $prevPage = $activePage.prev();
            
            if ($prevPage.length) {
                $activePage.removeClass("active");
                $prevPage.addClass("active");
                
                // Butonları güncelle
                updatePaginationButtons();
                scrollToTop();
            }
        } else if ($(this).hasClass("next-page")) {
            // Sonraki sayfa
            const $activePage = $(".page-numbers button.active");
            const $nextPage = $activePage.next();
            
            if ($nextPage.length) {
                $activePage.removeClass("active");
                $nextPage.addClass("active");
                
                // Butonları güncelle
                updatePaginationButtons();
                scrollToTop();
            }
        } else {
            // Doğrudan sayfa numarası tıklaması
            $(".page-numbers button").removeClass("active");
            $(this).addClass("active");
            updatePaginationButtons();
            scrollToTop();
        }
    });
    
    // Sayfalama durumunu başlat
    updatePaginationButtons();
    
    // Filtre akordiyonları için
    $(".filter-section-title").click(function() {
        $(this).toggleClass("active");
        $(this).next(".filter-options").slideToggle(200);
    });
}

// Sayfalama buton durumlarını güncelle
function updatePaginationButtons() {
    const $activePage = $(".page-numbers button.active");
    const isFirstPage = $activePage.is($(".page-numbers button").first());
    const isLastPage = $activePage.is($(".page-numbers button").last());
    
    // Önceki/sonraki butonları etkinleştir/devre dışı bırak
    $(".prev-page").prop("disabled", isFirstPage);
    $(".next-page").prop("disabled", isLastPage);
}

// Yumuşak sayfa başına kaydırma
function scrollToTop() {
    $("html, body").animate({ scrollTop: $(".product-grid").offset().top - 20 }, 300);
}

// Animasyonları başlat
function initAnimations() {
    // Sayfa yüklendiğinde ürünleri sırayla göster
    const $products = $(".product-item");
    $products.hide();
    
    setTimeout(function() {
        $products.each(function(index) {
            $(this).delay(index * 50).fadeIn(300);
        });
    }, 300);
    
    // Scroll animasyonları
    $(window).scroll(function() {
        const scrollPos = $(window).scrollTop();
        
        // Kaydırma başlığını göster/gizle
        if (scrollPos > 200) {
            if (!$(".scroll-to-top").length) {
                $("body").append(`
                    <button class="scroll-to-top" aria-label="Yukarı git">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                `);
                
                $(".scroll-to-top").click(function() {
                    $("html, body").animate({ scrollTop: 0 }, 500);
                });
            }
            
            $(".scroll-to-top").addClass("show");
        } else {
            $(".scroll-to-top").removeClass("show");
        }
        
        // Yapıştırılmış başlık
        if (scrollPos > $(".brand-hero").outerHeight()) {
            $(".product-filter").addClass("sticky");
            $("main").addClass("sticky-padding");
        } else {
            $(".product-filter").removeClass("sticky");
            $("main").removeClass("sticky-padding");
        }
    });
}

// Lazy load images for better performance
function lazyLoadImages() {
    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute("data-src");
                    
                    if (src) {
                        // Yükleme animasyonu göster
                        $(img).addClass("loading");
                        
                        // Görüntüyü yükle
                        const tempImg = new Image();
                        tempImg.onload = function() {
                            img.src = src;
                            $(img).removeClass("loading").addClass("loaded");
                        };
                        tempImg.src = src;
                        
                        img.removeAttribute("data-src");
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: "50px"
        });
        
        // Düzenli image src'yi lazy loading için data-src'ye dönüştür
        $(".product-image img").each(function() {
            const src = $(this).attr("src");
            $(this).attr("data-src", src);
            $(this).attr("src", "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3C/svg%3E");
            $(this).wrap("<div class='image-wrapper'></div>");
            $(this).after("<div class='loading-spinner'><i class='fas fa-spinner fa-spin'></i></div>");
            imageObserver.observe(this);
        });
    }
}