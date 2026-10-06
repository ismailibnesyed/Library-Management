# Library Management System (FastAPI Backend)

A complete RESTful API for a **Library Management System** built with **FastAPI**, **SQLAlchemy**, and **SQLite**. It includes JWT-based Authentication, Role-Based Access Control (Admin/Librarian vs Member), Book Inventory Management, Book Reservations, Book Issuing, and Automated Fine Calculation for overdue returns.

---

## Backend Live URL

baseUrl: https://library-management-fast-api.onrender.com
Api Docs: https://library-management-fast-api.onrender.com/docs

---

## 🚀 Features

- **User Authentication & Authorization**:
  - User Registration & Login (JWT Token based).
  - Role-based authorization (`librarian` / `admin` and `member`).
  - Password hashing with `bcrypt`.
  - User profile view, update, and password change endpoints.

- **Book Management**:
  - View all available books with pagination and category filtering.
  - Search books by title or author.
  - Create, update, and delete books (Librarian/Admin only).

- **Reservations & Book Issuing**:
  - Book reservation mechanism for members.
  - Book issuing with due date tracking.
  - Book return management with automatic late fee/fine calculation.

- **Interactive API Documentation**:
  - Auto-generated Swagger UI and ReDoc interface.

---

## 🛠️ Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: SQLite (via [SQLAlchemy](https://www.sqlalchemy.org/))
- **Security & Auth**: PyJWT / `python-jose`, `passlib` with `bcrypt`
- **Data Validation**: [Pydantic](https://docs.pydantic.dev/)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)

---

## 📂 Project Structure

```text
.
├── main.py              # FastAPI application entry point & CORS configuration
├── database.py          # SQLite DB connection & Session setup
├── models.py            # SQLAlchemy Database Models (Users, Books, Reservations, IssueRecords)
├── requirements.txt     # Python dependencies
├── router/
│   ├── auth.py          # Authentication & User Management Routes
│   └── admin.py         # Book Management, Reservations & Issuing Routes
└── library.db           # SQLite database file (auto-created on startup)
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites

Make sure you have **Python 3.8+** installed on your system.

### 2. Quick Start (Run Steps)

```bash
# 1. Project directory তে ঢুকুন (ইতিমধ্যে ফোল্ডারে থাকলে এই কমান্ড দরকার নেই)
cd library-management-fast-api

# 2. Virtual Environment তৈরি করুন
python -m venv venv

# 3. Virtual Environment অ্যাক্টিভ করুন (Windows PowerShell)
.\venv\Scripts\Activate
# Linux / macOS হলে: source venv/bin/activate

# 4. ডিপেন্ডেন্সি ইন্সটল করুন
pip install -r requirements.txt

# 5. প্রজেক্ট রান করুন
uvicorn main:app --reload
```

---

**On Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\Activate
```

**On macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies

Install all required packages from `requirements.txt`:

```bash
pip install -r requirements.txt
```

---

## 🏃 Running the Application

Start the FastAPI development server using `uvicorn`:

```bash
uvicorn main:app --reload
```

The server will start at: `http://127.0.0.1:8000`

---

## 📖 API Documentation & Testing

FastAPI automatically generates interactive API documentation. Once the server is running, open your browser and navigate to:

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🔑 Main API Endpoints Summary

### 🔐 Authentication (`/router/auth.py`)

- `POST /create_user` - Register a new user (`librarian` or `member`)
- `POST /login` - Login with credentials and retrieve a Bearer JWT Token
- `GET /me` - Get current user profile
- `PUT /me/update` - Update profile information
- `PUT /me/change_password` - Change account password

### 📚 Book & Admin Operations (`/router/admin.py`)

- `GET /books/all` - List all books
- `POST /admin/create_book` - Add a new book (Admin/Librarian)
- `PUT /admin/update_book/{book_id}` - Update book details (Admin/Librarian)
- `DELETE /admin/delete_book/{book_id}` - Delete a book (Admin/Librarian)
- `POST /issue_book` - Issue a book to a user
- `POST /return_book/{record_id}` - Return an issued book and calculate fines if overdue

---

## 📜 License

This project is created for educational purposes. Feel free to modify and extend it!
