from fastapi import APIRouter
from task_model import Task

tasks = [
    Task(),
    Task()
]


task_router = APIRouter(prefix="/task")


@task_router.get("/get-all")
def get_all_tasks():
    return tasks

@task_router.get("/{task_id}")
def get_task(task_id:int):
    
    for task in tasks:
        if task.id == task_id:
            return task
        
    return "Could not find task"

@task_router.put("/update/{task_id}")
def update_task(task_id: int, updated: Task):
    for task in tasks:
        if task.id == task_id:
            task.description = updated.description
            task.isComplete = updated.isComplete
            return f'Updated task with id {task_id}'
    return "Task not found"

@task_router.post("/create")
def create_task(new_task: Task):
    tasks.append(new_task)
    return "Created Successfully"

@task_router.delete("/")
def delete_task(task_id: int):
    for index, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(index)
            return f"Deleted task with id {task_id}"
    return "Task not found"