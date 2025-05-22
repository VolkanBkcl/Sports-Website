// Resim yükleme ve optimizasyon işlemleri
document.addEventListener('DOMContentLoaded', () => {
    // Lazy loading için Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    // Resmi yükle
                    img.src = src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Tüm lazy loading resimleri gözlemle
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });

    // Resim yükleme hatalarını yönet
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            // Resim yüklenemezse placeholder göster
            img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoQABAABUB8JZwAA3AA/v3yAAA=';
            img.classList.add('image-error');
        });
    });
});

// Resim boyutlarını optimize et
function optimizeImageSize(img) {
    const maxWidth = 800; // Maksimum genişlik
    const maxHeight = 600; // Maksimum yükseklik
    
    if (img.naturalWidth > maxWidth || img.naturalHeight > maxHeight) {
        const ratio = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight);
        img.style.width = `${img.naturalWidth * ratio}px`;
        img.style.height = `${img.naturalHeight * ratio}px`;
    }
}

// Resim önbelleğe alma
const imageCache = new Map();

async function preloadImage(src) {
    if (imageCache.has(src)) {
        return imageCache.get(src);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
}

// Önemli resimleri önceden yükle
async function preloadImportantImages() {
    const importantImages = [
        'images/exercises/bench-press.webp',
        'images/exercises/pull-ups.webp'
    ];

    try {
        await Promise.all(importantImages.map(src => preloadImage(src)));
    } catch (error) {
        console.error('Resim ön yükleme hatası:', error);
    }
}

// Sayfa yüklendiğinde önemli resimleri önceden yükle
window.addEventListener('load', preloadImportantImages); 