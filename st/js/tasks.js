const addTaskButton = document.getElementById('addTaskButton');
        const taskInput = document.getElementById('task');
        const employeesSelect = document.getElementById('employees'); 
        const dueDateInput = document.getElementById('dueDate');

        addTaskButton.addEventListener('click', async () => {
            const task = taskInput.value;
            const employee = employeesSelect.value;
            const dueDate = dueDateInput.value;

            if (task) {
                const data = {
                    task: task,
                    employee: employee,
                    dueDate: dueDate
                };

                const response = await fetch('/addTask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.status === 200) {
                    alert('Task added successfully');
                    taskInput.value = '';
                    employeesSelect.value = '';
                    dueDateInput.value = '';
                } else {
                    alert('Failed to add task');
                }
            } else {
                alert('Please enter a task');
            }
        });

        const checkboxes = document.querySelectorAll('.task-status-checkbox');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', async () => {
        const taskId = checkbox.getAttribute('data-task-id');
        const isChecked = checkbox.checked;
        console.log(taskId ,isChecked)
        const data = {
            taskId: taskId,
            isChecked: isChecked
        };

        try {
            const response = await fetch('/updateTaskStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.status === 200) {
                console.log(`Task status for task ${taskId} updated successfully.`);
            } else {
                console.error('Failed to update task status.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
});