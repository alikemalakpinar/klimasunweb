// Product management functionality
let products = [];
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'none';
let currentEditingId = null;

document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
    setupEventListeners();
    
    // Initialize form as hidden
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.classList.remove('active');
    }
});

// Fetch products from server
async function fetchProducts() {
    try {
        const response = await fetch('get_products.php');
        const data = await response.json();
        if (data.success) {
            products = data.products;
            loadProducts();
        } else {
            showError('Ürünler yüklenirken bir hata oluştu');
        }
    } catch (error) {
        showError('Sunucu bağlantısında bir hata oluştu');
    }
}

function setupEventListeners() {
    const productForm = document.getElementById('productForm');
    const toggleFormBtn = document.querySelector('.toggle-form-btn');
    
    if (toggleFormBtn) {
        toggleFormBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            productForm.classList.toggle('active');
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            currentSearch = e.target.value.toLowerCase();
            updateActiveFilters();
            loadProducts();
        }, 300));
    }

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            currentSort = e.target.value;
            updateActiveFilters();
            loadProducts();
        });
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.category;
            updateActiveFilters();
            loadProducts();
        });
    });

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Enhanced image preview with drag and drop
    const imageInput = document.getElementById('productImage');
    const dropZone = document.querySelector('.file-input-button');
    
    if (dropZone && imageInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        dropZone.addEventListener('drop', handleDrop, false);
        imageInput.addEventListener('change', handleFileSelect);
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    document.querySelector('.file-input-button').classList.add('highlight');
}

function unhighlight(e) {
    document.querySelector('.file-input-button').classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    document.getElementById('productImage').files = files;
    handleFileSelect({ target: { files: files } });
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else if (file) {
        showError('Lütfen geçerli bir görsel dosyası seçin');
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const imageFile = formData.get('productImage');
    
    if (imageFile.size === 0) {
        showError('Lütfen bir ürün görseli seçin');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        const productData = {
            name: formData.get('productName'),
            category: formData.get('productCategory'),
            stock: formData.get('productStock'),
            image: e.target.result
        };

        try {
            const response = await fetch('add_product.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();
            if (data.success) {
                products.unshift(data.product);
                loadProducts();
                showSuccess('Ürün başarıyla eklendi');
                document.getElementById('productForm').reset();
                document.getElementById('imagePreview').src = '';
                document.getElementById('imagePreview').style.display = 'none';
            } else {
                showError(data.message || 'Ürün eklenirken bir hata oluştu');
            }
        } catch (error) {
            showError('Sunucu bağlantısında bir hata oluştu');
        }
    };

    reader.readAsDataURL(imageFile);
}

function loadProducts() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;

    // Filter by category
    let filteredProducts = currentFilter === 'all' 
        ? [...products]
        : products.filter(p => p.category === currentFilter);

    // Filter by search
    if (currentSearch) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(currentSearch) ||
            p.category.toLowerCase().includes(currentSearch)
        );
    }

    // Sort products
    switch (currentSort) {
        case 'stockAsc':
            filteredProducts.sort((a, b) => a.stock - b.stock);
            break;
        case 'stockDesc':
            filteredProducts.sort((a, b) => b.stock - a.stock);
            break;
        case 'nameAsc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nameDesc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    // Clear the products list
    productsList.innerHTML = '';

    // Show no results message if no products found
    if (filteredProducts.length === 0) {
        productsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>Sonuç bulunamadı</p>
            </div>
        `;
        return;
    }

    // Create HTML string for all products
    const productsHTML = filteredProducts.map(product => createProductCard(product)).join('');
    productsList.innerHTML = productsHTML;
}

function createProductCard(product) {
    // Fix image path to ensure it's always relative to the root
    const imagePath = product.image_url ? 
        (product.image_url.startsWith('/') ? product.image_url.substring(1) : product.image_url) : 
        'components/placeholder.png';
    
    return `
        <div class="product-card ${!product.visible ? 'hidden' : ''}" data-id="${product.id}">
            <div class="product-image">
                <img src="../${imagePath}" alt="${product.name}" onerror="this.src='components/placeholder.png'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="category"><i class="fas fa-tag"></i> ${product.category}</p>
                <p class="stock"><i class="fas fa-box"></i> Stok: ${product.stock}</p>
            </div>
            <div class="product-actions">
                <button onclick="openEditModal(${product.id})" class="edit-btn" title="Düzenle">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="openStockModal(${product.id})" class="stock-btn" title="Stok Güncelle">
                    <i class="fas fa-boxes"></i>
                </button>
                <button onclick="toggleVisibility(${product.id})" class="visibility-btn ${product.visible ? 'visible' : ''}" title="${product.visible ? 'Gizle' : 'Göster'}">
                    <i class="fas ${product.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                </button>
                <button onclick="deleteProduct(${product.id})" class="delete-btn" title="Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

async function toggleVisibility(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
        const response = await fetch('update_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: productId,
                visible: !product.visible
            })
        });

        const data = await response.json();
        if (data.success) {
            product.visible = !product.visible;
            loadProducts();
            showSuccess(product.visible ? 'Ürün görünür yapıldı' : 'Ürün gizlendi');
        } else {
            showError(data.message || 'Görünürlük değiştirilirken bir hata oluştu');
        }
    } catch (error) {
        showError('Sunucu bağlantısında bir hata oluştu');
    }
}

async function deleteProduct(productId) {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        try {
            const response = await fetch('delete_product.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: productId })
            });

            const data = await response.json();
            if (data.success) {
                products = products.filter(p => p.id !== productId);
                loadProducts();
                showSuccess('Ürün başarıyla silindi');
            } else {
                showError(data.message || 'Ürün silinirken bir hata oluştu');
            }
        } catch (error) {
            showError('Sunucu bağlantısında bir hata oluştu');
        }
    }
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.getElementById('productForm').insertBefore(errorDiv, document.querySelector('.btn-primary'));
    setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.querySelector('.container').insertBefore(successDiv, document.getElementById('productForm'));
    setTimeout(() => successDiv.remove(), 3000);
}

function openStockModal(productId) {
    currentEditingId = productId;
    const product = products.find(p => p.id === productId);
    if (product) {
        const modal = document.getElementById('stockModal');
        const stockInput = document.getElementById('editStock');
        stockInput.value = product.stock;
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function openEditModal(productId) {
    currentEditingId = productId;
    const product = products.find(p => p.id === productId);
    if (product) {
        const modal = document.getElementById('editModal');
        document.getElementById('editName').value = product.name;
        document.getElementById('editCategory').value = product.category;
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

async function updateStock() {
    const newStock = parseInt(document.getElementById('editStock').value);
    if (newStock < 0) {
        showError('Stok miktarı 0\'dan küçük olamaz');
        return;
    }

    try {
        const response = await fetch('update_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: currentEditingId,
                stock: newStock
            })
        });

        const data = await response.json();
        if (data.success) {
            const product = products.find(p => p.id === currentEditingId);
            if (product) {
                product.stock = newStock;
                loadProducts();
                document.getElementById('stockModal').style.display = 'none';
                showSuccess('Stok miktarı güncellendi');
            }
        } else {
            showError(data.message || 'Stok güncellenirken bir hata oluştu');
        }
    } catch (error) {
        showError('Sunucu bağlantısında bir hata oluştu');
    }
}

async function updateProduct() {
    const newName = document.getElementById('editName').value;
    const newCategory = document.getElementById('editCategory').value;

    if (!newName || !newCategory) {
        showError('Tüm alanları doldurun');
        return;
    }

    try {
        const response = await fetch('update_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: currentEditingId,
                name: newName,
                category: newCategory
            })
        });

        const data = await response.json();
        if (data.success) {
            const product = products.find(p => p.id === currentEditingId);
            if (product) {
                product.name = newName;
                product.category = newCategory;
                loadProducts();
                document.getElementById('editModal').style.display = 'none';
                showSuccess('Ürün başarıyla güncellendi');
            }
        } else {
            showError(data.message || 'Ürün güncellenirken bir hata oluştu');
        }
    } catch (error) {
        showError('Sunucu bağlantısında bir hata oluştu');
    }
}

function updateActiveFilters() {
    const filterTags = document.querySelector('.filter-tags');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    filterTags.innerHTML = '';
    let hasActiveFilters = false;

    // Category filter tag
    if (currentFilter !== 'all') {
        hasActiveFilters = true;
        addFilterTag('Kategori: ' + currentFilter, () => {
            currentFilter = 'all';
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === 'all');
            });
            updateActiveFilters();
            loadProducts();
        });
    }

    // Search filter tag
    if (currentSearch) {
        hasActiveFilters = true;
        addFilterTag('Arama: ' + currentSearch, () => {
            currentSearch = '';
            document.getElementById('searchInput').value = '';
            updateActiveFilters();
            loadProducts();
        });
    }

    // Sort filter tag
    if (currentSort !== 'none') {
        hasActiveFilters = true;
        const sortText = document.querySelector(`#sortSelect option[value="${currentSort}"]`).textContent;
        addFilterTag('Sıralama: ' + sortText, () => {
            currentSort = 'none';
            document.getElementById('sortSelect').value = 'none';
            updateActiveFilters();
            loadProducts();
        });
    }

    clearFiltersBtn.style.display = hasActiveFilters ? 'flex' : 'none';
}

function addFilterTag(text, onRemove) {
    const filterTags = document.querySelector('.filter-tags');
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `
        ${text}
        <i class="fas fa-times" title="Filtreyi Kaldır"></i>
    `;
    tag.querySelector('i').addEventListener('click', onRemove);
    filterTags.appendChild(tag);
}

function clearAllFilters() {
    currentFilter = 'all';
    currentSearch = '';
    currentSort = 'none';
    
    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'none';
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
    });
    
    updateActiveFilters();
    loadProducts();
}

// Utility function for debouncing search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 