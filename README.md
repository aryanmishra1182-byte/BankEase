# BankEase — NextGen Net Banking

<p align="center">
  <img src="https://img.shields.io/badge/Java-25-18181B?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Boot-4.x-18181B?style=for-the-badge&logo=springboot&logoColor=6DB33F" />
  <img src="https://img.shields.io/badge/Spring%20Security-JWT-18181B?style=for-the-badge&logo=springsecurity&logoColor=6DB33F" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-18181B?style=for-the-badge&logo=postgresql&logoColor=4169E1" />
  <img src="https://img.shields.io/badge/React-Frontend-18181B?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-Build%20Tool-18181B?style=for-the-badge&logo=vite&logoColor=646CFF" />
</p>

<p align="center">
  A full-stack digital banking application for managing accounts, transfers, bills and loans through a role-aware and security-focused architecture.
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-modules">Modules</a> •
  <a href="#-setup">Setup</a> •
  <a href="#-api-overview">API</a> •
  <a href="#-project-structure">Structure</a>
</p>

---

## ◈ Overview

**BankEase** is a full-stack net-banking application built using **Spring Boot, PostgreSQL and React**.

The system provides separate experiences for:

- **CUSTOMER** — personal banking operations
- **ADMIN** — operational and administrative management

The application brings together account management, fund transfers, bill payments, loan processing and audit visibility within one system.

The project is intentionally modular, with a REST-based backend and a dedicated React frontend.

---

## ◇ Core Capabilities

### Customer Banking

- Register a new customer account
- Secure login using JWT authentication
- View personal accounts
- View balances and account details
- Transfer funds between accounts
- View transaction history
- Browse active billers
- Pay bills
- View bill payment history
- Apply for loans
- Track loan applications
- View approved loans
- Repay active loans
- View repayment history
- View account statements
- Access support contact information

### Administrative Operations

- Admin authentication
- View and manage users
- Activate/block user accounts
- View and manage customer accounts
- Deposit funds into accounts
- Manage billers
- Activate/deactivate billers
- Review loan applications
- Approve or reject loan applications
- Disburse approved loans
- View audit records

---

# ◇ Modules

| Module | Responsibility |
|---|---|
| **User Management** | Registration, authentication, roles and user status |
| **Account Management** | Customer accounts, balances and account status |
| **Transactions** | Fund transfers and transaction history |
| **Bill Payment** | Biller browsing and bill payments |
| **Biller Management** | Administrative control of billers |
| **Loan Management** | Application, review, approval, disbursement and repayment |
| **Audit & Administration** | Administrative operations and audit visibility |

> **Note:** The project does not contain an Investment module.

---

# ◈ Architecture

```text
                         ┌─────────────────────────┐
                         │       React Frontend    │
                         │                         │
                         │  Customer UI             │
                         │  Admin UI                │
                         │  Statements              │
                         │  Loan Desk               │
                         │  Activity / Dashboard    │
                         └────────────┬────────────┘
                                      │
                                      │ REST / JSON
                                      ▼
                 ┌─────────────────────────────────────┐
                 │          Spring Boot Backend        │
                 │                                     │
                 │ Controllers                          │
                 │        ↓                            │
                 │ Services                             │
                 │        ↓                            │
                 │ Repositories / Spring Data JPA       │
                 │        ↓                            │
                 │ Entities                             │
                 └─────────────────┬───────────────────┘
                                   │
                  ┌────────────────┴────────────────┐
                  │                                 │
                  ▼                                 ▼
        ┌───────────────────┐             ┌─────────────────┐
        │ Spring Security   │             │   PostgreSQL    │
        │ JWT + Roles       │             │    Database     │
        └───────────────────┘             └─────────────────┘
