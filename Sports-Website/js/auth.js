// API endpoint'leri
const API_URL = '/api/users';

// Token yönetimi
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// Kullanıcı bilgilerini yönetme
const getUser = () => JSON.parse(localStorage.getItem('user'));
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('user');

// Form elementlerini seçme
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const authButtons = document.getElementById('authButtons');
const userMenu = document.getElementById('userMenu');
const userName = document.getElementById('userName');
const logoutButton = document.getElementById('logoutButton');

// Modal yönetimi
function openLoginForm() {
    loginModal.style.display = 'block';
    signupModal.style.display = 'none';
}

function openSignupForm() {
    signupModal.style.display = 'block';
    loginModal.style.display = 'none';
}

function closeLoginForm() {
    loginModal.style.display = 'none';
}

function closeSignupForm() {
    signupModal.style.display = 'none';
}

function switchToSignup() {
    closeLoginForm();
    openSignupForm();
}

function switchToLogin() {
    closeSignupForm();
    openLoginForm();
}

// Kullanıcı arayüzünü güncelleme
function updateUI() {
    const token = getToken();
    const user = getUser();

    if (token && user) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        userName.textContent = `${user.firstName} ${user.lastName}`;
    } else {
        authButtons.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

// Kayıt işlemi
async function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;

    // Şifre kontrolü
    if (password !== passwordConfirm) {
        alert('Şifreler eşleşmiyor!');
        return;
    }

    // İsim ayırma
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');

    try {
        const response = await fetch(`${API_URL}/register`, {
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
            openLoginForm();
        } else {
            alert(data.message || 'Kayıt işlemi başarısız oldu.');
        }
    } catch (error) {
        console.error('Kayıt hatası:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
}

// Giriş işlemi
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            setToken(data.token);
            setUser(data.user);
            updateUI();
            closeLoginForm();
            window.location.href = '/profile';
        } else {
            alert(data.message || 'Giriş başarısız oldu.');
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
}

// Çıkış işlemi
function handleLogout() {
    removeToken();
    removeUser();
    updateUI();
    window.location.href = '/';
}

// Event listener'ları ekleme
document.getElementById('loginButton').addEventListener('click', openLoginForm);
document.getElementById('registerButton').addEventListener('click', openSignupForm);
logoutButton.addEventListener('click', handleLogout);

// Sayfa yüklendiğinde UI'ı güncelle
document.addEventListener('DOMContentLoaded', updateUI);

// Modal dışına tıklandığında kapatma
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        closeLoginForm();
    }
    if (event.target === signupModal) {
        closeSignupForm();
    }
}); 