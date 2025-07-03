$(document).ready(function() {
    // Grid/List view toggle
    $('.grid-view').click(function() {
        $(this).addClass('active');
        $('.list-view').removeClass('active');
        $('.product-grid').removeClass('list-view');
    });

    $('.list-view').click(function() {
        $(this).addClass('active');
        $('.grid-view').removeClass('active');
        $('.product-grid').addClass('list-view');
    });

    // Per page selection
    $('.per-page select').change(function() {
        // Add functionality for changing items per page
        console.log('Items per page changed to: ' + $(this).val());
    });

    // Product search
    let searchTimeout;
    $('.product-search input').on('input', function() {
        clearTimeout(searchTimeout);
        const searchTerm = $(this).val();
        
        searchTimeout = setTimeout(function() {
            // Add functionality for searching products
            console.log('Searching for: ' + searchTerm);
        }, 500);
    });

    // Quick quote buttons
    $('.quick-quote').click(function() {
        const productName = $(this).closest('.product-item').find('h3').text();
        // Add functionality for quick quote
        console.log('Quick quote requested for: ' + productName);
    });
});
