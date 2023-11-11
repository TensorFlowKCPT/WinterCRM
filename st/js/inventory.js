var ItemId = 0
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
function Sell(){
    var cost = document.getElementById("cost").value;
    var comment = document.getElementById("comment").value;
    console.log(cost)
    console.log(comment)
    console.log(ItemId)
    fetch("/sell_inventory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idinventory: ItemId, cost: cost, comment: comment 
        })
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
        document.getElementById(ItemId).remove();
        document.getElementById('ModalSell').style.display='none'
    })
    .catch(error => {
        console.error("Ошибка при отправке запроса:", error);
    });
};
document.getElementById("addItemForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = event.target.name.value;
    const type = event.target.type.value;
    const typetext = event.target.type.options[event.target.type.selectedIndex].text;
    const rented = document.getElementById("rentedCheck").checked
    const size = document.getElementById("sizeInv").value;

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
    location.reload();
    });
    

function openModalSell(id) {
    ItemId = id
    console.log(ItemId)
    document.getElementById('ModalSell').style.display = 'flex';
  }

  document.getElementById('ModalSell').addEventListener('click', function (e) {
    if (e.target === this) {
      this.style.display = 'none';
    }
  });