// Modal işlemleri
function showLoginForm() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    }
}

function closeLoginForm() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function showSignupForm() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    }
}

function closeSignupForm() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function switchToSignup() {
    closeLoginForm();
    setTimeout(showSignupForm, 300);
}

function switchToLogin() {
    closeSignupForm();
    setTimeout(showLoginForm, 300);
}

// Modal dışına tıklandığında kapatma
document.addEventListener('click', (event) => {
    if (event.target.className === 'modal') {
        const modal = event.target;
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});

// Token kontrolü ve navbar güncelleme
async function checkAuth() {
    const token = localStorage.getItem('token');
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const storedUserName = localStorage.getItem('userName');

    if (!authButtons || !userMenu) return;

    if (token) {
        try {
            const response = await fetch('/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Token geçersiz');
            }

            const data = await response.json();
            authButtons.style.display = 'none';
            userMenu.style.display = 'block';
            if (userName) {
                userName.textContent = storedUserName || 'Kullanıcı';
            }
        } catch (error) {
            console.error('Token doğrulama hatası:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// Çıkış yapma fonksiyonu
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = '/';
    });
}

// Giriş işlemi
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            await checkAuth();
            closeLoginForm();
            window.location.href = '/profile';
        } else {
            alert(data.message || 'Giriş yapılırken bir hata oluştu');
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        alert('Giriş yapılırken bir hata oluştu');
    }
}

// Kayıt işlemi
async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;

    if (password !== passwordConfirm) {
        alert('Şifreler eşleşmiyor');
        return;
    }

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                firstName, 
                lastName, 
                email, 
                password 
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.');
            closeSignupForm();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Kayıt hatası:', error);
        alert('Kayıt olurken bir hata oluştu');
    }
}

// Event listener'ları ekle
document.addEventListener('DOMContentLoaded', () => {
    // Giriş ve kayıt butonları
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }
    
    if (registerButton) {
        registerButton.addEventListener('click', (e) => {
            e.preventDefault();
            showSignupForm();
        });
    }

    // Form submit işlemleri
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Sayfa yüklendiğinde token kontrolü yap
    checkAuth();
}); 