//3д эффект
// выбираем все контейнеры, в которых нужен эффект
const containers = document.querySelectorAll('.screenshotContainer, .effektContainer');

containers.forEach(container => {
  // внутри контейнера найдём элементы, которым дать tilt
  const items = container.querySelectorAll('.screenshotImg, .businessCard');
  if (!items.length) return; // если ничего нет — пропускаем

  // слушаем движение мыши по конкретному контейнеру
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // базовая сила наклона — при необходимости подкорректируй делитель
    const baseRotateX = (y - centerY) / 35;
    const baseRotateY = (centerX - x) / 35;

    items.forEach(item => {
      // можно настроить интенсивность для каждого элемента через data-depth (напр. data-depth="1.2")
      const depth = parseFloat(item.dataset.depth) || 1;
      const rotateX = baseRotateX * depth;
      const rotateY = baseRotateY * depth;
      const scale = 1 + 0.05 * depth; // чуть увеличиваем глубже лежащие элементы

      item.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    });
  });

  // при уходе мыши — возвращаем элементы в исходное состояние
  container.addEventListener('mouseleave', () => {
    items.forEach(item => {
      item.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
});

// Находим все карточки, которые должны быть кликабельными
const cards = document.querySelectorAll('.businessCard');
const logoLink = document.querySelectorAll('.logo');
const projectLink = document.querySelectorAll('.projectWindow');

cards.forEach(card => {
  card.addEventListener('click', () => {
    // Задай нужный адрес
    window.location.href = 'about.html';
  });
});

logoLink.forEach(card => {
  card.addEventListener('click', () => {
    // Задай нужный адрес
    window.location.href = 'index.html';
  });
});

// storytelling
const scenes = document.querySelectorAll('.scene');
let currentScene = 0;
let isAnimating = false;

// функция переключения сцен
function showScene(index, direction = 1) {
  if (isAnimating) return;
  if (index < 0 || index >= scenes.length) return;

  isAnimating = true;

  const prev = scenes[currentScene];
  const next = scenes[index];

  // выход текущей сцены
  gsap.to(prev, {
    opacity: 0,
    scale: 0.9,
    y: direction * -100,
    duration: 0.8,
    ease: "power3.inOut"
  });

  // вход новой сцены
  gsap.fromTo(
    next,
    {
      opacity: 0,
      scale: 1.1,
      y: direction * 100
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.inOut",
      delay: 0.1,
      onComplete: () => {
        isAnimating = false;
      }
    }
  );

  prev.classList.remove('active');
  next.classList.add('active');

  currentScene = index;
}

/////////////////////////////////////////////////////
// SCROLL МЫШКОЙ
/////////////////////////////////////////////////////

let scrollTimeout;

window.addEventListener("wheel", (e) => {

  if (isAnimating) return;

  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {

    if (e.deltaY > 0) {
      if (currentScene < scenes.length - 1) {
        showScene(currentScene + 1, 1);
      }
    } else {
      if (currentScene > 0) {
        showScene(currentScene - 1, -1);
      }
    }

  }, 50);
});

/////////////////////////////////////////////////////
// СВАЙП ПАЛЬЦЕМ
/////////////////////////////////////////////////////

let touchStartY = 0;
let touchEndY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener("touchend", (e) => {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {

  const threshold = 50;
  const diff = touchStartY - touchEndY;

  if (Math.abs(diff) < threshold) return;

  // свайп вверх
  if (diff > 0) {
    if (currentScene < scenes.length - 1) {
      showScene(currentScene + 1, 1);
    }
  }

  // свайп вниз
  else {
    if (currentScene > 0) {
      showScene(currentScene - 1, -1);
    }
  }

}

/////////////////////////////////////////////////////
// КЛАВИАТУРА
/////////////////////////////////////////////////////

document.addEventListener("keydown", (e) => {

  if (isAnimating) return;

  if (e.key === "ArrowDown") {
    if (currentScene < scenes.length - 1) {
      showScene(currentScene + 1, 1);
    }
  }

  if (e.key === "ArrowUp") {
    if (currentScene > 0) {
      showScene(currentScene - 1, -1);
    }
  }

});

// Колёсико мыши управляет переходом
window.addEventListener('wheel', (e) => {
  if (isAnimating) return;

  if (e.deltaY > 0 && currentScene < scenes.length - 1) {
    showScene(currentScene + 1, 1);
  } else if (e.deltaY < 0 && currentScene > 0) {
    showScene(currentScene - 1, -1);
  }
});

// (Опционально) навигация стрелками
window.addEventListener('keydown', (e) => {
  if (e.key === "ArrowDown" && currentScene < scenes.length - 1) {
    showScene(currentScene + 1, 1);
  }
  if (e.key === "ArrowUp" && currentScene > 0) {
    showScene(currentScene - 1, -1);
  }
});

//скрипт для скачивания
document.getElementById('download-btn').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'downloadFiles/Lebenslauf_Sharyi_Vladjislav(1).pdf'; // путь к файлу
    link.download = 'CV Sharyi Vladyislav';   // имя файла при скачивании
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

function copyText(el) {
  navigator.clipboard.writeText(el.innerText)
    .then(() => {
      showPopup(); // показываем уведомление
    })
    .catch(err => console.error("Ошибка копирования:", err));
}

function showPopup() {
  const popup = document.getElementById("copy-popup");
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 1500);
}

//Кнопка на копию Email'а 
const button = document.getElementById('copyEmailBtn');
const email = 'vladjislavdesign@gmail.com'; // ← сюда вставь свой email

button.addEventListener('click', async () => {
  try {
    // Копируем email в буфер обмена
    await navigator.clipboard.writeText(email);

    // Меняем контент кнопки
    button.innerHTML = 'Email copied!';

    // Добавляем временный класс для визуального эффекта (по желанию)
    button.classList.add('copied');

    // Через 2 секунды возвращаем иконку обратно
    setTimeout(() => {
      button.innerHTML = '<img class="downloadIco" src="./img/emailIco.png" alt="email icon">';
      button.classList.remove('copied');
    }, 2000);

  } catch (err) {
    console.error('Ошибка при копировании:', err);
  }
});

//анимашка для расскрытия FAQ
