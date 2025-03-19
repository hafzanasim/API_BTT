from task_model import Task
from fastapi import FastAPI

app = FastAPI()

tasks = [
    Task(),
    Task()
]


@app.get("/")
def root():
    return "Hello World"

@app.get("/tasks/all")
def get_all_tasks():
    return tasks

@app.get("/get-task/{task_id}")
def get_task(task_id: int):
    for task in tasks:
        if task.id == task_id:
            return task

    return "Task Not Found"

@app.get("/")
def root():
     return "Hello World"

@app.put("/{task_id}")
def update_task(task_id: int, updated: Task):
    for task in tasks:
        if task.id == task_id:
            task.description = updated.description
            task.isComplete = updated.isComplete
            return "Task Updated"

    return "Task Not Found"


@app.post("/tasks")
def create_task(task_model: Task):
    tasks.append(task_model)
    return "Task Added"

@app.delete("/task/delete{task_id}")
def delete_task(task_id: int):
    for task in tasks:
        if task.id == task_id:
            tasks.remove(task)
            return "Task Deleted"

    return "Task Not Found"
