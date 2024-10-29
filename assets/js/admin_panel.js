import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    onValue,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

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

//const bosses = ['archon', 'baks', 'voko', 'gt', 'dengur', 'destructor', 'ancient-ent', 'zveromor', 'koroleva', 'pruzhinka', 'shaman', 'hugo', 'edward', 'zt', 'ypir-kont', 'ypir-kat', 'ypir-tanc', 'pojir-moz', 'pojir-el', 'sovetnik', 'plamyarik', 'kor-termit', 'faraon', 'hozyain1', 'hozyain2', 'orakyl', 'zs1', 'zs2', 'jyjelica', 'samec-vor', 'samec-yma', 'samec-les', 'samca', 'ireks', 'gbg', 'lakysha', 'kp', 'kb1', 'kb2', 'kor-ternia', 'volk', 'tr-kris', 'vdova', 'slepo-krc', 'slepo-tym'];

// Проверка прав администратора
function checkAdminAccess() {
    const sessionData = JSON.parse(localStorage.getItem('userSession'));
    if (!sessionData || sessionData.login !== "admin" || sessionData.level !== 1) {
        alert("У вас нет доступа к этой странице.");
        window.location.href = "auth.html";
    }
}

// Генерация уникального ID для пользователя
function generateUserId(login) {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    return `${login}_${randomId}`;
}

// Добавление нового пользователя в базу данных
function addUserToDatabase(login, password, expiryDate) {
    const userId = generateUserId(login);
    const userData = {
        level: 2,
        login: login,
        password: password,
        subscription: {
            expiry_date: expiryDate
        },
        hiddenBosses: []
    };

    set(ref(database, `contact_data/user/${userId}`), userData)
        .then(() => {
            alert("Пользователь успешно добавлен.");
            document.getElementById('addUserForm').reset();
        })
        .catch((error) => {
            console.error("Ошибка при добавлении пользователя:", error);
            alert("Не удалось добавить пользователя.");
        });
}

// Выход из системы
function logout() {
    localStorage.removeItem('userSession');
    window.location.href = "auth.html";
}

// Обработчик формы добавления пользователя
document.addEventListener('DOMContentLoaded', function () {
    checkAdminAccess();

    const addUserForm = document.getElementById('addUserForm');
    addUserForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const login = document.getElementById('newUserLogin').value;
        const password = document.getElementById('newUserPassword').value;
        const expiryDate = `${document.getElementById('subscriptionDate').value}T${document.getElementById('subscriptionTime').value}:00`;

        addUserToDatabase(login, password, expiryDate);
    });

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', logout);

    loadUsers(); // Загрузка списка пользователей при загрузке страницы
});

// Функция для загрузки списка пользователей
function loadUsers() {
    const usersRef = ref(database, 'contact_data/user');
    const userTableBody = document.querySelector('#userTable tbody');

    userTableBody.innerHTML = ''; // Очистка таблицы

    onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        const currentDate = new Date(); // Текущая дата

        for (const userId in users) {
            const user = users[userId];
            const row = document.createElement('tr');

            // Логин пользователя с цветовой индикацией активности
            const loginCell = document.createElement('td');
            loginCell.textContent = user.login;
            row.appendChild(loginCell);

            // Уровень пользователя
            const levelCell = document.createElement('td');
            levelCell.textContent = user.level;
            row.appendChild(levelCell);

            // Дата истечения подписки
            const expiryCell = document.createElement('td');
            if (user.subscription && user.subscription.expiry_date) {
                const expiryDate = new Date(user.subscription.expiry_date);
                expiryCell.textContent = expiryDate.toISOString().split('T')[0]; // Форматирование даты
                // Цветовая индикация
                if (expiryDate > currentDate) {
                    loginCell.style.color = 'green'; // Активная подписка — зелёный цвет
                } else {
                    loginCell.style.color = 'red'; // Неактивная подписка — красный цвет
                }
            } else {
                expiryCell.textContent = 'Нет подписки'; // Или другое сообщение
                loginCell.style.color = 'gray'; // Серый цвет для отсутствующей подписки
            }
            row.appendChild(expiryCell);

            // Кнопка удаления
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => deleteUser(userId));

            if (user.login === 'admin') {
                deleteButton.disabled = true; // Отключение кнопки удаления для администратора
            }

            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            userTableBody.appendChild(row);
        }
    });
}


// Функция для удаления пользователя
function deleteUser(userId) {
    const userRef = ref(database, `contact_data/user/${userId}`);
    remove(userRef)
        .then(() => {
            alert('Пользователь удален.');
            loadUsers(); // Обновление списка пользователей
        })
        .catch((error) => {
            console.error('Ошибка при удалении пользователя:', error);
            alert('Не удалось удалить пользователя.');
        });
}


//Очистка таймеров

// Функция для сброса всех таймеров боссов
function clearAllTimers() {
    const bossesRef = ref(database, 'bosses');
    
    // Получаем все данные о боссах
    onValue(bossesRef, (snapshot) => {
        const bosses = snapshot.val();

        // Для каждого босса сбрасываем isAlive и respawnTime
        for (const boss in bosses) {
            const bossRef = ref(database, `bosses/${boss}`);
            update(bossRef, {
                isAlive: false,
                respawnTime: 0
            });
        }
        
       
    });
    
     alert('Все таймеры были успешно сброшены!');
}

// Обработчик нажатия на кнопку "Очистить таймеры"
document.getElementById('clearTimersButton').addEventListener('click', clearAllTimers)