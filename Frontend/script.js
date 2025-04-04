// script.js
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const responseStatus = document.getElementById('responseStatus');

    // Load tasks from the server on page load
    loadTasksFromServer();

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const descriptionInput = document.getElementById('description');
        const description = descriptionInput.value.trim();

        if (description) {
            const taskData = {
                description: description,
                isCompleted: false, // Default to false when creating a new task
            };

            try {
                const response = await fetch('http://localhost:8000/task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(taskData),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const newTask = await response.json();

                // Re-load tasks from server to update
                await loadTasksFromServer();

                descriptionInput.value = '';
                responseStatus.textContent = 'Task added successfully!';
                responseStatus.style.color = 'green';
            } catch (error) {
                console.error('Error adding task:', error);
                responseStatus.textContent = 'Failed to add task.';
                responseStatus.style.color = 'red';
            }
        } else {
            responseStatus.textContent = 'Please enter a task description.';
            responseStatus.style.color = 'red';
        }
    });

    // Function to render tasks
    async function renderTasks(tasks) {
        taskList.innerHTML = ''; // Clear existing tasks

        tasks.forEach((task) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.id = `task-${task.id}`; // Add task- prefix to id

            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.isCompleted;
            checkbox.addEventListener('change', async () => {
                const descSpan = document.getElementById(`description-${task.id}`);
                console.log("Before update: ", descSpan.textContent);
                
                try {
                    await updateTaskCompletion(task.id, checkbox.checked);
                    updateTaskItem(task.id, checkbox.checked);
                    
                    console.log("After update: ", descSpan.textContent);
                } catch (error) {
                    console.error('Error updating task completion:', error);
                    responseStatus.textContent = 'Failed to update task completion.';
                    responseStatus.style.color = 'red';
                }
            });

            // Create task description span
            const descriptionSpan = document.createElement('span');
            descriptionSpan.textContent = task.description;
            descriptionSpan.id = `description-${task.id}`; // Add description- prefix to id
            if (task.isCompleted) {
                descriptionSpan.style.textDecoration = 'line-through';
            }

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                try {
                    await deleteTaskFromServer(task.id);
                    await loadTasksFromServer();
                } catch (error) {
                    console.error('Error deleting task:', error);
                    responseStatus.textContent = 'Failed to delete task.';
                    responseStatus.style.color = 'red';
                }
            });

            // Append elements to task item
            taskItem.appendChild(checkbox);
            taskItem.appendChild(descriptionSpan);
            taskItem.appendChild(deleteButton);
            taskList.appendChild(taskItem);
        });
    }

    // Function to delete a task from the server
    async function deleteTaskFromServer(taskId) {
        const response = await fetch(`http://localhost:8000/task/delete/${taskId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    // Function to load tasks from the server
    async function loadTasksFromServer() {
        try {
            const response = await fetch(`http://localhost:8000/tasks/all`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            responseStatus.textContent = 'Failed to load tasks.';
            responseStatus.style.color = 'red';
        }
    }

    // Function to update task completion status on the server
    async function updateTaskCompletion(task_id, isCompleted) {
        const response = await fetch(`http://localhost:8000/${task_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isCompleted: true }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    // Function to update a single task item in the UI
    function updateTaskItem(taskId, isCompleted) {
        const taskItem = document.getElementById(`task-${taskId}`);
        const descriptionSpan = document.getElementById(`description-${taskId}`);

        if (taskItem && descriptionSpan) {
            const checkbox = taskItem.querySelector('input[type="checkbox"]');
            checkbox.checked = isCompleted;

            if (isCompleted) {
                descriptionSpan.style.textDecoration = 'line-through';
            } else {
                descriptionSpan.style.textDecoration = 'none';
            }
        }
    }
});
