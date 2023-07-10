export function getModal(callButton, modalContent) {

  //Создание основной структуры модального окна
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

  //Логика работы модального окна
  callButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

}