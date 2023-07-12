export function getModal(callButton, modalContent) {

  /* Создание основной структуры модального окна */

  const modal = document.createElement("div");
  const modalContentWrapper = document.createElement("div");
  const closeButton = document.createElement("span");

  modal.classList.add('modal');

  modalContentWrapper.classList.add("modal-content-wrapper");

  closeButton.classList.add('close');
  closeButton.innerHTML = '&times;';

  callButton.after(modal);
  modal.append(modalContentWrapper);
  modalContentWrapper.append(closeButton);
  modalContentWrapper.append(modalContent);

  /* Логика работы модального окна */
  callButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });


  /* Закрытие модалки по клику вокруг окна */
  let overlayChecker = false;

  window.addEventListener('mousedown', function (event) {
    /**
    * Проверяем было ли нажатие над вокруг modal,
    * и отмечаем это в переменной overlayChecker
    */
    if (event.target == modal) {
      overlayChecker = true;
    };
  });

  window.addEventListener('mouseup', async function (event) {
    /**
    * Проверяем было ли отпускание мыши вокруг modal,
    * и если нажатие тоже было на нём, то закрываем окно
    * и обнуляем overlayChecker
    */
    if (overlayChecker && (event.target == modal)) {
      modal.style.display = "none";
    }
    overlayChecker = false;
  });
}