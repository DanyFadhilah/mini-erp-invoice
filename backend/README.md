# Mini ERP API

## Overview

Mini ERP API built with NestJS, Prisma, PostgreSQL, and JWT Authentication.

## Features

* Authentication (JWT)
* Role-Based Access Control (Admin & Staff)
* Customer Management
* Product & Service Management
* Invoice Management
* Invoice Status Management
* Dashboard Summary
* Search & Pagination
* Swagger Documentation

---

## Tech Stack

* NestJS
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Swagger

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mini_erp"
JWT_SECRET="your-secret-key"
```

---

## Database Migration

Run database migrations:

```bash
npx prisma migrate dev
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Seed Database

Populate the database with initial data:

```bash
npm run seed
```

---

## Run Application

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run start:prod
```

Server URL:

```text
http://localhost:3000
```

---

## Swagger Documentation

API documentation is available at:

```text
http://localhost:3000/api-docs
```

---

## Authentication & Authorization

This application uses JWT Authentication.

After login, copy the returned `access_token` and authorize through Swagger or include it in request headers.

Example:

```http
Authorization: Bearer <access_token>
```

---

## User Roles

### Admin

Permissions:

* Full system access
* Manage Customers
* Manage Products
* Manage Invoices
* Update Invoice Status
* Delete Invoices

### Staff

Permissions:

* Access Dashboard
* Manage Customers
* View Products
* Create Invoices
* Update Invoices
* Update Invoice Status

Restrictions:

* Cannot create products
* Cannot update products
* Cannot delete products
* Cannot delete invoices

---

## Default Accounts

### Admin Account

Email:

```text
admin@mail.com
```

Password:

```text
admin123
```

### Staff Account

Email:

```text
staff@mail.com
```

Password:

```text
staff123
```

---

## API Modules

### Auth

* POST `/auth/login`
* GET `/auth/profile`

### Customers

* POST `/customers`
* GET `/customers`
* GET `/customers/:id`
* PATCH `/customers/:id`
* DELETE `/customers/:id`

### Products

* POST `/products`
* GET `/products`
* GET `/products/:id`
* PATCH `/products/:id`
* DELETE `/products/:id`

### Invoices

* POST `/invoices`
* GET `/invoices`
* GET `/invoices/:id`
* PATCH `/invoices/:id`
* DELETE `/invoices/:id`
* PATCH `/invoices/:id/status`

### Dashboard

* GET `/dashboard/summary`

---

## Database Schema Overview

```text
User
 └── Role

Customer
 └── Invoice
      └── InvoiceItem
            └── Product
```

### Product Types

* PRODUCT
* SERVICE

### Invoice Status

* DRAFT
* SENT
* PAID
* OVERDUE
* CANCELLED

---

## Project Structure

```text
src/
├── auth/
├── users/
├── customers/
├── products/
├── invoices/
├── dashboard/
├── prisma/
└── main.ts
```

---

## Author

Developed as a Mini ERP Backend System using NestJS and Prisma.