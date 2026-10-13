<div align="center">

# Nest E-commerce API

**A full-featured e-commerce store API built with NestJS, TypeORM, and PostgreSQL.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## Overview

Nest E-commerce API is a complete backend for an online store. It covers the full shopping flow, from catalog browsing to cart management and order placement, with role-based administration and JWT authentication.

## Features

- **Authentication:** registration and login with bcrypt and JWT (Passport), plus admin role management.
- **Catalog:** products with images, filtering, and counts, and full CRUD for brands and categories.
- **Shopping cart:** create a cart, and add, update, or remove items.
- **Orders:** checkout from the cart, order filtering, and order status updates.
- **Users:** admin-facing listing, filtering, and counts.
- **Role-based guards** and a current-user interceptor.
- **Database seeding** with Faker.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL, TypeORM, typeorm-extension |
| Authentication | Passport JWT, bcrypt |
| Validation | class-validator, class-transformer |

## Getting Started

### Prerequisites

- Node.js and npm
- A PostgreSQL database

### Installation

```bash
git clone https://github.com/RithyBondeth/Nest-Ecommerce-Api.git
cd Nest-Ecommerce-Api
npm install
npm run seed          # optional demo data
npm run start:dev
```

The API is served at `http://localhost:3000/api`.

### Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `DATABASE_SYNCHRONIZE` | Auto-sync the schema (development only) |
| `JWT_SECRET`, `JWT_EXPIRE_IN` | Token signing |

## Project Structure

```text
Nest-Ecommerce-Api/
└── src/
    ├── auth/         # Register, login, role updates
    ├── user/         # User management
    ├── product/      # Products, plus brand/ and category/ submodules
    ├── cart/         # Cart and cart items
    ├── order/        # Orders and order status
    ├── entities/     # TypeORM entities
    ├── guards/       # Auth and role guards
    └── config/       # Database and JWT configuration
```

## Author

**Rithy Bondeth** — Full Stack Developer & AI Engineer

[![Portfolio](https://img.shields.io/badge/Portfolio-0A0A0A?style=for-the-badge&logo=vercel&logoColor=white)](https://bondeth.dev)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RithyBondeth)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rithy-bondeth-484073282/)
