// Для логики при нажати кнопки
document.addEventListener("DOMContentLoaded", function () {
  const addItemButton = document.getElementById("addItemButton");
  const itemSelect = document.getElementById("itemSelect");
  const selectedItems = document.getElementById("selectedItems");
  const itemInfoContainer = document.getElementById("itemInfoContainer");

  // Обработчик нажатия на кнопку "Добавить"
  addItemButton.addEventListener("click", function () {
    const selectedItem = itemSelect.value;

    if (selectedItem) {
      const listItem = document.createElement("li");
      listItem.textContent = selectedItem;
      selectedItems.appendChild(listItem);

      // Добавьте информацию о товаре в информационный контейнер
      const itemInfo = document.createElement("div");
      itemInfo.textContent = "Информация о " + selectedItem;
      itemInfoContainer.innerHTML = "";
      itemInfoContainer.appendChild(itemInfo);
    }
  });

  // Обработчик выбора элемента из списка
  itemSelect.addEventListener("change", function () {
    const selectedItem = itemSelect.value;

    if (selectedItem) {
      // Добавьте информацию о товаре в информационный контейнер
      const itemInfo = document.createElement("div");
      itemInfo.textContent = "Информация о " + selectedItem;
      itemInfoContainer.innerHTML = "";
      itemInfoContainer.appendChild(itemInfo);
    }
  });
});

// Для первой модального окна
document.getElementById("openModalButton").addEventListener("click", function() {
    document.querySelector(".modal-container").style.display = "flex";
    document.querySelector(".modal").style.display = "block";
});

document.querySelectorAll(".close").forEach(function(element) {
    element.addEventListener("click", function() {
        document.querySelector(".modal-container").style.display = "none";
        document.querySelector(".modal").style.display = "none";
    });
});

// Для первой модального окна
document.getElementById("addItemButton").addEventListener("click", function() {
    document.querySelector(".modal-container-2").style.display = "flex";
    document.querySelector(".modal2").style.display = "block";
});

document.querySelectorAll(".close2").forEach(function(element) {
    element.addEventListener("click", function() {
        document.querySelector(".modal-container-2").style.display = "none";
        document.querySelector(".modal2").style.display = "none";
    });
});

// Взято из clients.js
function formatClientCount(count) {
    if (count % 10 === 1 && count % 100 !== 11) {
        return count + " клиент";
    } else if (2 <= count % 10 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        return count + " клиента";
    } else {
        return count + " клиентов";
    }
}

// Функция для обновления массива rows
function updateRows() {
    rows = Array.from(tbody.querySelectorAll("tr")).slice(1);
    return rows
}

document.getElementById("addItemForm").addEventListener("submit", function (event) {
            event.preventDefault();

            const Fio = event.target.FIO.value;
            const Passport = event.target.Passport.value;
            const PhoneNumber = event.target.PhoneNumber.value;

            const table = document.querySelector("table");
            const newRow = table.insertRow(table.rows.length);
            const cells = [newRow.insertCell(0), newRow.insertCell(1), newRow.insertCell(2), newRow.insertCell(3), newRow.insertCell(4)];

            cells[0].classList.add("table-colon");
            cells[1].classList.add("table-colon");
            cells[1].classList.add("table-colon2");
            cells[2].classList.add("table-colon");
            cells[3].classList.add("table-colon");
            cells[4].classList.add("table-colon");

            const button = document.createElement("button");
            button.classList.add('delete-button')
            button.innerText = 'Удалить'
            cells[3].appendChild(button)

            const checkbox = document.createElement("input")
            checkbox.type = 'checkbox'
            checkbox.classList.add('select-checkbox')
            cells[4].appendChild(checkbox)

            cells[0].innerText = Fio;
            cells[1].innerText = Passport;
            cells[2].innerText = PhoneNumber;

            const formData = new FormData();
            formData.append("FIO", Fio);
            formData.append("Passport", Passport);
            formData.append("PhoneNumber", PhoneNumber);

            fetch("/add_client", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                const newId = data.id
                button.setAttribute('data-id', newId);
                checkbox.setAttribute('data-id', newId);
                newRow.setAttribute('data-id', newId);

                const clientsCountElement = document.getElementById('clientsCount')
                const currentCount = parseInt(clientsCountElement.textContent, 10)+1;
                clientsCountElement.textContent = formatClientCount(currentCount)

                var modal = document.getElementById('myModal');
                closeModal(modal)
                updateRows()
            })
            .catch(error => {
                console.error("Ошибка при отправке запроса:", error);
            });


            event.target.reset();
        });


var modal = document.getElementById('myModal');
var openModalBtn = document.getElementById('openModalBtn');
var closeModalBtn = document.getElementById('closeModalBtn');

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);


window.addEventListener('click', function (event) {
    if (event.target === modal) {
        closeModal();
    }
});


window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Назначить обработчик события на родительский элемент, который существует на момент загрузки страницы
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button')) {
      const button = event.target;
      const objectId = button.getAttribute("data-id");
  
      fetch(`/del_client`, {
        method: "DELETE",
        body: JSON.stringify({ id: objectId }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          button.closest("tr").remove();
  
          // Обновить счетчик клиентов
          const clientsCountElement = document.getElementById('clientsCount');
          const currentCount = parseInt(clientsCountElement.textContent, 10) - 1;
          clientsCountElement.textContent = formatClientCount(currentCount);
          updateRows()
        } else {
          console.error("Ошибка удаления объекта.");
        }
      })
      .catch(error => {
        console.error("Ошибка сети: " + error);
      });
    }
  });

  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === "deleteSelected") {
      const selectedCheckboxes = document.querySelectorAll(".select-checkbox:checked");
  
      if (selectedCheckboxes.length > 0) {
        const idsToDelete = Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute("data-id"));
  
        // Отправка запроса на сервер для удаления выбранных объектов
        fetch("/del_selected_clients", {
          method: "POST",
          body: JSON.stringify({ ids: idsToDelete }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              // Успешно удалено, обновите интерфейс
              idsToDelete.forEach(id => {
                const rowToDelete = document.querySelector(`tr[data-id="${id}"]`);
                console.log(rowToDelete)
                if (rowToDelete) {
                  rowToDelete.remove();
                }
                updateRows();
              });
  
              const clientsCountElement = document.getElementById('clientsCount');
              const currentCount = parseInt(clientsCountElement.textContent, 10) - idsToDelete.length;
              clientsCountElement.textContent = formatClientCount(currentCount);
            } else {
              console.error("Ошибка удаления объектов.");
            }
          })
          .catch(error => {
            console.error("Ошибка сети: " + error);
          });
      } else {
        console.log("Нет выбранных объектов для удаления.");
      }
    }
  });

  document.querySelector(".clients__search-input").addEventListener("input", function () {
    var searchInput = this.value.toLowerCase();
    var rows = document.querySelectorAll("tbody tr");
    
    for (var i = 1; i < rows.length; i++) {  // Начинаем с 1, чтобы пропустить строку с заголовками
        var cells = rows[i].querySelectorAll(".table-colon");
        var match = false;
        
        for (var j = 0; j < cells.length; j++) {
            var cellContent = cells[j].textContent.toLowerCase();
            if (cellContent.indexOf(searchInput) !== -1) {
                match = true;
                break;
            }
        }
        
        if (match) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
});
// СОРТИРОВКА
const sortSelect = document.getElementById("sortirovka-filter");
const tbody = document.querySelector("tbody");

sortSelect.addEventListener("change", function () {
    sortTable(updateRows());
});

function sortTable(rowss) {
    const sortBy = sortSelect.value;
    rows = rowss
    rows.sort((a, b) => {
        const aText = a.querySelector(".table-colon").textContent.toLowerCase();
        const bText = b.querySelector(".table-colon").textContent.toLowerCase();

        if (sortBy === "name") {
            return aText.localeCompare(bText);
        } else if (sortBy === "surname") {
            const aSurname = aText.split(" ")[0];
            const bSurname = bText.split(" ")[0];
            return aSurname.localeCompare(bSurname);
        } else if (sortBy === "lastname") {
            const aLastname = aText.split(" ")[2] || "";
            const bLastname = bText.split(" ")[2] || "";
            return aLastname.localeCompare(bLastname);
        }

        return 0;
    });

    tbody.innerHTML = "";
    rows.forEach((row) => {
        tbody.appendChild(row);
    });
}

