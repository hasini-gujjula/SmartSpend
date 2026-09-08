# SmartSpend

SmartSpend is a full-stack expense tracking application that helps users manage, search, filter, and analyze their personal expenses securely.

## Features

- User registration and login
- JWT-based authentication
- Secure password encryption using BCrypt
- Add expenses
- Edit expenses
- Delete expenses
- Search expenses by title
- Filter expenses by category
- Pagination
- Expense statistics
- User-specific data isolation
- Input validation
- Responsive user interface
- RESTful APIs

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Maven
- JWT
- BCrypt

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Database
- MySQL 8

### Tools
- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git
- GitHub

## Application Architecture

```text
React Frontend
       |
       | REST API
       ↓
Spring Boot Backend
       |
       ├── Spring Security + JWT
       |
       ├── Service Layer
       |
       ├── Repository Layer
       |
       ↓
    MySQL Database