
// При загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  UpdateRents()
});
var clients = null
var RentsFilterOption = "all"
//При изменении значения в фильтре
function filterChanged(){
  RentsFilterOption = document.getElementById("rents-filter").value
  UpdateRents()
}
var RentsSearchText = ""
//При изменении значения в поиске
function SearchBoxChanged(){
  RentsSearchText = document.getElementById("rents-searchbox").value
  UpdateRents()
}
const RentsMainTable = document.getElementById("RentsMainTable")

//Обновление главной таблицы
function UpdateRents(){
  
  fetch('/getallrents')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
      //Логика обновления данных в таблице
      ////console.log(data)
      //headers
      RentsMainTable.innerHTML = ''
      var headers = ['Оплачено', 'Предметы', 'Имя клиента', 'Время взятия', 'Время возврата'];
      var headerRow = document.createElement('tr');

      headers.forEach(function(headerText) {
          var th = document.createElement('th');
          th.textContent = headerText;
          //th.classList.add("")
          headerRow.appendChild(th);
          headerRow.classList.add("table__header")
      });
      RentsMainTable.appendChild(headerRow)

      //Фильтрация по фильтру
      data = data.filter(function(item) {
        return item.Expired.toString().toLowerCase() === RentsFilterOption || RentsFilterOption === 'all';
      });

      //Фильтрация по Поиску
      data = data.filter(function(item) {
        item = JSON.stringify(item)
        
        return item.includes(RentsSearchText) || RentsSearchText === "";
      });

      data.forEach(function(dataRow) {
        var tr = document.createElement('tr');
        var IsPayed = document.createElement('td');
        IsPayed.textContent = dataRow.IsPayed
        tr.appendChild(IsPayed);
        var Items = document.createElement('td');
        Items.textContent = dataRow.StartItems.length
        tr.appendChild(Items);
        var Client = document.createElement('td');
        Client.textContent = dataRow.Client.FIO
        tr.appendChild(Client);
        var StartTime = document.createElement('td');
        StartTime.textContent = dataRow.Start_Date+ " " + dataRow.Start_Time
        tr.appendChild(StartTime);
        var ReturnTime = document.createElement('td');
        ReturnTime.textContent = dataRow.Return_Date+ " " + dataRow.Return_Time
        tr.appendChild(ReturnTime);
        tr.classList.add('table-row')
        tr.onclick = function(){OpenRentInfo(dataRow.ID)}
        Array.from(tr.children).forEach(row => row.classList.add('colone'))
        RentsMainTable.appendChild(tr)
      });
      document.getElementById("rentsCount").innerText = RentsMainTable.rows.length-1;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
}

const RentMainModalContainer = document.getElementById("RentMainModalContainer")
const RentMainModal = document.getElementById("RentMainModal")
const SelectedInventoryTable = document.getElementById("SelectedInventoryTable")
const InventoryInfoContainer = document.getElementById("InventoryInfoContainer")
const ServiceList = document.getElementById("service_list")
const addItemButton = document.getElementById("addItemButton")
// Модальное окно создания аренды
document.getElementById("openCreateRentModalBtn").addEventListener("click", function() {
    clients = null
    RentMainModalContainer.style.display = "flex";
    RentMainModal.style.display = "block";
    addItemButton.style.display = "block"
    var headers = ['Название', 'Удалить'];
      var headerRow = document.createElement('tr');

      headers.forEach(function(headerText) {
          var th = document.createElement('th');
          th.textContent = headerText;
          //th.classList.add("")
          headerRow.appendChild(th);
          headerRow.classList.add("table__header")
      });
      SelectedInventoryTable.appendChild(headerRow)
      ServiceList.innerHTML = ""
      var headers = ['Поломки'];
      var headerRow = document.createElement('tr');

      headers.forEach(function(headerText) {
          var th = document.createElement('th');
          th.textContent = headerText;
          //th.classList.add("")
          headerRow.appendChild(th);
          headerRow.classList.add("table__header")
      });
      ServiceList.appendChild(headerRow)
      UpdateNotRentedInventory()
});

document.getElementById("closeCreateRentModalBtn").addEventListener("click", function() {
      RentMainModalContainer.style.display = "none";
      RentMainModalContainer.style.display = "none";
      InventoryInfoContainer.style.display = "none";
      addItemButton.style.display = "none"
      SelectedInventoryTable.innerHTML = "";
      ServiceList.innerHTML = "";
    });
const NotRentedInventoryTable = document.getElementById("NotRentedInventoryTable")
const NotRentedInventoryModalContainer = document.getElementById("NotRentedInventoryModalContainer")
const NotRentedInventoryModal = document.getElementById("NotRentedInventoryModal")

// Модальное окно добавления инвентаря в аренду
document.getElementById("addItemButton").addEventListener("click",function(){
  NotRentedInventoryModalContainer.style.display = "flex";
  NotRentedInventoryModal.style.display = "block";
});

var InventorySearchText = ""

//При изменении текста в поиске инвентаря
function InventorySearchBoxChanged(){
  InventorySearchText = document.getElementById("inventory-searchbox").value
  UpdateNotRentedInventory()
}

function UpdateNotRentedInventory(){
  NotRentedInventoryTable.innerHTML = "";
  fetch('/getNotRentedInventory')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
    //Логика обновления данных в таблице
    ////console.log(data)
    //headers
    NotRentedInventoryTable.innerHTML = ''
    var headers = ['Название', 'Размер', 'Тип'];
    var headerRow = document.createElement('tr');

    headers.forEach(function(headerText) {
        var th = document.createElement('th');
        th.textContent = headerText;
        //th.classList.add("")
        headerRow.appendChild(th);
        headerRow.classList.add("table__header")
    });
    NotRentedInventoryTable.appendChild(headerRow)

    //Фильтрация по Поиску
    data = data.filter(function(item) {
      item = JSON.stringify(item)
      
      return item.includes(InventorySearchText) || InventorySearchText === "";
    });

    data.forEach(function(dataRow) {
      var tr = document.createElement('tr');
      var Name = document.createElement('td');
      Name.textContent = dataRow.Name
      tr.appendChild(Name);
      var Size = document.createElement('td');
      Size.textContent = dataRow.Size
      tr.appendChild(Size);
      var Type = document.createElement('td');
      Type.textContent = dataRow.Type
      tr.appendChild(Type);
      tr.onclick = function(){AddInventoryToList(dataRow.ID), NotRentedInventoryTable.removeChild(tr)}
      tr.classList.add('table-row')
      Array.from(tr.children).forEach(row => row.classList.add('colone'))
      NotRentedInventoryTable.appendChild(tr)
    });
    
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });
}

function AddInventoryToList(id){
  fetch('/getInventoryData?ID='+id)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(dataRow => {
      //Логика обновления данных в таблице
      //console.log(dataRow)
      var tr = document.createElement('tr');
      var Name = document.createElement('td');
      Name.textContent = dataRow.Name
      Name.onclick = function(){ShowSelectedInventoryData(dataRow.ID)}
      tr.appendChild(Name);
      var Delete = document.createElement('td');
      Delete.textContent = "Удалить"
      Delete.onclick = function(){SelectedInventoryTable.removeChild(tr);DeleteSelectedInventory(dataRow.ID)}
      tr.appendChild(Delete);
      tr.dataset.id = dataRow.ID
      tr.classList.add('table-row')
      
      Array.from(tr.children).forEach(row => row.classList.add('colone'))
      SelectedInventoryTable.appendChild(tr)
      
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function DeleteSelectedInventory(id){
  fetch('/getInventoryData?ID='+id)
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(dataRow => {
    //console.log(dataRow)
    var tr = document.createElement('tr');
    var Name = document.createElement('td');
    Name.textContent = dataRow.Name
    tr.appendChild(Name);
    var Size = document.createElement('td');
    Size.textContent = dataRow.Size
    tr.appendChild(Size);
    var Type = document.createElement('td');
    Type.textContent = dataRow.Type
    tr.appendChild(Type);
    tr.onclick = function(){AddInventoryToList(dataRow.ID), NotRentedInventoryTable.removeChild(tr)}
    tr.classList.add('table-row')
    Array.from(tr.children).forEach(row => row.classList.add('colone'))
    NotRentedInventoryTable.appendChild(tr)
    InventoryInfoContainer.style.display="None"
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });
}
const SelectedItemName = document.getElementById("SelectedItemName");
const SelectedItemSize = document.getElementById("SelectedItemSize");
const SelectedItemType = document.getElementById("SelectedItemType");
var ItemId = 0
function ShowSelectedInventoryData(id){
  ItemId = id
  ServiceList.innerHTML = ""
  var headers = ['Поломки'];
      var headerRow = document.createElement('tr');

      headers.forEach(function(headerText) {
          var th = document.createElement('th');
          th.textContent = headerText;
          //th.classList.add("")
          headerRow.appendChild(th);
          headerRow.classList.add("table__header")
      });
      ServiceList.appendChild(headerRow)
  fetch('/getInventoryData?ID='+id)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(dataRow => {
      ////console.log(dataRow)
      SelectedItemName.textContent = dataRow.Name;
      SelectedItemSize.textContent = dataRow.Size;
      SelectedItemType.textContent = dataRow.Type;
      
      dataRow.Services.forEach(function(row) {
        var tr = document.createElement('tr');
        tr.textContent = row.Task;
        //th.classList.add("")
        ServiceList.appendChild(tr);
        tr.classList.add("colon")});
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
    InventoryInfoContainer.style.display="flex";
 
}
document.getElementById("closeNotRentedInventoryModal").addEventListener("click",function(){
  NotRentedInventoryModalContainer.style.display = "none";
  NotRentedInventoryModal.style.display = "none";
})

//Модалка для добавления сервиса
const serviceModalContainer = document.getElementById("serviceModalContainer");
const serviceModal = document.getElementById("serviceModal");

document.getElementById("addServiceButton").addEventListener("click",function(){
  serviceModalContainer.style.display="flex"
  serviceModal.style.display="block"
});

document.getElementById("closeAddServiceModal").addEventListener("click",function(){
  serviceModalContainer.style.display="none"
  serviceModal.style.display="none"
});

document.getElementById("addServiceForm").addEventListener("submit",function(event){
  event.preventDefault();
  const Text = event.target.ToDo.value;
    //console.log(ItemId)
    const data = {
      creating_date: null,
      clients: clients,
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
            const listItem = document.createElement("tr");
            listItem.innerText = Text;
            ServiceList.appendChild(listItem);
            listItem.classList.add("colon")
        } else {
            // Обработка ошибки отправки данных
            console.error("Ошибка при отправке данных на сервер.");
        }
    })
    .catch(error => {
        console.error("Произошла ошибка: " + error);
    });
  
});
const rentalStartDate = document.getElementById('rentalStartDate')
const rentalStartTime = document.getElementById('rentalStartTime')
const rentalEndDate = document.getElementById('rentalEndDate')
const rentalEndTime = document.getElementById('rentalEndTime')
const FormClientSelect = document.getElementById('FormClientSelect')
const FormPaymentMethodSelect = document.getElementById('FormPaymentMethodSelect')
const deposit = document.getElementById('deposit')
const isPayed = document.getElementById('isPayed')
const itemsSum = document.getElementById('itemsSum')
const AddRentForm = document.getElementById("AddRentForm").addEventListener("submit", function(event){
  event.preventDefault();
  var rows = SelectedInventoryTable.querySelectorAll('tr');
  var idInventoryArray = [];
  rows.forEach(function (row) {
    var idInventory = row.dataset.id;
    if (idInventory !== null && idInventory !== undefined) {
      idInventoryArray.push(idInventory);
    }
  });
  var formData = {
    Start_Date: rentalStartDate.value,
    Start_Time: rentalStartTime.value,
    Return_Date: rentalEndDate.value,
    Return_Time: rentalEndTime.value,
    StartItems: idInventoryArray,
    Client: FormClientSelect.value,
    paymentMethod: FormPaymentMethodSelect.value,
    Deposit: deposit.value,
    IsPayed: isPayed.value,
    Cost: itemsSum.value
  };
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
      UpdateRents();
      UpdateNotRentedInventory();
      RentMainModalContainer.style.display = "none";
      RentMainModalContainer.style.display = "none";
      InventoryInfoContainer.style.display = "none";
      SelectedInventoryTable.innerHTML = "";
      ServiceList.innerHTML = "";
    })
    .catch((error) => {
      console.error('Ошибка:', error);
    });

});

function OpenRentInfo(id){
  RentMainModalContainer.style.display = "flex";
  RentMainModal.style.display = "block";
  FormClientSelect.disabled = true
  rentalStartDate.disabled = true
  rentalStartTime.disabled = true
  deposit.disabled = true
  var headers = ['Предметы'];
      var headerRow = document.createElement('tr');

      headers.forEach(function(headerText) {
          var th = document.createElement('th');
          th.textContent = headerText;
          //th.classList.add("")
          headerRow.appendChild(th);
          headerRow.classList.add("table__header")
      });
      SelectedInventoryTable.appendChild(headerRow)
      ServiceList.innerHTML = ""
      var headers = ['Поломки'];
      var headerRow = document.createElement('tr');

      headers.forEach(function(headerText) {
          var th = document.createElement('th');
          th.textContent = headerText;
          //th.classList.add("")
          headerRow.appendChild(th);
          headerRow.classList.add("table__header")
      });
      ServiceList.appendChild(headerRow)
  fetch('/getrentbyid?ID='+id)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
      console.log(data)
      clients = data.Client.ID
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

