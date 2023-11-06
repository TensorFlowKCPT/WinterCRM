function formatClientCount(count) {
    if (count % 10 === 1 && count % 100 !== 11) {
        return count + " клиент";
    } else if (2 <= count % 10 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        return count + " клиента";
    } else {
        return count + " клиентов";
    }
}

function openModal() {
    madal = document.getElementById('myModal');
    modal.style.display = 'block';
}

function closeModal() {
    modal = document.getElementById('myModal');
    modal.style.display = 'none';
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

                const clientsCountElement = document.getElementById('clientsCount')
                const currentCount = parseInt(clientsCountElement.textContent, 10)+1;
                clientsCountElement.textContent = formatClientCount(currentCount)

                var modal = document.getElementById('myModal');
                closeModal(modal)
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
        } else {
          console.error("Ошибка удаления объекта.");
        }
      })
      .catch(error => {
        console.error("Ошибка сети: " + error);
      });
    }
  });