// @ts-nocheck
// Menu Burger Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mainNav = document.getElementById('mainNav');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const desktopContactBtn = document.querySelector('.desktop-contact-btn');
    
    // Fonction pour ouvrir le menu
    function openMenu() {
        mainNav.classList.add('open');
        navOverlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Cacher le bouton contact desktop pendant l'animation
        if (desktopContactBtn) {
            desktopContactBtn.style.opacity = '0';
        }
    }
    
    // Fonction pour fermer le menu
    function closeMenuFunction() {
        mainNav.classList.remove('open');
        navOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Réafficher le bouton contact desktop
        if (desktopContactBtn) {
            desktopContactBtn.style.opacity = '1';
        }
    }
    
    // Événements
    menuToggle.addEventListener('click', openMenu);
    closeMenu.addEventListener('click', closeMenuFunction);
    navOverlay.addEventListener('click', closeMenuFunction);
    
    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Délai pour laisser l'animation se faire
            setTimeout(() => {
                closeMenuFunction();
            }, 300);
            
            // Mettre à jour le lien actif
            const currentPage = window.location.pathname.split('/').pop();
            const linkHref = this.getAttribute('href');
            
            // Vérifier si c'est la page active
            if ((linkHref === 'index.html' && currentPage === 'index.html') ||
                (linkHref === 'developpement-reseaux.html' && currentPage === 'developpement-reseaux.html') ||
                (linkHref === 'quiz.html' && currentPage === 'quiz.html')) {
                navLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('open')) {
            closeMenuFunction();
        }
    });
    
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mainNav.classList.contains('open')) {
            closeMenuFunction();
        }
    });
    
    // Définir le lien actif selon la page courante
    function setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop();
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if ((linkHref === 'index.html' && currentPage === 'index.html') ||
                (linkHref === 'developpement-reseaux.html' && currentPage === 'developpement-reseaux.html') ||
                (linkHref === 'quiz.html' && currentPage === 'quiz.html')) {
                link.classList.add('active');
            }
        });
    }
    
    // Appeler la fonction au chargement
    setActiveLink();
});

// Styles dynamiques pour les animations
const dynamicStyles = `
    .menu-toggle i {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .menu-toggle.active i {
        transform: rotate(90deg);
        opacity: 0;
    }
    
    .close-menu i {
        transition: transform 0.3s ease;
    }
    
    .close-menu:hover i {
        transform: rotate(90deg);
    }
    
    .nav-link {
        transition: all 0.3s ease;
    }
    
    .nav.open .nav-link {
        animation: fadeIn 0.3s ease forwards;
        opacity: 0;
    }
    
    .nav.open .nav-link:nth-child(1) { animation-delay: 0.1s; }
    .nav.open .nav-link:nth-child(2) { animation-delay: 0.2s; }
    .nav.open .nav-link:nth-child(3) { animation-delay: 0.3s; }
    
    .nav-overlay {
        transition: opacity 0.3s ease;
    }
    
    @keyframes fadeIn {
        to {
            opacity: 1;
            transform: translateX(0);
        }
        from {
            opacity: 0;
            transform: translateX(20px);
        }
    }
`;

// Ajouter les styles dynamiques
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);