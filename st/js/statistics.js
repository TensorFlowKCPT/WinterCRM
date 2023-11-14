document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch client count data from the /clients endpoint
        const responseClients = await fetch('/clientsCount');
        const clientsData = await responseClients.json();

        // Calculate total number of clients
        const totalClientCount = clientsData.lenClients;

        // Display the total number of clients
        document.getElementById("client-count").innerText = totalClientCount;

        // Existing code for rent count chart
        const responseRent = await fetch('/getrentcountbydate');
        const rentCountData = await responseRent.json();

        const dates = rentCountData.map(entry => entry[0]);  
        const counts = rentCountData.map(entry => entry[1]); 
        const totalRentCount = counts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        // Calculate the declension for the word "заказ"
        const declension = calculateDeclension(totalRentCount);

        document.getElementById("rent-count").innerText = `${totalRentCount} ${declension}`;

        var ctx = document.getElementById('rentCountChart').getContext('2d');
        var rentCountChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Заказов за день',
                    data: counts,
                    backgroundColor: 'rgb(177, 173, 237)',
                    borderColor: 'rgb(138, 132, 226)',
                    borderWidth: 5
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                        },
                        title: {
                            display: true,
                            text: 'Кол-во заказов'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function calculateDeclension(number) {
    // Function to calculate the declension of the word "заказ" based on the given number
    if (number % 10 === 1 && number % 100 !== 11) {
        return "заказ";
    } else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
        return "заказа";
    } else {
        return "заказов";
    }
}