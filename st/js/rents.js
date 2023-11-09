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
          var productName = this.cells[0].textContent;
          var productId = this.id;

          // Создание новой строки в таблице с добавлением атрибута id_inventory
          var tableInventory = document.querySelector('.table__inventory');
          var element = document.createElement('tr');
          element.textContent = productName;
          element.setAttribute('id_inventory', productId);
          tableInventory.appendChild(element);

          // Добавление обработчика события для новой строки
          element.addEventListener('click', function() {
              // Вызов функции отправки запроса
              sendRequest(productId);
          });
      });
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
});

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