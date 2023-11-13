 var option = 0
 const colors = {
  '0':"rgb(255, 255, 255)",
  '1':"rgb(207, 232, 255)",
  '2':"rgb(255, 207, 207)",
  '3':"rgb(253, 255, 174)"
 }
 const employeeSelect = document.getElementById('employeeSelect');


 // Функция для создания календаря
 async function createCalendar() {

    if( employeeSelect.value === "placeholder"){
      return
    }
    var selectedDate = new Date(document.getElementById("monthInput").value);
    if (selectedDate.toString() === "Invalid Date"){
      return
    }
    var year = selectedDate.getFullYear();
    var month = selectedDate.getMonth() + 1; // Месяцы в JavaScript начинаются с 0
    // Получаем контейнер для календаря
    var calendarContainer = document.getElementById('calendarContainer');

    // Создаем новую таблицу
    var table = document.createElement('table');

    // Создаем заголовок таблицы
    var headerRow = table.insertRow(0);
    var daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    for (var i = 0; i < daysOfWeek.length; i++) {
      var cell = headerRow.insertCell(i);
      cell.innerHTML = daysOfWeek[i];
    }

    // Получаем первый день месяца
    var firstDay = new Date(year, month - 1, 1);
    var startingDay = firstDay.getDay();

    // Получаем количество дней в месяце
    var daysInMonth = new Date(year, month, 0).getDate();

    // Создаем ячейки для каждого дня месяца
    var row = table.insertRow(1);
    var dayCount = 1;

    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 7; j++) {

        var cell = row.insertCell(j);

        if (i === 0 && j < startingDay) {
          // Пустые ячейки до начала месяца
          continue;
        }

        if (dayCount > daysInMonth) {
          // Завершаем создание таблицы, если превышено количество дней в месяце
          break;
        }
        
        cell.innerHTML = dayCount;
        await fetch('/getschedule?employee='+employeeSelect.value+"&date="+year+"-"+month+"-"+dayCount, {
          method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
          if(data['status_id']===null){
            cell.style.background = colors['0']
          }
          else{
            cell.style.background = colors[data['status_id']]
          }
        })
        cell.classList.add('cell')
        cell.dataset.day = dayCount;
        cell.dataset.month = month;
        cell.dataset.year = year
        

        dayCount++;
      }

      // Переходим на следующую строку
      row = table.insertRow(table.rows.length);
    }

    // Очищаем предыдущий календарь
    calendarContainer.innerHTML = '';

    // Добавляем таблицу в контейнер
    calendarContainer.appendChild(table);
    document.querySelectorAll('.cell').forEach(function(element) {
      element.addEventListener('click', function(event) {
        var selectedRadio = document.querySelector('input[name="radioGroup"]:checked');
          var data = {
            idEmployee:employeeSelect.value,
            date:element.dataset.year+"-"+element.dataset.month+"-"+element.dataset.day,
            idStatus:selectedRadio.value
          }
          fetch('/schedule', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
            element.style.background=colors[selectedRadio.value]
            console.log('Ответ от сервера:', data);
          })
          .catch(error => {
            console.error('Ошибка при отправке запроса:', error);
          });
      });
  });
  }

  // Обработчик изменения значения в поле выбора месяца
  document.getElementById('monthInput').addEventListener('change', function() {
    // Получаем выбранный год и месяц
    var selectedDate = new Date(this.value);
    var selectedYear = selectedDate.getFullYear();
    var selectedMonth = selectedDate.getMonth() + 1; // Месяцы в JavaScript начинаются с 0

    // Создаем календарь
    createCalendar(selectedYear, selectedMonth);
  });

document.querySelector('.getSchedule').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    
    var monthInput = document.getElementById('monthInput');

    // Подготавливаем данные для отправки на сервер
    var formData = {
      employee: employeeSelect.value,
      month: monthInput.value
    };

    // Отправляем запрос на сервер
    fetch('/get_schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      // Обработка ответа от сервера
      console.log('Ответ от сервера:', data);
    })
    .catch(error => {
      console.error('Ошибка при отправке запроса:', error);
    });
  });

  document.getElementById('passwordButton').addEventListener('click', () => {
    const password = document.getElementById('password').value;

    // Создаем объект FormData для отправки данных формы
    const formData = new FormData();
    formData.append('password', password);

    // Отправляем POST-запрос на сервер
    fetch('/get_password', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Обработка ответа от сервера (data.result будет содержать True или False)
        if (data.result === true) {
            const statusElement = document.querySelector('.status');
            statusElement.style.display = 'block';
        } else {
            console.log('Пароль неверный');

        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
});
