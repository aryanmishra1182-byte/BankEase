🏦 BankEase — NextGen Net Banking

<p align="center">
  <strong>A full-stack digital banking platform built with Spring Boot, PostgreSQL and React.</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-modules">Modules</a> •
  <a href="#-security">Security</a> •
  <a href="#-setup">Setup</a> •
  <a href="#-api-surface">API</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-25-111827?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 25"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-4.x-123524?style=for-the-badge&logo=springboot&logoColor=6DB33F" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/Spring%20Security-JWT-17202A?style=for-the-badge&logo=springsecurity&logoColor=6DB33F" alt="Spring Security"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Database-1F2937?style=for-the-badge&logo=postgresql&logoColor=4169E1" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/React-Frontend-111827?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-Frontend%20Tooling-111827?style=for-the-badge&logo=vite&logoColor=646CFF" alt="Vite"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/REST-API-8B5E34?style=flat-square" alt="REST API"/>
  <img src="https://img.shields.io/badge/JPA-Hibernate-596E79?style=flat-square" alt="JPA Hibernate"/>
  <img src="https://img.shields.io/badge/Maven-Build-C71A36?style=flat-square&logo=apachemaven&logoColor=white" alt="Maven"/>
  <img src="https://img.shields.io/badge/BCrypt-Password%20Hashing-6B7A4F?style=flat-square" alt="BCrypt"/>
</p>

✦ Overview

BankEase is a full-stack net-banking application designed around two operational experiences:

Role

Purpose

👤 CUSTOMER

Personal banking: accounts, transfers, bills, loans and statements

🛡️ ADMIN

Operational banking: users, accounts, billers, loan review, disbursement and audits

The backend exposes REST APIs through Spring Boot. The React frontend consumes those APIs and provides separate customer and administrative workspaces.

Scope note: BankEase does not contain an Investment module.

✦ What BankEase Covers

                        BANKEASE
                           │
             ┌─────────────┴─────────────┐
             │                           │
         CUSTOMER                     ADMIN
             │                           │
      ┌──────┼──────┐            ┌───────┼────────┐
      │      │      │            │       │        │
   Accounts Bills  Loans       Users   Accounts  Billers
      │      │      │            │       │        │
 Transfers  Pay   Repay       Status   Deposit  Status
      │             │
 Transactions      Loan Desk
                    │
             Review → Disburse
                    │
                 Audit Log

◈ Features

👤 Customer Workspace

🔐 Customer registration and login

🎫 JWT-based authenticated sessions

💳 Account viewing and balance visibility

🔁 Fund transfers between accounts

🧾 Transaction history

🔎 Transaction search and filtering

🏪 Biller browsing

💸 Bill payments

📋 Bill payment history

🏠 Loan applications

📌 Loan application status

💰 Loan disbursement visibility

💵 Loan repayments

📚 Repayment history

📄 Account statement view

🖨️ Print-friendly statement experience

📥 Statement-oriented export functionality

☎️ Integrated support contact

🛡️ Admin Workspace

👥 Customer management

🔒 User status management

🏦 Account administration

💰 Account deposits

🏪 Biller administration

✅ Biller activation/deactivation

📝 Loan application review

✔️ Loan approval/rejection

💸 Approved loan disbursement

🧾 Audit log visibility

📊 Operational dashboard

◈ Modules

#

Module

Main Responsibilities

01

User Management

Registration, authentication, roles, status

02

Account Management

Accounts, balances, status and administration

03

Transactions

Fund transfers and transaction history

04

Bill Payment

Biller browsing and payment workflows

05

Biller Management

Administrative biller control

06

Loan Management

Application, review, disbursement and repayment

07

Audit & Administration

Administrative actions and audit visibility

◈ Architecture

flowchart TB
    UI["React + Vite Frontend"]
    AUTH["JWT / Role-aware Security"]
    API["Spring Boot REST API"]
    CTRL["Controllers"]
    SERVICE["Services"]
    REPO["Spring Data JPA Repositories"]
    DB[("PostgreSQL")]

    UI -->|REST / JSON| AUTH
    AUTH --> API
    API --> CTRL
    CTRL --> SERVICE
    SERVICE --> REPO
    REPO --> DB

Layered Backend

┌──────────────────────────────────────┐
│            React Frontend            │
└──────────────────┬───────────────────┘
                   │ REST / JSON
                   ▼
┌──────────────────────────────────────┐
│        Spring Boot Controllers       │
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│             Services                 │
│       Business Rules + Logic         │
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│     Spring Data JPA Repositories     │
└──────────────────┬───────────────────┘
                   ▼
┌──────────────────────────────────────┐
│             PostgreSQL               │
└──────────────────────────────────────┘

◈ Security

BankEase uses Spring Security + JWT with role-aware authorization.

Authentication flow

sequenceDiagram
    participant C as Customer
    participant F as React Frontend
    participant S as Spring Security
    participant A as Auth Service
    participant DB as PostgreSQL

    C->>F: Submit email + password
    F->>A: POST /login
    A->>DB: Find user
    DB-->>A: User + BCrypt hash
    A->>A: Verify password
    A-->>F: JWT + user data
    F->>S: Bearer JWT
    S->>S: Validate token + role
    S-->>F: Authorized request

Role boundaries

PUBLIC
 ├── POST /users
 └── POST /login

CUSTOMER
 ├── /accounts/**
 ├── /transactions/**
 ├── /bills/**
 └── /loans/**

ADMIN
 └── /admin/**

AUTHENTICATED
 └── /billers/**

Security mechanisms

🔐 BCrypt password hashing

🎫 JWT authentication

🧩 Role-based authorization

🚫 Protected administrative routes

✅ Bean validation

🧯 Centralized exception handling

🔑 Environment-based secret configuration

Credentials and secrets should be provided through environment variables or IntelliJ Run/Debug configuration and should not be committed to GitHub.

◈ Loan Lifecycle

flowchart LR
    P["PENDING"] -->|Review| D{"Decision"}
    D -->|Approve| A["APPROVED"]
    D -->|Reject| R["REJECTED"]
    A --> X["DISBURSED"]
    X --> L["ACTIVE"]
    L --> RP["REPAYMENTS"]

Business checks include

An already reviewed application cannot be reviewed again.

Approval requires a valid positive approved amount.

Approved amount cannot exceed requested amount.

A rejected application does not retain an approved amount.

Disbursement requires an approved application.

Repayment is restricted according to loan state and amount rules.

◈ Domain Model

erDiagram
    USERS ||--o{ ACCOUNT : owns
    USERS ||--o{ TRANSACTION : performs
    USERS ||--o{ LOAN_APPLICATION : submits
    ACCOUNT ||--o{ TRANSACTION : records
    ACCOUNT ||--o{ BILL_PAYMENT : makes
    ACCOUNT ||--o{ LOAN : receives
    LOAN_APPLICATION ||--o| LOAN : becomes
    LOAN ||--o{ LOAN_REPAYMENT : receives
    BILLER ||--o{ BILL_PAYMENT : receives
    USERS ||--o{ AUDIT_LOG : associated

Primary domain entities include:

Users
Account
Transaction
Biller
BillPayment
LoanApplication
Loan
LoanRepayment
AuditLog

◈ Technology Stack

Backend

Technology

Role

☕ Java 25

Application language

🌱 Spring Boot

Backend framework

🌐 Spring Web

REST API layer

🔐 Spring Security

Authentication and authorization

🎫 JWT

Stateless authentication

🗃️ Spring Data JPA

Persistence

🧩 Hibernate

ORM

🐘 PostgreSQL

Database

🔒 BCrypt

Password hashing

📦 Maven

Build/dependency management

Frontend

Technology

Role

⚛️ React

UI layer

⚡ Vite

Development/build tooling

🟨 JavaScript

Frontend logic

🎨 CSS

Visual system

✦ Lucide

Interface icons

◈ Frontend Experience

The frontend follows a distinctive Ledger Noir design language:

CHARCOAL  ██████████
IVORY     ██████████
COPPER    ██████████
OLIVE     ██████████

Design principles

Editorial rather than generic SaaS styling

High-readability financial typography

Warm financial-document palette

Minimal rounded containers

Transaction-oriented information hierarchy

Responsive customer/admin workspaces

Interactive drawers, receipts and detail views

Statement-oriented presentation

◈ Customer Flow

flowchart TD
    L["Login / Sign up"] --> O["Customer Overview"]
    O --> A["Accounts"]
    O --> T["Transfer"]
    O --> B["Bills & Pay"]
    O --> LO["Loans"]
    O --> ST["Statement"]
    O --> AC["Activity"]

    T --> TX["Transaction Record"]
    B --> BP["Bill Payment Record"]
    LO --> LA["Loan Application"]
    LA --> LS["Loan Status"]
    LS --> LD["Loan Disbursement"]
    LD --> LR["Loan Repayment"]

◈ Admin Flow

flowchart TD
    AL["Admin Login"] --> AO["Admin Overview"]

    AO --> U["Users"]
    AO --> AC["Accounts"]
    AO --> BI["Billers"]
    AO --> LD["Loan Desk"]
    AO --> AU["Audit Center"]

    LD --> REV["Review Application"]
    REV --> AP["Approve"]
    REV --> RJ["Reject"]
    AP --> DIS["Disburse Loan"]

◈ API Surface

Endpoint availability should be treated as the source-code contract and checked against the current controllers in this repository.

Authentication

POST /users
POST /login

Accounts

GET /accounts
GET /accounts/{accountNumber}

Transactions

GET  /transactions
GET  /transactions/{reference}
POST /transactions/transfer

Billers / Bills

GET  /billers
GET  /bills/payments
POST /bills/payments

Loan Applications

POST /loans/applications
GET  /loans/applications
GET  /loans/applications/{applicationReference}

Loans

GET  /loans
GET  /loans/{loanReference}
POST /loans/{loanReference}/repay
GET  /loans/{loanReference}/repayments

Administration

GET   /admin/users
GET   /admin/accounts
GET   /admin/billers
GET   /admin/audit-logs

PATCH /admin/users/{id}/status
PATCH /admin/accounts/{accountNumber}/status

POST  /admin/accounts/{accountNumber}/deposit

POST  /admin/billers
PATCH /admin/billers/{id}/status

PATCH /admin/loans/applications/{applicationReference}/status

POST /admin/loans/applications/{applicationReference}/disburse

◈ Exception Handling

The backend centralizes application errors using:

@RestControllerAdvice

The application contains dedicated exceptions for areas including:

UserNotFoundException
AccountNotFoundException
InvalidCredentialsException
InsufficientBalanceException
AccountBlockedException
SameAccountTransferException

BillerNotFoundException
BillerNotActiveException
BillPaymentNotFoundException

LoanApplicationNotFoundException
LoanAlreadyReviewedException
InvalidLoanDecisionException
LoanNotFoundException
LoanNotActiveException
LoanAlreadyDisbursedException
InvalidLoanRepaymentException
ApplicationNotApprovedException

This keeps error behavior consistent across the API.

◈ Project Structure

bankease/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── bankease/
│       │           ├── config/
│       │           ├── controller/
│       │           ├── dto/
│       │           ├── entity/
│       │           ├── exception/
│       │           ├── repository/
│       │           └── service/
│       │
│       └── resources/
│           └── application.properties
│
├── bankease_frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── api.js
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
│
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
└── README.md

◈ Getting Started

Requirements

Install:

Java 25
PostgreSQL
Node.js
npm
Git

1. Clone

git clone https://github.com/aryanmishra1182-byte/bankease.git
cd bankease

2. Create PostgreSQL database

CREATE DATABASE bankease;

Default local connection expected by the application:

Host:     localhost
Port:     5432
Database: bankease
Username: postgres

3. Configure environment variables

Set these through IntelliJ Run/Debug configuration, your shell, or another secure local mechanism:

DB_PASSWORD=your_postgres_password
JWT_SECRET=your_long_random_secret
ADMIN_EMAIL=admin@bankease.com
ADMIN_PASSWORD=your_admin_password

Example application.properties references:

spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
admin.email=${ADMIN_EMAIL:admin@bankease.com}
admin.password=${ADMIN_PASSWORD}

Never commit

.env
real passwords
JWT secrets
private keys
production credentials

◈ Run the Backend

From the project root:

Windows

.\mvnw.cmd spring-boot:run

Or use IntelliJ:

Run → BankeaseApplication

Backend:

http://localhost:8080

◈ Run the Frontend

Open a second terminal:

cd bankease_frontend
npm install
npm run dev

Frontend:

http://localhost:5173

◈ Recommended Test Sequence

1. Start PostgreSQL
        ↓
2. Start Spring Boot
        ↓
3. Verify database connection
        ↓
4. Start React
        ↓
5. Create customer account
        ↓
6. Login as CUSTOMER
        ↓
7. Check accounts
        ↓
8. Test transfer
        ↓
9. Check transaction history
        ↓
10. Browse billers
        ↓
11. Pay a bill
        ↓
12. Apply for a loan
        ↓
13. Login as ADMIN
        ↓
14. Review application
        ↓
15. Approve / reject
        ↓
16. Disburse approved loan
        ↓
17. Login as CUSTOMER
        ↓
18. Repay loan
        ↓
19. Check repayment history
        ↓
20. Check audit records

◈ Build Checks

Backend

.\mvnw.cmd clean test

Frontend

cd bankease_frontend
npm run build

A clean project should compile successfully before deployment or submission.

◈ Environment Separation

BankEase keeps sensitive configuration outside source control.

Source Code
     │
     ├── application.properties
     │       └── references variables
     │
     ▼
Environment
     │
     ├── DB_PASSWORD
     ├── JWT_SECRET
     ├── ADMIN_EMAIL
     └── ADMIN_PASSWORD

This lets the same codebase run with different local, testing and deployment credentials.

◈ Current Scope

✅ Customer registration
✅ Customer authentication
✅ JWT authorization
✅ User administration
✅ Account administration
✅ Account balances
✅ Fund transfers
✅ Transaction history
✅ Biller browsing
✅ Bill payments
✅ Loan applications
✅ Loan review
✅ Loan approval/rejection
✅ Loan disbursement
✅ Loan repayment
✅ Repayment history
✅ Audit logs
✅ Customer dashboard
✅ Admin dashboard
✅ Statement interface
✅ Responsive frontend
✅ Integrated support contact

❌ Investment module

◈ Future Scope

Potential extensions, separate from the current implementation:

Multi-factor authentication

Notification services

Automated test expansion

Production observability

External payment integrations

CI/CD

Cloud deployment

Advanced reporting

These are not part of the current implementation unless added to the codebase.

◈ Screenshots

Add real screenshots after the application is fully tested.

Recommended repository layout:

docs/
└── screenshots/
    ├── login.png
    ├── customer-dashboard.png
    ├── accounts.png
    ├── transfer.png
    ├── bills.png
    ├── loans.png
    ├── admin-loan-desk.png
    └── audit-center.png

Then embed them here:

## Customer Dashboard

![Customer Dashboard](docs/screenshots/customer-dashboard.png)

## Admin Loan Desk

![Admin Loan Desk](docs/screenshots/admin-loan-desk.png)

◈ Engineering Practices

BankEase follows a layered backend architecture:

Controller
    ↓
Service
    ↓
Repository
    ↓
Database

Key practices include:

DTO-based request/response handling

Bean validation

Centralized exception handling

JWT-based authentication

Role-based authorization

BCrypt password hashing

JPA entity relationships

Transactional business operations

Environment-based secrets

Separate customer/admin UI flows

◈ Repository

GitHub

👉 aryanmishra1182-byte/bankease

👨‍💻 Author

Aryan Mishra

B.Tech — Computer Science & Engineering (Data Science)

GitHub:
https://github.com/aryanmishra1182-byte

<p align="center">
  <strong>BankEase — NextGen Net Banking</strong>
  <br/>
  Built with Java • Spring Boot • PostgreSQL • React
</p>

<p align="center">
  <sub>Full-stack academic project • REST architecture • JWT security • Role-based banking workflows</sub>
</p>
