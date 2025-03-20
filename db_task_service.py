# Import the Task model from a module named db_task_model
from db_task_model import Task
# Import select function and Session class from sqlmodel for database operations
from sqlmodel import select, Session


def get_all_tasks(session: Session):
    """
    Retrieve all tasks from the database.
    
    Args:
        session (Session): The database session object
        
    Returns:
        list: A list of all Task objects in the database
    """
    # Create a SELECT query for all Task records
    statement = select(Task)
    # Execute the query and return all results as a list
    tasks = session.exec(statement).all()
    return tasks


def create_task(task: Task, session: Session):
    """
    Create a new task in the database.
    
    Args:
        task (Task): The Task object to be created
        session (Session): The database session object
        
    Returns:
        Task: The created Task object with updated fields (including ID)
    """
    # Add the task object to the session
    session.add(task)
    # Commit the transaction to save changes to the database
    session.commit()
    # Refresh the task object with data from the database (including generated ID)
    session.refresh(task)
    return task


def update_task(task_id: int, updated: Task, session: Session):
    """
    Update an existing task in the database.
    
    Args:
        task_id (int): The ID of the task to update
        updated (Task): Task object containing updated values
        session (Session): The database session object
        
    Returns:
        Task or str: The updated Task object if found, or error message if not found
    """
    # Get the task with the specified ID
    task = session.get(Task, task_id)

    # If task doesn't exist, return an error message
    if not task:
        return "Task Not Found"
    
    # Update the task's fields with values from the updated task object
    task.description = updated.description
    task.isComplete = updated.isComplete
    # Commit the changes to the database
    session.commit()
    # Refresh the task with data from the database
    session.refresh(task)
    
    return task


def delete_task(task_id: int, session: Session):
    """
    Delete a task from the database.
    
    Args:
        task_id (int): The ID of the task to delete
        session (Session): The database session object
        
    Returns:
        str: Success message or error message
    """
    # Get the task with the specified ID
    task = session.get(Task, task_id)
    
    # If task doesn't exist, return an error message
    if not task:
        return "Task not found"
    
    # Delete the task from the session
    session.delete(task)
    # Commit the changes to the database
    session.commit()

    return "Task deleted successfully"


def get_task(task_id: int, session: Session):
    """
    Retrieve a specific task by ID from the database.
    
    Args:
        task_id (int): The ID of the task to retrieve
        session (Session): The database session object
        
    Returns:
        Task or str: The requested Task object if found, or error message if not found
    """
    # Get the task with the specified ID
    task = session.get(Task, task_id)
    
    # If task doesn't exist, return an error message
    if not task:
        return "Task Not Found"
    
    return task