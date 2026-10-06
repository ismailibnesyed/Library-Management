from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Annotated, Optional
import models
from models import Books, Users, Reservations, IssueRecords
from database import engine, SessionLocal
from fastapi.responses import JSONResponse
from router import admin, auth
from router.auth import get_current_user

# =====================================
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# =====================================

models.Base.metadata.create_all(bind=engine)
# Register authentication and librarian-specific routes.
app.include_router(auth.router)
app.include_router(admin.router)

# Provide one database session per request and close it afterward.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@app.get("/user")
def get_user(current_user: user_dependency):
    return current_user

# Return every book to an authenticated user.
@app.get('/books/all')
def get_all_books(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Failed Authentication')

    booksall = db.query(Books).all()
    return booksall

# Return one book selected by its database ID.
@app.get('/books/{book_id}')
def get_specific_book(user: user_dependency, db: db_dependency, book_id: int):

    if user is None:
        raise HTTPException(status_code=401, detail='Failed Authentication')
    book = db.query(Books).filter(Books.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail='Book not found')
    return book


# Create a pending reservation for an available book record.
@app.post('/reserve/{book_id}')
def reserve_book(user: user_dependency, db: db_dependency, book_id: int):

    if user is None:
        raise HTTPException(status_code=401, detail='Failed Authentication')

    book = db.query(Books).filter(Books.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail='Book not found')
    
    reservation_model = Reservations(
        book_id = book_id,
        user_id = user.get('id'),
        status = 'pending'
    )

    db.add(reservation_model)
    db.commit()

    return JSONResponse(status_code=201, content={'message': 'Book reserved successfully'})

# Mark an existing reservation as cancelled.
@app.delete('/reserve/cancel/{reservation_id}')
def cancel_reservation(user: user_dependency, db: db_dependency, reservation_id: int):

    if user is None:
        raise HTTPException(status_code=401, detail='Failed Authentication')

    reservation = db.query(Reservations).filter(Reservations.id == reservation_id).first()
    if reservation is None:
        raise HTTPException(status_code=404, detail='Reservation not found')
    
    reservation.status = 'cancelled'
    db.commit()

    return JSONResponse(status_code=201, content={'message': 'Reservation cancelled successfully'})


# Return all reservations belonging to the current user.
@app.get('/reserve/my')
def my_reservation(user: user_dependency, db: db_dependency):

    if user is None:
        raise HTTPException(status_code=401, detail='Failed Authentication')

    reservations = db.query(Reservations).filter(Reservations.user_id == user.get('id')).all()
    return reservations


# Return all currently issued books for the current user.
@app.get('/issues/my')
def my_issued_books(user: user_dependency, db: db_dependency):

    if user is None:
        raise HTTPException(status_code=401, detail='Failed Authentication')

    issues = db.query(IssueRecords).filter(
        IssueRecords.user_id == user.get('id'),
        IssueRecords.status == 'issued').all()
    return issues