from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = 'postgresql://postgres.akxxpmlzaocofusumfan:Library_Management180@aws-0-ap-south-1.pooler.supabase.com:5432/postgres'

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker( autocommit=False, autoflush=False, bind=engine )
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
