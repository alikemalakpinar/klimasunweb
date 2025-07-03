function loadHeader() {
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
    
    const header = `
        <header class="dashboard-header">
            <div class="logo-container">
                <img src="../images/logo.png" alt="Klimasun Logo" class="header-logo">
            </div>
            <nav class="nav-menu">
                <ul>
                    <li><a href="dashboard.html" ${currentPage === "dashboard" ? 'class="active"' : ''}>Dashboard</a></li>
                    <li><a href="urunler.html" ${currentPage === "urunler" ? 'class="active"' : ''}>Ürünler</a></li>
                    <li><a href="makaleler.html" ${currentPage === "makaleler" ? 'class="active"' : ''}>Makaleler</a></li>
                    <li><a href="ayarlar.html" ${currentPage === "ayarlar" ? 'class="active"' : ''}>Ayarlar</a></li>
                </ul>
            </nav>
            <div class="user-menu">
                <span class="username">Admin</span>
                <button class="logout-btn" onclick="logout()">Çıkış Yap</button>
            </div>
        </header>
    `;

    $("#header-container").html(header);
}

function logout() {
    window.location.href = 'login.html';
}

$(document).ready(function() {
    loadHeader();
}); 