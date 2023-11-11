document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('myModal');
    var openModalButton = document.getElementById('openModalBtn');
    var closeModalSpan = document.getElementsByClassName('svg-cross')[0];
  
    openModalButton.onclick = function () {
      modal.style.display = 'block';
    };
  
    closeModalSpan.onclick = function () {
      modal.style.display = 'none';
    };
  });

document.getElementById("SellForm").addEventListener("submit", function (event) {
            event.preventDefault();
            // Получаем форму
            const form = event.target;

            // Создаем объект FormData для сбора данных из формы
            const formData = new FormData(form);

            // Здесь вы можете добавить дополнительные действия перед отправкой данных, если необходимо

            // Отправляем данные на сервер с использованием fetch, например
            fetch("/sell_inventory", {
                method: "POST",
                body: formData
            })
            .then(response => {
                // Обработка ответа от сервера
                if (response.ok) {
                    //document.getElementById("modalWindow").style.display="none"
                    location.reload()
                } else {
                    alert("Ошибка при обращении к базе")
                }
            })
            .catch(error => {
                alert("Ошибка при обращении к базе")
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
            const rented = event.target.rented.checked;
            const size = event.target.size.value;

            const table = document.querySelector("table");
            const newRow = table.insertRow(table.rows.length);
            const cells = [newRow.insertCell(0), newRow.insertCell(1), newRow.insertCell(2), newRow.insertCell(3), newRow.insertCell(4), newRow.insertCell(5)];

            const id = table.rows.length
            cells[0].innerText = name;
            cells[1].innerText = typetext;
            cells[2].innerText = rented;
            cells[3].innerText = size;
            var button = document.createElement("button");
            button.textContent = "Продать"
            
            button.onclick = Sell(id)
            cells[4].appendChild(button)
            var button = document.createElement("button");
            button.textContent = "Удалить"
            button.onclick = Delete(id)
            cells[5].appendChild(button)

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