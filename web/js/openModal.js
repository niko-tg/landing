/**
 * Закрывает модальное окно с изображением
 */
const closeModal = () => {
  const modal = document.getElementById("screenshotModal")
  if (modal) {
    modal.style.display = "none"
  }
  document.body.classList.remove("no-scroll")
}

/**
 * Открывает модальное окно с изображением
 * @param {HTMLImageElement} img - Изображение для отображения в модальном окне
 */
const openModal = (img) => {
  const modal = document.getElementById("screenshotModal")
  const modalImg = document.getElementById("modalImage")
  const span = document.getElementById("closeModal")
  const body = document.body

  // Отключаем прокрутку страницы
  body.classList.add("no-scroll")

  // Устанавливаем изображение и показываем модальное окно
  modal.style.display = "flex"
  modalImg.src = img.src
  modalImg.alt = img.alt || "Увеличенное изображение"

  // Закрытие модального окна при клике на крестик
  span.onclick = closeModal

  // Закрытие модального окна при клике вне изображения
  window.onclick = (event) => {
    if (event.target === modal) {
      closeModal()
    }
  }
}

// Добавляем обработчик для всех изображений с классом screenshot
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("screenshot")) {
      openModal(event.target)
    }
  })

  // Закрытие модального окна по Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal()
    }
  })
})
