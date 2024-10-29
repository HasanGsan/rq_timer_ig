import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA75L1F1B61M5Jyp-xueFoRFLtipARmfY4",
  authDomain: "rqtimerignis.firebaseapp.com",
  databaseURL: "https://rqtimerignis-default-rtdb.firebaseio.com",
  projectId: "rqtimerignis",
  storageBucket: "rqtimerignis.appspot.com",
  messagingSenderId: "427989896754",
  appId: "1:427989896754:web:a733ed5114bfe76f61f62b",
  measurementId: "G-YDPHXVSQW7"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


// Функция для проверки действительности подписки
function isSubscriptionValid(expiryDate) {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return now <= expiry;
}

// Сохранение сессии с уровнем доступа
function setSession(loginValue, level, expiryDate) {
    const sessionData = {
        login: loginValue,
        level: level, // Сохраняем уровень доступа
        expiryDate: expiryDate
    };
    localStorage.setItem('userSession', JSON.stringify(sessionData));
}

// Проверка сессии
function checkSession() {
    const sessionData = JSON.parse(localStorage.getItem('userSession'));
    if (sessionData) {
        const now = new Date();
        const expiry = new Date(sessionData.expiryDate);
        if (now <= expiry) {
            // Пользователь авторизован, перенаправляем в зависимости от уровня доступа
            if (sessionData.level === 1) {
                window.location.href = "admin_panel.html"; // Для администратора
            } else {
                window.location.href = "index.html"; // Для обычного пользователя
            }
        }
    }
}

// Функция для входа пользователя
function loginUser() {
    const loginValue = document.getElementById("login").value;
    const passwordValue = document.getElementById("password").value;

    // Проверка, есть ли пользователь в базе данных
    const userRef = ref(database, 'contact_data/user/' + loginValue);
    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.password === passwordValue) {
                console.log('Авторизация пользователя успешна.');
                setSession(loginValue, userData.level, userData.expiryDate); // Сохраняем уровень доступа в сессии
                // Перенаправление будет обработано в checkSession
                window.location.href = userData.level === 1 ? "admin_panel.html" : "index.html";
            } else {
                alert('Неверный пароль.');
            }
        } else {
            // Проверка для администратора
            const adminRef = ref(database, 'contact_data/admin/admin_acc');
            onValue(adminRef, (snapshot) => {
                if (snapshot.exists()) {
                    const adminData = snapshot.val();
                    if (adminData.password === passwordValue) {
                        console.log('Авторизация администратора успешна.');
                        setSession(loginValue, 1, 1); // Уровень доступа 1 для администратора
                        window.location.href = "admin_panel.html"; // Редирект для администраторов
                    } else {
                        alert('Неверный пароль.');
                    }
                } else {
                    alert('Данные администратора не найдены.');
                }
            }, { onlyOnce: true });
        }
    }, { onlyOnce: true });
}

// Обработчик события на загрузку страницы
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            loginUser();
        });
    }

    // Проверка сессии при загрузке страницы
    checkSession();

    // Обработка клика по "Забыли данные?"
    const forgotPasswordLink = document.getElementById('forgotPassword');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(event) {
            event.preventDefault();
            this.textContent = 'TG:@GsanSan'; // Замена текста на Telegram аккаунт
        });
    }
});