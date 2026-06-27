# Mini ERP

A full-stack Mini ERP (Enterprise Resource Planning) application built with **Next.js**, **NestJS**, **Prisma**, and **PostgreSQL**. This project provides customer management, product management, invoice management, authentication, and dashboard analytics.

---

## Features

### Authentication & Authorization

* JWT Authentication
* Role-Based Access Control (Admin & Staff)

### Customer Management

* Create Customer
* Update Customer
* Delete Customer
* Search & Pagination

### Product & Service Management

* CRUD Products
* Product & Service Types

### Invoice Management

* Create Invoice
* Update Invoice
* Delete Invoice
* Invoice Status Management
* Invoice Details

### Dashboard

* Summary Statistics
* Revenue Overview
* Invoice Analytics

### Frontend

* Responsive UI
* Form Validation
* Dashboard Charts
* Authentication
* Protected Routes

---

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Shadcn UI
* React Hook Form
* Zod
* TanStack Query
* Axios

### Backend

* NestJS
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Swagger

---

## Repository Structure

```text
mini-erp/
├── frontend/
│   ├── src/
│   ├── public/
│   └── README.md
│
├── backend/
│   ├── prisma/
│   ├── src/
│   └── README.md
│
└── README.md
```

---

## Installation

Clone repository

```bash
git clone <repository-url>

cd mini-erp
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Environment Variables

### Backend

Create `.env`

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mini_erp"
JWT_SECRET="your-jwt-secret"
```

### Frontend

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Running the Project

Backend

```bash
cd backend
npm run start:dev
```

Frontend

```bash
cd frontend
npm run dev
```

---

## API Documentation

Swagger

```text
http://localhost:3000/api-docs
```

---

## Default Accounts

### Admin

Email

```text
admin@mail.com
```

Password

```text
admin123
```

### Staff

Email

```text
staff@mail.com
```

Password

```text
staff123
```

---

## Screenshots

Desktop
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/555a38dc-216c-4477-a9ed-77f5faf7928f" />
<img width="1920" height="1019" alt="image" src="https://github.com/user-attachments/assets/fd3bac42-8faf-44a2-b694-d0c235792f06" />
<img width="1920" height="1021" alt="image" src="https://github.com/user-attachments/assets/87c3237a-1936-4198-961d-84f55293207c" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/4ab56a68-8f3f-4d7e-9543-8cb06e079462" />
<img width="1920" height="1017" alt="image" src="https://github.com/user-attachments/assets/a322c103-1cdd-4bd3-8081-45c77f3db161" />
<img width="1920" height="1018" alt="image" src="https://github.com/user-attachments/assets/b5e5512b-5180-4efe-a51c-b6b33f83a112" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/5240c534-3202-454d-a601-812180283a4f" />
<img width="1920" height="1021" alt="image" src="https://github.com/user-attachments/assets/57765b56-1f71-4b21-aaac-221016f29c46" />
<img width="1920" height="1017" alt="image" src="https://github.com/user-attachments/assets/2a3decef-f5ca-4630-b9df-e8036d1ef019" />
<img width="1920" height="1018" alt="image" src="https://github.com/user-attachments/assets/4a75a980-7271-4472-b58e-9c8f3744a78d" />

Tablet
<img width="1920" height="928" alt="image" src="https://github.com/user-attachments/assets/434b59c8-fb9d-4c8b-bf63-ab8b40cc71e2" />
<img width="1920" height="931" alt="image" src="https://github.com/user-attachments/assets/c2a73c76-814b-490b-a737-57e4ab0c690c" />
<img width="1920" height="934" alt="image" src="https://github.com/user-attachments/assets/013f33f7-fcf5-45ba-b1a1-4ad199763194" />
<img width="1920" height="928" alt="image" src="https://github.com/user-attachments/assets/faa00ff7-5621-4a85-bd47-6fc39b427f38" />

Mobile
<img width="1920" height="932" alt="image" src="https://github.com/user-attachments/assets/735b50f3-9005-4000-8c14-a20f4b7c7af1" />
<img width="1920" height="932" alt="image" src="https://github.com/user-attachments/assets/9d16dd4d-3cfc-4b22-b596-c31256b9f34a" />
<img width="1920" height="929" alt="image" src="https://github.com/user-attachments/assets/086110fa-fcb0-490c-998c-b9dd08a41bce" />
<img width="1920" height="933" alt="image" src="https://github.com/user-attachments/assets/70b1abdd-dd60-4827-bdf6-cdd80f55965c" />
<img width="1918" height="930" alt="image" src="https://github.com/user-attachments/assets/e8b35164-fe07-4d8a-8003-e01976651d7d" />
