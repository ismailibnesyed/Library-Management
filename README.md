# Library Management System

This project is a simple library management application built with a Python backend and a React frontend.

It allows:
- Members to sign up, log in, browse books, reserve books, and view their issues
- Librarians to add, update, delete books and manage issue/return records
- A SQLite database to store users, books, reservations, and issue history

This project is designed to be beginner-friendly and easy to understand for students learning full-stack development.

---

## Project Overview

The app has two main parts:

1. Backend (Python + FastAPI)
   - Handles authentication
   - Manages users and books
   - Supports reservations and issue records
   - Stores all information in SQLite

2. Frontend (React + Vite)
   - User-friendly interface for login/signup
   - Book browsing and details pages
   - Admin pages for managing books and issues

---

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- Supabase PostgreSQL (SQLite fallback for local development)
- JWT Authentication
- Passlib for password hashing

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- DaisyUI

---

## Main Features

### For Members
- Create account
- Login securely
- View all books
- Search and open book details
- Reserve a book
- View my reservations
- View my issued books
- Change password

### For Librarians/Admin
- Add new books
- Edit existing books
- Delete books
- Issue books to members
- Return books
- Track fines
- Manage reservations and issue records

---

## Prerequisites

Before running the project, make sure you have installed:

- Python 3.10 or newer
- Node.js and npm
- A code editor like VS Code

### Database configuration

The backend uses the Supabase PostgreSQL connection configured in
`database.py`. Keep the connection string private and never commit credentials
to a public repository.

---

## Folder Structure

```bash
Library Management/
├── main.py                 # FastAPI app entry point and API route registration
├── database.py             # SQLite database connection and SQLAlchemy setup
├── models.py               # Database table models: users, books, reservations, issue_records
├── library.db              # SQLite database file
├── router/
│   ├── auth.py             # User login, signup, profile update and password change APIs
│   └── admin.py            # Admin/librarian APIs for books, issues, returns, and fines
├── react/                  # Frontend app
│   ├── package.json
│   ├── src/
│   └── vite.config.js
└── README.md
```

---

## Backend File Details

### `main.py`
This is the main FastAPI application file.

It does the following:
- Creates the FastAPI app
- Enables CORS so the React app can call the backend from `http://localhost:5173`
- Creates database tables with `models.Base.metadata.create_all(bind=engine)`
- Includes backend routers from `router/auth.py` and `router/admin.py`
- Defines main application endpoints such as:
  - `GET /user`
  - `GET /books/all`
  - `GET /books/{book_id}`
  - `POST /reserve/{book_id}`
  - `DELETE /reserve/cancel/{reservation_id}`
  - `GET /reserve/my`
  - `GET /issues/my`

These routes are used by members to view books, reserve books, and see their own issue records.

### `database.py`
This file connects the app to SQLite.

It contains:
- the database URL: `sqlite:///./library.db`
- the SQLAlchemy engine
- the `SessionLocal` object used to create database sessions
- the `Base` class used by all models

This file is very important because every model and route needs the database session.

### `models.py`
This file defines all database tables.

#### `Users`
Stores:
- `id`
- `email`
- `username`
- `firstname`
- `lastname`
- `hash_password`
- `is_active`
- `role` (`member` or `librarian`)

#### `Books`
Stores:
- `title`
- `author`
- `category`
- `description`
- `price`
- `total_copies`
- `available_copies`
- `cover_image`
- `created_at`

#### `Reservations`
Stores book reservations made by users:
- `book_id`
- `user_id`
- `reservation_date`
- `status` (`pending`, `approved`, `cancelled`)

#### `IssueRecords`
Stores issued books and return information:
- `book_id`
- `user_id`
- `issue_date`
- `due_date`
- `return_date`
- `status` (`issued`, `returned`)
- `fine_amount`
- `fine_paid`

### `router/auth.py`
This file handles user authentication and account operations.

It contains:
- user creation route: `POST /createuser`
- login route: `POST /login`
- token generation using JWT
- authenticated user detection with `get_current_user()`
- profile update route: `PUT /edituser`
- password change route: `PUT /passwordchange`

Important logic:
- Passwords are hashed using `passlib` and `bcrypt`
- A JWT token is returned after successful login
- That token is sent in the `Authorization` header for protected routes

### `router/admin.py`
This file handles librarian/admin actions.

It contains:
- `POST /admin/create_book` → add a book
- `PUT /admin/update_book/{book_id}` → edit book details
- `DELETE /admin/delete_book/{book_id}` → delete a book
- `POST /admin/create_issue` → issue a book to a member
- `PUT /admin/return_book/{issue_id}` → mark a book as returned
- `PUT /admin/fine/pay/{issue_id}` → mark fine as paid

Admin-only logic:
- Only users with `role == 'librarian'` can access these routes
- Book quantity is reduced when a copy is issued
- Book quantity is increased when a book is returned
- A fine is calculated if the book is returned after the due date

---

## Frontend Structure

The frontend is inside the `react` folder.

```bash
react/
├── index.html              # Main HTML file for Vite
├── package.json            # Frontend dependencies and scripts
├── vite.config.js          # Vite configuration
├── public/                 # Static public files
├── src/                    # Main React source code
│   ├── App.css             # Global styling for the app
│   ├── App.jsx             # Main app component and route container
│   ├── index.css           # Base CSS styling
│   ├── main.jsx            # React app entry point
│   ├── assets/             # Images and media files
│   ├── component/          # Reusable UI components
│   │   ├── BookCard.jsx    # Book card display
│   │   ├── FeatureBook.jsx # Featured book section
│   │   ├── Footer.jsx      # Footer section
│   │   ├── HeroBanner.jsx  # Homepage banner
│   │   └── Navbar.jsx      # Top navigation bar
│   ├── context/            # Context providers
│   │   └── AuthProvider.jsx # User auth state provider
│   ├── layout/             # Layout wrappers for pages
│   │   ├── AdminLayout.jsx # Admin dashboard layout
│   │   └── Root.jsx        # Main root layout
│   ├── pages/              # Individual pages/screens
│   │   ├── Home.jsx        # Homepage
│   │   ├── Login.jsx       # Login page
│   │   ├── SignUp.jsx      # Signup page
│   │   ├── UserPage.jsx    # User profile/dashboard page
│   │   ├── BrowseBooks.jsx # Book listing page
│   │   ├── BookDetails.jsx # Book details page
│   │   ├── MyIssue.jsx     # User issued books page
│   │   ├── MyReserve.jsx   # User reservation page
│   │   ├── ChangePassword.jsx # Password update page
│   │   └── admin/          # Admin pages
│   │       ├── EditBook.jsx       # Edit book form
│   │       ├── IssueBook.jsx      # Issue a book to user
│   │       ├── ManageBook.jsx     # Book management page
│   │       └── ManageIssueBook.jsx # Issue management page
│   ├── routes/             # Route protection logic
│   │   ├── AdminProtected.jsx # Protect admin-only pages
│   │   ├── PrivateRoutes.jsx  # Protect logged-in user pages
│   │   └── Routes.jsx         # App route definitions
│   └── services/           # API connection helpers
│       └── BaseUrl.jsx     # Base URL used for backend requests
└── README.md               # Default Vite React README
```

### Frontend Purpose by Folder

- `src/pages/` → main screens for the app
- `src/component/` → reusable UI elements used across pages
- `src/context/` → global app state, especially authentication
- `src/layout/` → shared page layout and wrapper components
- `src/routes/` → private/admin route protection
- `src/services/` → backend API calls
- `src/assets/` → images and static resources

---

## Setup Instructions

### 1. Open the project folder

Open the project in VS Code or your preferred editor.

### 2. Install backend dependencies

Open a terminal in the project root and run:

```bash
pip install fastapi uvicorn sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart
```

If you prefer, you can also install a broader package set:

```bash
pip install "fastapi[all]"
```

### 3. Install frontend dependencies

Open a terminal inside the `react` folder:

```bash
cd react
npm install
```

---

## Run the Application

### Start the backend

From the project root:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will run at:

- http://localhost:8000

You can also open the FastAPI docs here:

- http://localhost:8000/docs

### Start the frontend

From the `react` folder:

```bash
npm run dev
```

Then open:

- http://localhost:5173

---

## Default API Behavior

This project uses:
- SQLite database file: `library.db`
- CORS enabled for frontend origin: `http://localhost:5173`
- JWT tokens for authentication

If the frontend is not able to connect to the backend, make sure:
- The backend is still running
- You are using the correct local port
- The frontend is making requests to `localhost:8000`

---

## Common Login Roles

The system supports two roles:

- `member`
- `librarian`

Librarian routes are protected and can only be used by users with the librarian role.

---

## Beginner Tips

- Start by checking the backend routes in `router/auth.py` and `router/admin.py`
- Look at `models.py` to understand the database tables
- Read `main.py` to see how the API is connected
- Use the frontend pages in the `react/src/pages` folder to understand the app flow
- If something fails, check the terminal output first

---

## Troubleshooting

### Backend not starting
- Make sure Python packages are installed
- Check for errors in `main.py` or `router` files
- Run the app again after fixing the error

### Frontend not loading
- Run `npm install` inside the `react` folder
- Make sure the Vite dev server started without errors
- Check if port `5173` is already in use

### Database issues
- The database file is created automatically when the app runs
- If needed, delete `library.db` and restart the backend to recreate it

---

## Suggested Next Steps

If you want to improve the project, you can try:
- Add a book search box
- Add book categories filtering
- Improve admin dashboard UI
- Add due-date notifications
- Add user profile pages
- Add tests for backend routes

---

## Conclusion

This project is a good example of a full-stack application combining:
- a Python API for business logic
- a React frontend for user interaction
- a SQLite database for data storage

It is a great beginner project to learn how frontend and backend work together.

---

If you want, I can also create:
1. a more polished version of this README,
2. a setup guide specifically for Windows,
3. a project summary for GitHub, or
4. a complete admin/member user guide.
