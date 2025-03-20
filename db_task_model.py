# Import BaseModel from pydantic library for data validation and schema definition
from pydantic import BaseModel
# Import several components from sqlmodel library for ORM functionality
from sqlmodel import Field, Session, SQLModel, create_engine, select


# Define a Task model class that inherits from SQLModel
# The table=True parameter indicates this class will be mapped to a database table
class Task(SQLModel, table=True):
    # Integer primary key field that can be None (auto-incremented by database)
    id: int | None = Field(default=None, primary_key=True)
    # String field for task description with empty string as default
    description: str = Field(default="")
    # Boolean field to track completion status with False as default
    isComplete: bool = Field(default=False)


# Define database name
mysql_name = "test_db"
# Construct MySQL connection URL using PyMySQL driver
# Format: mysql+pymysql://username:password@host:port/database_name
mysql_url = f"mysql+pymysql://root:password@localhost:3306/{mysql_name}"
# Create database engine using the connection URL
# This establishes a connection pool to the database
engine = create_engine(mysql_url)

# Function to create database tables based on SQLModel definitions
def create_db_and_tables():
    # This will create all tables that don't exist yet based on the SQLModel metadata
    SQLModel.metadata.create_all(engine)

# Function to provide a database session context
def get_session():
    # Create a new session using the engine
    with Session(engine) as session:
        # Yield the session to the caller
        # This allows the session to be used as a context manager or dependency
        yield session