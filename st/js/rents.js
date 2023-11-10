// При нажатии 

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
      const listItem = document.createElement("div");
      listItem.textContent = selectedItem;
      selectedItems.appendChild(listItem);

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

document.addEventListener('DOMContentLoaded', function () {
  var rows = document.getElementsByClassName('list_content');

  for (var i = 0; i < rows.length; i++) {
    rows[i].addEventListener('click', function () {
      var info = JSON.parse(this.dataset.info.replace(/'/g, '"'))
      var productName = info.Name;
      var productId = info.ID;
      
      // Создание новой строки в таблице с добавлением атрибута id_inventory
      var tableInventory = document.querySelector('.table__inventory');
      var element = document.createElement('tr');
      var btn = document.createElement('button');
      btn.textContent = "Удалить";
      
      // Добавление обработчика событий для кнопки "Удалить"
      btn.addEventListener('click', function() {
        // Удаление родительского tr
        tableInventory.removeChild(element);

        document.querySelectorAll('.list_content').forEach(function(element) {
            if (parseInt(element.id) === productId) {
                element.style.display='table-row'
            }
        });
          
      });

      element.textContent = productName;
      element.setAttribute('id_inventory', productId);
      element.dataset.info = JSON.stringify(info)
      element.appendChild(btn);
      tableInventory.appendChild(element);
      this.style.display='none'
    });
  }
});

function deleteRow(button) {
  // Получаем родительский элемент <tr>
  var row = button.parentNode.parentNode;
  console.log(JSON.parse(row.dataset.info).ID)
  // Удаляем строку
  row.parentNode.removeChild(row);
}

  var ItemId = null
  document.getElementById("addServiceForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const Text = event.target.ToDo.value;
    const addItemButton = document.getElementById("addItemButton");


    
    const data = {
      creating_date: null,
      clients: null,
      inventory: ItemId,
      task: Text,
      parts: 0,
      cost: 0,
      ispayed: false
    }
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
            const serviceList = document.getElementById('service_list')
            const listItem = document.createElement("div");
            listItem.textContent = Text;
            serviceList.appendChild(listItem);
        } else {
            // Обработка ошибки отправки данных
            console.error("Ошибка при отправке данных на сервер.");
        }
    })
    .catch(error => {
        console.error("Произошла ошибка: " + error);
    });
    })
  // Функция отправки запроса

  function sendRequest(itemId) {
      fetch('/getInventoryData?ID=' + itemId, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          document.querySelector(".pole-container").style.display = "flex";
          document.getElementById("ItemName").textContent = data['Name'];
          document.getElementById("ItemSize").textContent = data['Size'];
          document.getElementById("ItemType").textContent = data['Type'];
          ItemId = data['ID'] 
          const serviceList = document.getElementById('service_list')
          data['Services'].forEach(element => {
            var listItem = document.createElement("div");
            listItem.textContent = element['Task'];
            serviceList.appendChild(listItem);
          });
          
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }


// Для сервиса
document.getElementById("addServiceButton").addEventListener("click", function() {
    document.querySelector(".service-container").style.display = "flex";
    document.querySelector(".service-modal").style.display = "block";
});

document.querySelectorAll(".close3").forEach(function(element) {
    element.addEventListener("click", function() {
        document.querySelector(".service-container").style.display = "none";
        document.querySelector(".service-modal").style.display = "none";
    });
});

document.getElementById('addItemForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы

  var table = document.querySelector('.table__inventory');
  var rows = table.querySelectorAll('tr');
  var idInventoryArray = [];
  rows.forEach(function (row) {
    var idInventory = row.getAttribute('id_inventory');
    if (idInventory !== null && idInventory !== undefined) {
      idInventoryArray.push(idInventory);
    }
  });

    // Получаем данные формы
    var formData = {
      Start_Date: document.getElementById('rentalStartDate').value,
      Start_Time: document.getElementById('rentalStartTime').value,
      Return_Date: document.getElementById('rentalEndDate').value,
      Return_Time: document.getElementById('rentalEndTime').value,
      StartItems: idInventoryArray,
      Client: document.querySelector('.dropdownPayment').value,
      paymentMethod: document.querySelector('.dropdownPayment').value,
      Deposit: document.getElementById('deposit').value,
      IsPayed: document.getElementById('isPayed').value,
      Cost: document.querySelector('.itemsSum').value
    };
    console.log(formData)
    // Отправляем данные на сервер Sanic с использованием fetch
    fetch('/rents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Успех:', data);
        // Обрабатываем успех, если необходимо
      })
      .catch((error) => {
        console.error('Ошибка:', error);
        // Обрабатываем ошибки, если необходимо
      });
  });
  function filterRents() {
    const select = document.getElementById("clients-filter");

    const selectedOption = select.value;
    //console.log(selectedOption)
    const rows = document.querySelectorAll("table tr");

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const isExpired = row.dataset.expired;
        console.log(isExpired)
        if ((selectedOption === "all" || selectedOption === isExpired)) {
            row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    }
}
document.querySelector(".rents__search-input").addEventListener("input", function () {
  var searchInput = this.value.toLowerCase();
  var rows = document.querySelectorAll("tbody tr");
  
  for (var i = 1; i < rows.length; i++) {  // Начинаем с 1, чтобы пропустить строку с заголовками
      var cells = rows[i].querySelectorAll(".table-colon");
      var match = false;
      var dataInfo = rows[i].getAttribute("data-info").toLowerCase();
      var match = dataInfo.includes(searchInput);

      if (match) {
          rows[i].style.display = "";
      } else {
          rows[i].style.display = "none";
      }
  }
});