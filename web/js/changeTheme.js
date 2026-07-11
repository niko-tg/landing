import { startShake, animateRainbow } from './disco.js';

const themes = [
  { text: 'Dark blue', value: 'dark-blue.css' },
  { text: 'Neon', value: 'neon.css' },
  { text: 'Cyberpunk', value: 'cyberpunk.css' },
  { text: 'Moon', value: 'moon.css' },
  { text: 'Light', value: 'light.css' },
  { text: 'DISCO (don\'t choose)', value: 'light.css', type: 'disco' },
];

const defaultTheme = 'dark-blue.css';

const startdisco = () => {
  try {
    // Создаём аудио
    const audio = new Audio('resources/audio/loop/chipi-chipi-chapa-chapa.mp3');
    audio.loop = true;

    // Автоматическое воспроизведение
    audio.play().catch(err => {
      console.warn('Автовоспроизведение заблокировано браузером', err);
    })
  }
  catch (e) {
    console.warn(e);
  }

  // Включаем поддержку переменной в transform
  const style = document.createElement('style');
  style.textContent = `
    body * {
      transform: var(--shake-transform, none) translateZ(0);
    }
  `
  document.head.appendChild(style);

  startShake(2);
  animateRainbow();
}

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('dropdown');

  // Предварительная загрузка всех тем
  themes.forEach(theme => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/css/themes/' + theme.value;
    preloadLink.as = 'style';
    document.head.appendChild(preloadLink);
  });

  // Добавление тега <link>, если его нет
  let themeLink = document.getElementById("theme-link");
  if (!themeLink) {
    themeLink = document.createElement("link");
    themeLink.id = "theme-link";
    themeLink.rel = "stylesheet";
    document.head.appendChild(themeLink);
  }

  themes.forEach(optionData => {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.textContent = optionData.text;
    dropdown.appendChild(option);
  });

  // Если тема не задана или была удалена — ставим основную
  let themInStorage = localStorage.getItem('theme');

  if (!themes.some(theme => theme.value === themInStorage)) {
    themInStorage = defaultTheme;
  }

  // Применяем полученную тему
  themeLink.href = '/css/themes/' + themInStorage;
  localStorage.setItem('theme', themInStorage);

  dropdown.selectedIndex = themes.findIndex(theme => theme.value === themInStorage);

  dropdown.addEventListener('change', function() {
    const theme = dropdown.options[dropdown.selectedIndex].value;
    const type = themes[dropdown.selectedIndex]?.type;

    themeLink.href = '/css/themes/' + theme;

    // Сохранение темы в локальное хранилище
    localStorage.setItem('theme', theme);

    if (type === 'disco') {
      console.log('Started Disco');
      startdisco();
    }
  });
})
