# Personal Finance Tracker

A full-stack web app to track income, expenses, monthly budgets, and generate reports.
Built to demonstrate practical Java full-stack skills: REST APIs, JWT auth, JPA, and Angular.

## Tech Stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Frontend   | Angular 18 (standalone components), Chart.js |
| Backend    | Spring Boot 3.3, Spring Security, Spring Data JPA |
| Database   | MySQL                                        |
| Auth       | JWT (stateless)                              |
| Export     | CSV, PDF (iText)                             |

## Features

- Signup / login with JWT — each user only sees their own data
- Dashboard with pie chart (spend by category) and bar chart (income vs expense by month)
- Add / edit / delete transactions (income & expense) with category, date, amount, notes
- Set monthly budgets per category with a progress bar and over-budget alert
- Export all transactions as CSV or PDF

## Project Structure

```
finance-tracker/
├── backend/     # Spring Boot REST API
└── frontend/    # Angular app
```

## Getting Started

### 1. Database
Create a MySQL database (or let the app auto-create it):
```sql
CREATE DATABASE finance_tracker;
```
Update credentials in `backend/src/main/resources/application.properties`:
```
spring.datasource.username=root
spring.datasource.password=your_mysql_password
jwt.secret=change_this_to_a_long_random_secret_key_min_32_chars
```

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`.

### 3. Frontend
```bash
cd frontend
npm install
ng serve
```
Runs on `http://localhost:4200`. Open it in your browser (or on your phone using your laptop's local IP, e.g. `http://192.168.1.5:4200`, as long as both devices are on the same Wi-Fi and the backend allows CORS — already configured).

## API Overview

| Method | Endpoint                        | Description              |
|--------|----------------------------------|---------------------------|
| POST   | /api/auth/register               | Create account            |
| POST   | /api/auth/login                  | Get JWT token             |
| GET    | /api/transactions                | List transactions         |
| POST   | /api/transactions                | Add transaction           |
| PUT    | /api/transactions/{id}           | Edit transaction          |
| DELETE | /api/transactions/{id}           | Delete transaction        |
| GET    | /api/transactions/export/csv     | Download CSV report       |
| GET    | /api/transactions/export/pdf     | Download PDF report       |
| GET    | /api/budgets?month=YYYY-MM       | List budgets for month    |
| POST   | /api/budgets                     | Set a budget              |
| DELETE | /api/budgets/{id}                | Remove a budget           |

## Notes for Interview / Case Study

- Auth: password hashed with BCrypt, stateless JWT validated on every request via a custom filter.
- Data isolation: every query is scoped to the logged-in user (via Spring Security context), not just filtered client-side.
- Angular uses standalone components + lazy-loaded routes + an HTTP interceptor to attach the JWT automatically.
- Reports are generated server-side (CSV as plain text, PDF via iText) so the browser never needs a heavy PDF library.
