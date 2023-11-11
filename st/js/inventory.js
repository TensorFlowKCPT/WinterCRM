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
function openModalSell(itemId) {
    // Set the value of the hidden input field in the form
    document.getElementById('idinventory').value = itemId;

    // Display the modal
    document.getElementById('ModalSell').style.display = 'flex';
  }

  document.getElementById('ModalSell').addEventListener('click', function (e) {
    if (e.target === this) {
      this.style.display = 'none';
    }
  });

  document.getElementById("SellForm").addEventListener("submit", function (event) {
    event.preventDefault();
    // Получаем форму
    const form = event.target;

    // Создаем объект FormData для сбора данных из формы
    const formData = new FormData(form);

    // Отправляем данные на сервер с использованием fetch, например
    fetch("/sell_inventory", {
        method: "POST",
        body: formData
    })
    .then(response => {
        // Обработка ответа от сервера
        if (response.ok) {
            // Close the modal after successful submission
            document.getElementById('ModalSell').style.display = 'none';
            location.reload();  // or perform other actions as needed
        } else {
            alert("Ошибка при обращении к базе");
        }
    })
    .catch(error => {
        alert("Ошибка при обращении к базе");
    });
  });
function Sell(id){
    const Modal = document.getElementById("Modal")
    Modal.style.display="block"
    console.log(id)
    const idinventoryInput = Modal.querySelector('input[name="idinventory"]');
    idinventoryInput.value = id;
}
function Delete(btnid) {
    fetch("/del-inventory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: btnid })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Ошибка HTTP: " + response.status);
        }
    })
    .then(data => {
        // Обработка данных после успешного запроса
        console.log("Успешно удалено", data);
        document.getElementById(btnid).remove();
    })
    .catch(error => {
        console.error("Ошибка при отправке запроса:", error);
    });
}
document.getElementById("addItemForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = event.target.name.value;
    const type = event.target.type.value;
    const typetext = event.target.type.options[event.target.type.selectedIndex].text;
    const rented = document.getElementById("rentedCheck").checked
    const size = document.getElementById("sizeInv").value;

    const table = document.querySelector("table");
    const newRow = table.insertRow(table.rows.length);
    const cells = [
        newRow.insertCell(0),
        newRow.insertCell(1),
        newRow.insertCell(2),
        newRow.insertCell(3),
        newRow.insertCell(4),
        newRow.insertCell(5)
    ];

    const id = table.rows.length;
    cells[0].innerText = name;
    cells[1].innerText = typetext;
    cells[2].innerText = rented;
    cells[3].innerText = size;

    // Создайте кнопку "Продать"
    var sellButton = document.createElement("button");
    sellButton.textContent = "Продать";

    // Назначьте обработчик события для кнопки "Продать"
    sellButton.onclick = function() {
        Sell(id);
    };

    // Добавьте кнопку в ячейку 4
    cells[4].appendChild(sellButton);

    // Создайте кнопку "Удалить"
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";

    // Назначьте обработчик события для кнопки "Удалить"
    deleteButton.onclick = function() {
        Delete(id);
    };

    // Добавьте кнопку в ячейку 5
    cells[5].appendChild(deleteButton);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("rented", rented);
    formData.append("size", size);

    fetch("/inventory", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .catch(error => {
        console.error("Ошибка при отправке запроса:", error);
    });

    event.target.reset();
    });

    function openModalSell() {
        document.getElementById('ModalSell').style.display = 'flex';
      }
    
      document.getElementById('ModalSell').addEventListener('click', function (e) {
        if (e.target === this) {
          this.style.display = 'none';
        }
      });