# Workforce Management System

A scalable, event-driven backend system designed to manage employees, departments, and leave requests for high-growth organizations.

> **ℹ️ Implementation Note:**
> While the assessment requested MySQL, this submission utilizes **PostgreSQL** due to local environment constraints. Since the project is built with **TypeORM**, the architecture is database-agnostic. It can be switched to MySQL simply by changing the `type` configuration and the connection string.

## 🚀 Key Features

- **Clean Architecture:** Implements the **Repository Pattern** and **Service Layer** to strictly decouple business logic from data access.
- **Event-Driven Processing:** Uses **RabbitMQ** to offload leave request processing.
  - _Logic:_ Requests $\le$ 2 days are automatically approved by a background worker.
  - _Logic:_ Requests > 2 days are marked as `PENDING_APPROVAL`.
- **Standardized API:** Features global error handling, response wrapping, and strict DTO validation.
- **Scalability:** Optimized database schema with proper indexing on Foreign Keys (`departmentId`, `employeeId`).
- **Observability:** Includes a system health check endpoint (`/v1/health`) monitoring Database, Queue, and Memory usage.

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL (via TypeORM)
- **Message Broker:** RabbitMQ (Microservices)
- **Validation:** class-validator
- **Testing:** Jest

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone [https://github.com/Akorex/Workforce-Management.git](https://github.com/Akorex/Workforce-Management.git)
cd Workforce-Management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment configuration

Create a .env file in the root directory and add the following variables:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/workforce
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

### 4. Run the application

```bash
npm run start:dev
```

The API will be available at: http://localhost:3000/api/v1

### API Endpoints

#### Departments

### Swagger Documentation:

```bash
http://localhost:3000/api
```

1. POST /v1/departments
   Create a new department.
   Body: { "name": "Engineering" }

2. GET /v1/departments/:id/employees?page=1&limit=10
   List employees in a department with pagination metadata.

#### Employees

1. POST /v1/employees
   Create a new employee.
   Body: { "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "departmentId": 'ceae270a-984a-4e38-919c-dcb9f1af2f08' }

2. GET /v1/employees/:id
   Get employee details and their leave history.

#### Leave Request

POST /v1/leave-requests

Submit a leave request.

Body: { "employeeId": 1, "startDate": "2025-12-01", "endDate": "2025-12-03" }
