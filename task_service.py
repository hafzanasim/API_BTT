from fastapi import APIRouter  # Imports APIRouter from FastAPI (not used in this file)
from task_model import Task  # Imports the Task model

# Creates a list with two empty Task objects
tasks = [
    Task(),
    Task()
]

# Function to get all tasks
def get_all_tasks():
    return tasks

# Function to create a new task
def create_task(task: Task):
    tasks.append(task)
    return "Task Added"

# Function to update a task by ID
def update_task(task_id: int, updated: Task):
    for task in tasks:
        if task.id == task_id:
            task.description = updated.description
            task.isComplete = updated.isComplete
            return "Updated task"
    
    return "Task not found"

# Function to delete a task by ID
def delete_task(task_id: int):
    for index, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(index)  # Removes task at the found index
            return "Deleted task"
    return "Task not found"

# Function to get a specific task by ID
def get_task(task_id: int):
    for task in tasks:
        if task.id == task_id:
            return task
    return "Not found"