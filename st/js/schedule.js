// Получаем ссылки на радиокнопки и ячейки таблицы

// Назначаем обработчик события для кнопки "Сохранить"
var saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', function () {
    var tableHTML = document.querySelector('.schedule').outerHTML
    // Отправляем данные на сервер
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'table=' + encodeURIComponent(tableHTML),
    })
        .then(function (response) {
            if (response.status === 200) {
                alert('Таблица сохранена на сервере.');
            }
        })
        .catch(function (error) {
            console.error('Ошибка при отправке данных: ', error);
        });
});

var scheduleDiv = document.querySelector('.schedule');
function schedtojson(dv){
    var json = {"name":None, 'month':None} 
    
}
document.querySelector('.dropdown').addEventListener('change', function() {
    const selectedEmployee = this.value;
    fetch('/get_schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employee_id: selectedEmployee })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        const scheduleContainer = document.querySelector('.schedule');
        scheduleContainer.innerHTML = data;
        var radioButtons = document.querySelectorAll('input[type="radio"]');
            var tableCells = document.querySelectorAll('.cell');
            
            // Назначаем обработчик события для каждой радиокнопки
            radioButtons.forEach(function(radioButton, index) {
                radioButton.addEventListener('change', function() {
                    // Если радиокнопка выбрана, сохраняем ее цвет
                    if (radioButton.checked) {
                        var selectedColor = radioButton.nextElementSibling.style.backgroundColor;

                        // Назначаем обработчик события для каждой ячейки таблицы
                        tableCells.forEach(function(cell) {
                            cell.addEventListener('click', function() {
                                // Закрашиваем ячейку выбранным цветом
                                cell.style.backgroundColor = selectedColor;
                            });
                        });
                    }
                });
            });
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
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

// 
const buttons = document.querySelectorAll(".buttonName");

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });
    this.classList.add("active");
  });
});