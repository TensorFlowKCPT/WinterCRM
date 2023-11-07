function openModal() {
        document.getElementById("myModal").style.display = "flex";
      }

      function closeModal() {
        document.getElementById("myModal").style.display = "none";
      }

      // Находим элементы по их id
      const createButton = document.getElementById("create-rent");
      const modalWindow = document.querySelector(".create-newrent");

      // Добавляем обработчик события на кнопку "Создать"
      createButton.addEventListener("click", function () {
        // Проверяем текущее состояние отображения модального окна
        if (
          modalWindow.style.display === "none" ||
          modalWindow.style.display === ""
        ) {
          // Если оно скрыто, показываем модальное окно
          modalWindow.style.display = "block";
        } else {
          // Иначе, скрываем модальное окно
          modalWindow.style.display = "none";
        }
      });