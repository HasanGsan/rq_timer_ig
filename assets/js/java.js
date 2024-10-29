import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    onValue
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


const bosses = ['archon', 'baks', 'voko', 'gt', 'dengur', 'destructor', 'ancient-ent', 'zveromor', 'koroleva', 'pruzhinka', 'shaman', 'hugo', 'edward', 'zt', 'ypir-kont', 'ypir-kat', 'ypir-tanc', 'pojir-moz', 'pojir-el', 'sovetnik', 'plamyarik', 'kor-termit', 'faraon', 'hozyain1', 'hozyain2', 'orakyl', 'zs1', 'zs2', 'jyjelica', 'samec-vor', 'samec-yma', 'samec-les', 'samca', 'ireks', 'gbg', 'lakysha', 'kp', 'kb1', 'kb2', 'kor-ternia', 'volk', 'tr-kris', 'vdova', 'slepo-krc', 'slepo-tym', 'dyan-elgor', 'dyan-les', 'dyan-arkon', 'dyan-zagri'];


window.startTimer = function (boss, respawnTime) {
    const bossRef = ref(database, `bosses/${boss}`);
    const currentTime = Math.floor(Date.now() / 1000); // текущее время в секундах

    onValue(bossRef, (snapshot) => {
        const data = snapshot.val();

        // Проверяем, если босс уже убит
        if (data && data.isAlive) {
            // Если босс жив, просто обновляем интерфейс
            const remainingTime = (data.killTime + data.respawnTime) - currentTime;
            if (remainingTime > 0) {
                document.getElementById(`${boss}-btn`).disabled = true;
                countdown(boss, data.killTime, data.respawnTime);
                return; // Выходим, если таймер уже идет
            } else {
                resetBoss(boss); // Если таймер истек, сбрасываем босса
            }
        }

        // Устанавливаем новый таймер
        set(bossRef, {
            isAlive: true,
            respawnTime: respawnTime,
            killTime: currentTime
        }).then(() => {
            document.getElementById(`${boss}-btn`).disabled = true;
            countdown(boss, currentTime, respawnTime);
        }).catch((error) => {
            console.error("Ошибка при записи в Firebase: ", error);
        });
    }, {
        onlyOnce: true
    }); // Обработка срабатывает только один раз
};
//
//function playVoiceMessage(message) {
//    const speech = new SpeechSynthesisUtterance(message);
//    speech.lang = 'ru-RU';  // Устанавливаем язык (русский)
//    speech.pitch = 1;       // Высота тона
//    speech.rate = 1;        // Скорость речи
//    speechSynthesis.speak(speech);
//}

function playVoiceMessage(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'ru-RU'; 
    speech.pitch = parseFloat(getCookie('pitch')) || 1; 
    speech.rate = parseFloat(getCookie('rate')) || 1; 
    speech.volume = parseFloat(getCookie('volume')) || 1; 
    speechSynthesis.speak(speech);
}

function updatePitch() {
    const pitchValue = document.getElementById('pitchControl').value;
    setCookie('pitch', pitchValue, 30);
}

function updateRate() {
    const rateValue = document.getElementById('rateControl').value;
    setCookie('rate', rateValue, 30);
}

function updateVolume() {
    const volumeValue = document.getElementById('volumeControl').value;
    setCookie('volume', volumeValue, 30);
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const cookieArr = document.cookie.split('; ');
    for (let i = 0; i < cookieArr.length; i++) {
        const [key, val] = cookieArr[i].split('=');
        if (key === name) {
            return decodeURIComponent(val);
        }
    }
    return ''; // Вернуть пустую строку, если куки не найдены
}

function loadSettings() {
    const savedPitch = getCookie('pitch');
    const savedRate = getCookie('rate');
    const savedVolume = getCookie('volume');

    // Устанавливаем значения ползунков
    document.getElementById('pitchControl').value = savedPitch || 1; // Значение по умолчанию
    document.getElementById('rateControl').value = savedRate || 1; // Значение по умолчанию
    document.getElementById('volumeControl').value = savedVolume || 1; // Значение по умолчанию
}

// Загрузка настроек при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});


// Функция обратного отсчёта
const timerIntervals = {};



window.countdown = function (boss, killTime, respawnTime) {
    const timerElement = document.getElementById(`${boss}-timer`);
    
    const bossRow = document.getElementById(`${boss}-row`);
    const bossNameElement = bossRow.querySelector('.boss-name');
    const bossName = bossNameElement ? bossNameElement.textContent : boss;

    if (timerIntervals[boss]) {
        clearInterval(timerIntervals[boss]);
    }

    let fiveMinutesAlerted = false;  // Флаг для 5-минутного предупреждения
    let respawnAlerted = false;      // Флаг для предупреждения о респауне

    timerIntervals[boss] = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = (killTime + respawnTime) - currentTime;

        if (remainingTime <= 0) {
            if (!respawnAlerted) {
                playVoiceMessage(`Монстр ${bossName} возродился!`);
                respawnAlerted = true;  // Устанавливаем флаг, чтобы оповещение проигрывалось только один раз
            }
            clearInterval(timerIntervals[boss]);
            delete timerIntervals[boss];
            resetBoss(boss);
            return;
        }

        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;

        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Предупреждение за 5 минут до респауна
        if (remainingTime <= 300 && !fiveMinutesAlerted) {
            playVoiceMessage(`Монстр ${bossName} возродится через 5 минут.`);
            fiveMinutesAlerted = true;  // Устанавливаем флаг, чтобы оповещение проигрывалось только один раз
        }
    }, 1000);
}

// Функция сброса босса после окончания таймера
//window.resetBoss = function (boss) {
//    const bossRef = ref(database, `bosses/${boss}`);
//
//    set(bossRef, {
//        isAlive: false,
//        respawnTime: 0,
//        killTime: null
//    });
//
//    document.getElementById(`${boss}-timer`).textContent = "00:00:00";
//    document.getElementById(`${boss}-btn`).disabled = false;
//
//    // Сброс флагов для повторного использования
//    fiveMinutesAlerted = false;  // Сбрасываем флаг для 5-минутного предупреждения
//    respawnAlerted = false;      // Сбрасываем флаг для предупреждения о респауне
//}

window.resetBoss = function (boss) {
    const bossRef = ref(database, `bosses/${boss}`);

    // Сбрасываем данные о боссе в базе
    set(bossRef, {
        isAlive: false,
        respawnTime: 0,
        killTime: null
    }).then(() => {
        // Обновляем интерфейс
        document.getElementById(`${boss}-timer`).textContent = "00:00:00";
        document.getElementById(`${boss}-btn`).disabled = false;

        // Очистка текущего таймера
        if (timerIntervals[boss]) {
            clearInterval(timerIntervals[boss]);
            delete timerIntervals[boss]; // Удаляем таймер из объекта
        }
    }).catch((error) => {
        console.error("Ошибка при сбросе босса: ", error);
    });
};

// Слушаем изменения в базе данных и обновляем интерфейс для всех пользователей
bosses.forEach(boss => {
    const bossRef = ref(database, `bosses/${boss}`);
    onValue(bossRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            document.getElementById(`${boss}-btn`).disabled = data.isAlive;
            if (data.isAlive) {
                // Вычисляем оставшееся время до спавна
                const remainingTime = (data.killTime + data.respawnTime) - Math.floor(Date.now() / 1000);
                if (remainingTime > 0) {
                    countdown(boss, data.killTime, data.respawnTime);
                } else {
                    resetBoss(boss); // сбрасываем босса, если время вышло
                }
            } else {
                // Сбрасываем текст таймера, если босс не жив
                document.getElementById(`${boss}-timer`).textContent = "00:00:00";
                // Очищаем таймер, если он существует
                if (timerIntervals[boss]) {
                    clearInterval(timerIntervals[boss]);
                    delete timerIntervals[boss]; // Удаляем таймер из объекта
                }
            }
        }
    });
});




// ФУНКЦИЯ ДЛЯ ПРОВЕРКИ АВТОРИЗАЦИИ

// Проверка сессии на странице таймера
// Функция для проверки авторизации
function checkSessionOnTimerPage() {
    const sessionData = JSON.parse(localStorage.getItem('userSession'));
    const welcomeMessage = document.getElementById('welcomeMessage');
    const authLogName = document.getElementById('auth_log_name');

    if (sessionData) {
        const userLevel = sessionData.level; // Получаем уровень пользователя

        // Проверяем уровень доступа
        if (userLevel === 2) {
            // Пользователь level 2 - доступ только к таймеру
            const now = new Date();
            const expiry = new Date(sessionData.expiryDate);

            // Проверяем, истекла ли подписка для пользователя level 2
            if (now > expiry) {
                // Сессия истекла
                localStorage.removeItem('userSession');
                alert("Ваша подписка истекла. Пожалуйста, авторизуйтесь заново.");
                window.location.href = "auth.html"; // Переход на страницу авторизации
            } else {
                // Сессия активна
                welcomeMessage.textContent = "Добро пожаловать, пользователь!";
                // Обрезаем логин для отображения
                const loginWithoutId = sessionData.login.split('_')[0];
                authLogName.textContent = `Вы авторизовались под: ${loginWithoutId}`; // Отображаем логин без ID
            }
        } else if (userLevel === 1) {
            // Администратор level 1 - доступ к таймеру и панели администратора
            welcomeMessage.textContent = "Добро пожаловать, администратор!";
            // Обрезаем логин для отображения
            const loginWithoutId = sessionData.login.split('_')[0];
            authLogName.textContent = `Ваш логин: ${loginWithoutId}`; // Отображаем логин без ID
            // Здесь можно добавить дополнительные действия для администратора, если необходимо
        } else {
            // Уровень доступа не определен
            alert("Ошибка доступа. Пожалуйста, свяжитесь с администратором.");
            window.location.href = "auth.html"; // Переход на страницу авторизации
        }
    } else {
        // Пользователь не авторизован
        alert("Вы не авторизованы. Пожалуйста, войдите в систему.");
        window.location.href = "auth.html"; // Переход на страницу авторизации
    }
}

// Обработчик события на загрузку страницы
document.addEventListener('DOMContentLoaded', () => {
    checkSessionOnTimerPage(); // Проверка сессии при загрузке страницы таймера
});

// Функция для выхода из системы
function logout() {
    localStorage.removeItem('userSession'); // Удаляем данные сессии
    alert("Вы вышли из системы.");
    window.location.href = "auth.html"; // Переход на страницу авторизации
}

// Обработчик события для кнопки выхода
document.getElementById('logoutButton').addEventListener('click', logout);



// Функция для показа модального окна отмены
window.showCancelDialog = function (boss) {
    const modal = document.getElementById('cancel-dialog');
    modal.style.display = 'block'; // Показываем диалог

    // При подтверждении отмены
    document.getElementById('confirm-cancel-btn').onclick = function () {
        modal.style.display = 'none'; // Закрываем диалог
        performCancelKill(boss); // Выполняем отмену таймера
    };

    // При отказе от отмены
    document.getElementById('deny-cancel-btn').onclick = function () {
        modal.style.display = 'none'; // Просто закрываем диалог
    };
};

// Функция отмены таймера с полной серверной обработкой
window.performCancelKill = function (boss) {
    const bossRef = ref(database, `bosses/${boss}`);

    // Сбрасываем статус босса и удаляем его данные в базе данных
    set(bossRef, {
        isAlive: false,
        respawnTime: 0,
        killTime: null
    }).then(() => {
        // Обновляем интерфейс для всех пользователей
        resetBoss(boss);
    }).catch((error) => {
        console.error("Ошибка при отмене таймера в Firebase: ", error);
    });
};

// Обновляем функцию для вызова диалога перед отменой
window.cancelKill = function (boss) {
    showCancelDialog(boss); // Показываем диалог
};

// РУЧНОЙ ВВОД
window.manualTimeInput = function (boss) {
    const bossButton = document.getElementById(`${boss}-btn`);
    const respawnTime = parseInt(bossButton.getAttribute('onclick').match(/startTimer\('.*?', (\d+)\)/)[1]);

    if (bossButton.disabled) {
        alert("Этот босс уже убит. Пожалуйста, дождитесь его респавна.");
        return;
    }

    const modal = document.getElementById('timeModal');
    modal.style.display = 'flex';

    const confirmInputBtn = document.getElementById('confirm-input-btn');
    const resetInputBtn = document.getElementById('reset-input-btn');
    const cancelInputBtn = document.getElementById('cancel-input-btn');
    const hoursInput = document.getElementById('hours-input');
    const minutesInput = document.getElementById('minutes-input');
    const secondsInput = document.getElementById('seconds-input');

    // Функция для ограничения ввода в поля
    function restrictInput(inputElement, maxValue) {
        inputElement.addEventListener('input', function () {
            if (this.value > maxValue) {
                this.value = maxValue;
            }
        });
    }

    // Применяем ограничение для каждого поля ввода
    restrictInput(hoursInput, 23);
    restrictInput(minutesInput, 59);
    restrictInput(secondsInput, 59);

    confirmInputBtn.onclick = function () {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
            alert("Введите корректные значения времени. Часы (0-23), минуты и секунды (0-59).");
            return;
        }

        if (hours === 0 && minutes === 0 && seconds === 0) {
            alert("Введите корректные значения времени.");
            return;
        }

        const now = new Date();
        const bossDeathTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);

        if (bossDeathTime > now) {
            alert("Время убивания босса не может быть в будущем.");
            return;
        }

        const elapsedSeconds = Math.floor((now - bossDeathTime) / 1000);
        const remainingSeconds = respawnTime - elapsedSeconds;

        if (remainingSeconds < 0) {
            alert("Босс уже возродился. Пожалуйста, проверьте ввод.");
            return;
        }

        // Запускаем таймер
        startTimer(boss, remainingSeconds);
        bossButton.disabled = true;
        modal.style.display = 'none';
    };

    resetInputBtn.onclick = function () {
        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';
        hoursInput.focus();
    };

    cancelInputBtn.onclick = function () {
        modal.style.display = 'none';
    };

    modal.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            confirmInputBtn.click();
        }
    });

    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    hoursInput.focus();
};



/// ФИЛЬТР БОССОВ И ЭЛИТ

const sessionData = JSON.parse(localStorage.getItem('userSession'));
const userId = sessionData ? sessionData.login : null;

// Функция для открытия модального окна
function openSettings() {
    document.getElementById('boss-settings-modal').style.display = 'block';
    loadBossSettings();
}

// Закрытие модального окна (если необходимо)
function closeModal() {
    document.getElementById('boss-settings-modal').style.display = 'none';
}

// Загрузка настроек боссов для текущего пользователя
function loadBossSettings() {
    if (!userId) return;

    // Ссылка на скрытые боссы пользователя в Firebase
    const userRef = ref(database, `contact_data/user/${userId}/hiddenBosses`);

    // Очистка списка перед генерацией
    const bossListElement = document.getElementById('boss-list');
    bossListElement.innerHTML = '';

    // Получение скрытых боссов из Firebase
    onValue(userRef, (snapshot) => {
        const hiddenBosses = snapshot.val() || [];

        // Генерация чекбоксов для каждого босса
        bosses.forEach(boss => {
            const bossRow = document.getElementById(`${boss}-row`);
            if (bossRow) {
                const bossName = bossRow.querySelector('.boss-name').textContent.trim(); // Имя босса на русском
                const bossImage = bossRow.querySelector('.boss-icon').src; // Путь к изображению босса
                const isChecked = hiddenBosses.includes(boss);

                const checkbox = `
                <label>
                    <input type="checkbox" name="boss" value="${boss}" ${isChecked ? 'checked' : ''}>
                    <img src="${bossImage}" width="30" height="30" style="vertical-align: middle; margin-right: 5px;"> ${bossName}
                </label><br>
                `;

                bossListElement.insertAdjacentHTML('beforeend', checkbox);
            }
        });
    });
}

// Сохранение настроек
function saveBossSettings(e) {
    e.preventDefault();

    if (!userId) return;

    // Получение всех отмеченных чекбоксов
    const checkedBosses = Array.from(document.querySelectorAll('input[name="boss"]:checked'))
        .map(input => input.value);

    // Сохранение скрытых боссов в Firebase
    set(ref(database, `contact_data/user/${userId}/hiddenBosses`), checkedBosses)
        .then(() => {
            alert('Настройки успешно сохранены.');
            closeModal();
            applyHiddenBosses(checkedBosses); // Применить изменения сразу на странице
        })
        .catch((error) => {
            console.error('Ошибка при сохранении настроек:', error);
        });
}

// Применение скрытых боссов на странице
function applyHiddenBosses(hiddenBosses) {
    bosses.forEach(boss => {
        const bossRow = document.querySelector(`#${boss}-row`); // Найти строку босса по ID
        if (bossRow) {
            bossRow.style.display = hiddenBosses.includes(boss) ? 'none' : ''; // Скрыть/показать
        }
    });
}

// Загрузка скрытых боссов при старте
function loadUserHiddenBosses() {
    if (!userId) return;

    const userRef = ref(database, `contact_data/user/${userId}/hiddenBosses`);
    onValue(userRef, (snapshot) => {
        const hiddenBosses = snapshot.val() || [];
        applyHiddenBosses(hiddenBosses);
    }); 
}

// Подключение обработчиков событий при загрузке документа
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('settings-boss-btn').addEventListener('click', openSettings);
    document.getElementById('boss-settings-form').addEventListener('submit', saveBossSettings);

    // Закрытие модального окна при клике вне его
    window.onclick = function (event) {
        if (event.target == document.getElementById('boss-settings-modal')) {
            closeModal();
        }
    };

    // Загрузка скрытых боссов при старте
    loadUserHiddenBosses();
});



//ФУНКЦИЯ ПОИСКА БОССОВ

export function filterBosses() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('bossTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Начинаем с 1, чтобы пропустить заголовок
        const bossName = rows[i].getElementsByClassName('boss-name')[0];
        if (bossName) {
            const txtValue = bossName.textContent || bossName.innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                rows[i].style.display = ''; // Показываем строку
            } else {
                rows[i].style.display = 'none'; // Скрываем строку
            }
        }
    }
}

// Если вы хотите вызвать эту функцию в HTML, убедитесь, что она глобальна
window.filterBosses = filterBosses;



