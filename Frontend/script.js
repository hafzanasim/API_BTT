// script.js
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const responseStatus = document.getElementById('responseStatus');

    // Load tasks from local storage
    let tasks = loadTasks();

    // Render tasks on page load
    renderTasks(tasks);

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const descriptionInput = document.getElementById('description');
        const description = descriptionInput.value.trim();

        if (description) {
            // Add the task
            const newTask = addTask(description, tasks);
            // Render the task
            renderTasks(tasks);
            // Save the tasks to local storage
            saveTasks(tasks);
            // Clear the input field
            descriptionInput.value = '';
            responseStatus.textContent = 'Task added successfully!';
            responseStatus.style.color = 'green';
        } else {
            responseStatus.textContent = 'Please enter a task description.';
            responseStatus.style.color = 'red';
        }
    });

    // Function to render tasks
    function renderTasks(tasks) {
        taskList.innerHTML = ''; // Clear existing tasks

        tasks.forEach((task) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.id = task.id;
            taskItem.textContent = task.description;

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteTask(task.id, tasks);
                renderTasks(tasks);
                saveTasks(tasks);
            });

            taskItem.appendChild(deleteButton);
            taskList.appendChild(taskItem);
        });
    }

    // Function to add a task
    function addTask(description, tasks) {
        const newTask = {
            id: Date.now(), // Unique ID for each task
            description: description,
        };
        tasks.push(newTask);
        return newTask;
    }

    // Function to delete a task
    function deleteTask(taskId, tasks) {
        const taskIndex = tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
        }
    }

    // Function to save tasks to local storage
    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from local storage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    }
});
