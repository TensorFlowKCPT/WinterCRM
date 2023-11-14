
document.getElementById("CreateServiceBtn").addEventListener("click", function() {
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
            location.reload()
        } else {
            // Обработка ошибки отправки данных
            console.error("Ошибка при отправке данных на сервер.");
        }
    })
    .catch(error => {
        console.error("Произошла ошибка: " + error);
    });
});
function SearchBox(){
    var SearchText = document.getElementById("serviceSearch").value
    var rows = document.getElementById("Table").children
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        rowText = row.children[2].innerHTML
        console.log(rowText)
        console.log(SearchText)
        if (SearchText === '' || rowText.includes(SearchText)) {
            row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    }
}
function Delete(id){
        // Отправьте данные на сервер с использованием Fetch API
        fetch("/service_delete?id="+id, {
            method: "POST",
        })
        .then(response => {
            if (response.ok) {
                // Обработка успешной отправки данных
                console.log("Данные успешно отправлены на сервер.");
                location.reload()
            } else {
                // Обработка ошибки отправки данных
                console.error("Ошибка при отправке данных на сервер.");
            }
        })
        .catch(error => {
            console.error("Произошла ошибка: " + error);
        });
}
document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('myModal');
    var openModalButton = document.getElementById('openModalBtn');
    var closeModalSpan = document.getElementsByClassName('close')[0];
  
    openModalButton.onclick = function () {
      modal.style.display = 'block';
    };
  
    closeModalSpan.onclick = function () {
      modal.style.display = 'none';
    };
  });
  
function UpdatePaymentStatus(id){
    var data = {
        ID:id,
        IsPayed:document.getElementById(id).children[6].children[0].checked
    }
    fetch("/update_service_payment", {
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
    
}
function SearchBox() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("serviceSearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("Table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("th");
      for (j = 0; j < td.length; j++) {
        if (td[j]) {
          txtValue = td[j].textContent || td[j].innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            break;
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  }

  function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("Table");
    switching = true;
    
    // Set the column index for sorting
    var columnIndex = 1; // 1 corresponds to the "Клиент" column
    
    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;

        x = rows[i].getElementsByTagName("td")[columnIndex].textContent.toLowerCase();
        y = rows[i + 1].getElementsByTagName("td")[columnIndex].textContent.toLowerCase();

        // Special handling for date column
        if (columnIndex === 0) {
          x = new Date(x);
          y = new Date(y);
        }

        if (x > y) {
          shouldSwitch = true;
          break;
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }


