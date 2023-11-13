document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch('/getrentcountbydate');
    const rentCountData = await response.json();



    const dates = rentCountData.map(entry => entry[0]);  
    const counts = rentCountData.map(entry => entry[1]); 
    const totalRentCount = counts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    
    
    document.getElementById("rent-count").innerText = totalRentCount;
    var ctx = document.getElementById('rentCountChart').getContext('2d');
    var rentCountChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Заказов за день',
                data: counts,
                backgroundColor: 'rgb(138, 132, 226)',
                borderColor: 'rgb(138, 132, 226)',
                borderWidth: 1
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
});
