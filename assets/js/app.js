document.addEventListener('DOMContentLoaded', function () {
    // Установим темную тему по умолчанию
    const body = document.body;
    const toggleButton = document.getElementById('theme-toggle'); // Кнопка для переключения тем вне модального окна
    const toggleButtonModal = document.getElementById('theme-toggle-modal'); // Кнопка для переключения тем внутри модального окна
    const modal = document.getElementById('modal-settings'); // Модальное окно
    const modalContent = document.querySelector('.modal-content'); // Содержимое модального окна
    let isDarkTheme = true; // Тёмная тема по умолчанию

    // Функция применения темы
    function applyTheme() {
        if (isDarkTheme) {
            body.classList.add('dark-theme');
            toggleButton.textContent = "Смена на светлую тему";
            toggleButtonModal.textContent = "Смена на светлую тему";
            toggleButton.style.backgroundColor = "#235347"; // Цвет для тёмной темы
            toggleButton.style.color = "#fff"; // Цвет текста для темной темы
            toggleButtonModal.style.color = "#fff"; // Цвет текста для темной темы
            toggleButtonModal.style.backgroundColor = "#235347";
        } else {
            body.classList.remove('dark-theme');
            toggleButton.textContent = "Смена на тёмную тему";
            toggleButtonModal.textContent = "Смена на тёмную тему";
            toggleButton.style.backgroundColor = "#DAF1DE"; // Цвет для светлой темы
            toggleButton.style.color = "#000"; // Цвет текста для светлой темы
            toggleButtonModal.style.color = "#000"; // Цвет текста для светлой темы
            toggleButtonModal.style.backgroundColor = "#DAF1DE";
        }
    }

    // Функция для переключения темы
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        applyTheme();
    }

    // Применим начальную тему при загрузке страницы
    applyTheme();

    // Привязка функции к кнопке переключения темы вне модального окна
    toggleButton.addEventListener('click', toggleTheme);

    // Привязка функции к кнопке переключения темы внутри модального окна
    toggleButtonModal.addEventListener('click', toggleTheme);

    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function (event) {
        if (event.target === modal) {  // Если клик произошёл на область модального окна (фона)
            closeSettings();
        }
    });

    // Анимация цветов GELIOS
    const letters = document.querySelectorAll("#animatedText span");
    const colorSet = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFBD33', '#9D33FF']; // Набор цветов

    function getRandomColor() {
        return colorSet[Math.floor(Math.random() * colorSet.length)];
    }

    function animateLetters() {
        letters.forEach((letter, index) => {
            setInterval(() => {
                letter.style.color = getRandomColor(); // Присваиваем случайный цвет
            }, 500 + index * 100);  // Цвет меняется каждые полсекунды с задержкой для каждой буквы
        });
    }

    animateLetters();   
});

// Переопределяем стандартный alert
document.addEventListener("DOMContentLoaded", function() {
    // Переопределяем стандартный alert
    window.alert = function(message) {
        document.getElementById('alertMessage').innerText = message;
        document.getElementById('customAlert').style.display = 'flex';
    };

    // Обработка нажатия кнопки OK
    document.getElementById('alertOkButton').onclick = function() {
        document.getElementById('customAlert').style.display = 'none';
    };
});

// Функция открытия настроек (модальное окно)
function openSettings() {
    document.getElementById("modal-settings").style.display = "block";
}

// Функция закрытия настроек (модальное окно)
function closeSettings() {
    document.getElementById("modal-settings").style.display = "none";
}
