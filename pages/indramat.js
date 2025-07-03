// Grid/List view toggle
document.addEventListener('DOMContentLoaded', function() {
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const productGrid = document.querySelector('.product-grid');

    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            productGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });

        listViewBtn.addEventListener('click', function() {
            productGrid.style.gridTemplateColumns = '1fr';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }

    // Quick Quote button functionality
    const quoteButtons = document.querySelectorAll('.quick-quote');
    quoteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productInfo = this.closest('.product-info');
            const productName = productInfo.querySelector('h3').textContent;
            alert(`Quick quote request for ${productName} has been sent. We will contact you soon.`);
        });
    });

    // Product search functionality
    const searchInput = document.querySelector('.product-search input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const products = document.querySelectorAll('.product-item');

            products.forEach(product => {
                const title = product.querySelector('h3').textContent.toLowerCase();
                const description = product.querySelector('.description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    // Per page selection functionality
    const perPageSelect = document.querySelector('.per-page select');
    if (perPageSelect) {
        perPageSelect.addEventListener('change', function() {
            const itemsPerPage = parseInt(this.value);
            const products = document.querySelectorAll('.product-item');
            
            products.forEach((product, index) => {
                if (index < itemsPerPage) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
}); 