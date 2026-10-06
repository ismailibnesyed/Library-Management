from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# SQLite database connection string used by the library application.
SQLALCHEMY_DATABASE_URL = 'sqlite:///./library.db'

# Create the SQLAlchemy engine and allow use from FastAPI worker threads.
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})

# Factory for creating database sessions on demand.
SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

# Base class inherited by all SQLAlchemy models.
Base = declarative_base()
