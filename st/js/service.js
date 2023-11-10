document.addEventListener("DOMContentLoaded", function() {
    const saveButton = document.querySelector(".create-service button");

    saveButton.addEventListener("click", function() {
        // Получите данные из полей вручную
        const creating_date = document.querySelector('input[name="creating_date"]').value;
        const clients = document.querySelector('select[name="clients"]').value;
        const inventory = document.querySelector('select[name="inventory"]').value;
        const task = document.querySelector('input[name="task"]').value;
        const parts = document.querySelector('input[name="parts"]').value;
        const cost = document.querySelector('input[name="cost"]').value;
        const ispayed = document.querySelector('input[name="ispayed"]').checked;

        // Соберите данные в объект
        const data = {
            creating_date: creating_date,
            clients: clients,
            inventory: inventory,
            task: task,
            parts: parts,
            cost: cost,
            ispayed: ispayed
        };

        // Отправьте данные на сервер с использованием Fetch API
        fetch("/service_create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                // Обработка успешной отправки данных
                console.log("Данные успешно отправлены на сервер.");
            } else {
                // Обработка ошибки отправки данных
                console.error("Ошибка при отправке данных на сервер.");
            }
        })
        .catch(error => {
            console.error("Произошла ошибка: " + error);
        });
    });
});

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