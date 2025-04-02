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
                isCompleted: false,
            };

            try {
                const response = await fetch('http://localhost:8080/task', {
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
                
                //Re load tasks from server to update
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
            taskItem.id = task.id;
            taskItem.textContent = task.description;

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
              try {
                await deleteTaskFromServer(task.id);
                await loadTasksFromServer();
                } catch (error){
                  console.error('Error deleting task:', error);
                  responseStatus.textContent = 'Failed to delete task.';
                  responseStatus.style.color = 'red';
                }
            });

            taskItem.appendChild(deleteButton);
            taskList.appendChild(taskItem);
        });
    }

   // Function to delete a task from the server
   async function deleteTaskFromServer(taskId) {
    const response = await fetch(`http://localhost:8080/task/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // Function to load tasks from the server
  async function loadTasksFromServer() {
    try {
      const response = await fetch('http://localhost:8080/tasks');
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
});
