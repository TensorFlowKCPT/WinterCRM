document.addEventListener('DOMContentLoaded', function () {
                // Используем moment с локалями
                moment.locale('ru');

                // Генерация массива дней от сегодняшнего дня
                var days = [];
                for (var i = 4; i >= 0; i--) {
                    days.push(moment().subtract(i, 'days').format('MMM DD'));
                }

                // Замените эти данные на свои данные о заказах
                var orders = [5, 8, 2, 7, 4];

                // Создаем график с использованием Chart.js
                var ctx = document.getElementById('orderChart').getContext('2d');
                var orderChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: days,
                        datasets: [{
                            label: 'Заказы',
                            data: orders,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            x: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Дни'
                                }
                            }],
                            y: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Заказы'
                                }
                            }]
                        }
                    }
                });
            });