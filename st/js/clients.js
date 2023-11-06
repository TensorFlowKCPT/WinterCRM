document.getElementById("addItemForm").addEventListener("submit", function (event) {
            event.preventDefault();

            const Fio = event.target.FIO.value;
            const Passport = event.target.Passport.value;
            const PhoneNumber = event.target.PhoneNumber.value;

            const table = document.querySelector("table");
            const newRow = table.insertRow(table.rows.length);
            const cells = [newRow.insertCell(0), newRow.insertCell(1), newRow.insertCell(2)];

            
            cells[0].innerText = Fio;
            cells[1].innerText = Passport;
            cells[2].innerText = PhoneNumber;

            const formData = new FormData();
            formData.append("FIO", Fio);
            formData.append("Passport", Passport);
            formData.append("PhoneNumber", PhoneNumber);

            fetch("/clients", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .catch(error => {
                console.error("Ошибка при отправке запроса:", error);
            });


            event.target.reset();
        });