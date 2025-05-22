// Navbar scroll efekti
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}, { passive: true });

// Mobil menü toggle
const mobileMenuButton = document.getElementById('mobileMenuButton');
const navLinksContainer = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        authButtons.classList.toggle('mobile');
        mobileMenuButton.innerHTML = navLinksContainer.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Aktif sayfa linkini vurgula
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Lazy loading için Intersection Observer
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px 0px',
    threshold: 0.1
});

lazyImages.forEach(img => imageObserver.observe(img));

// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', () => {
    // Performans metriklerini topla
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Sayfa yüklenme süresi: ${loadTime}ms`);
    }
}); 