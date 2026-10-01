<div align="center">

🏦 BankEase

NextGen Net Banking

A full-stack banking workspace built around real account, transaction, bill-payment and loan workflows.

<br/>

<a href="https://github.com/aryanmishra1182-byte/bankease">
  <img src="https://img.shields.io/badge/Repository-BankEase-161a16?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository"/>
</a>
<img src="https://img.shields.io/badge/Java-25-161a16?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 25"/>
<img src="https://img.shields.io/badge/Spring%20Boot-4.x-161a16?style=for-the-badge&logo=springboot&logoColor=6DB33F" alt="Spring Boot"/>
<img src="https://img.shields.io/badge/PostgreSQL-161a16?style=for-the-badge&logo=postgresql&logoColor=4169E1" alt="PostgreSQL"/>
<img src="https://img.shields.io/badge/React-Vite-161a16?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>

<br/><br/>

<table>
<tr>
<td><b>👤 CUSTOMER</b><br/>Accounts · Transfers · Bills · Loans · Statements</td>
<td><b>🛡️ ADMIN</b><br/>Users · Accounts · Billers · Loan Desk · Audit</td>
</tr>
</table>

</div>

✦ The idea

BankEase is a full-stack web-based net-banking application with two protected workspaces: a customer banking workspace and an administrator control plane.

The backend is built with Java + Spring Boot + Spring Security + JWT + Spring Data JPA/Hibernate + PostgreSQL, while the frontend uses React + Vite + JavaScript + CSS.

The application connects its banking operations into one end-to-end flow:

SIGN UP
   ↓
LOGIN
   ↓
OPEN ACCOUNT
   ↓
FUND ACCOUNT
   ↓
TRANSFER MONEY
   ↓
PAY BILL
   ↓
APPLY FOR LOAN
   ↓
ADMIN REVIEW
   ↓
DISBURSE
   ↓
REPAY
   ↓
AUDIT TRAIL

Scope boundary: Investment services are intentionally not part of the delivered BankEase implementation.

◈ What makes the project different

<table>
<tr>
<td width="50%">

🔐 Security is part of the workflow

BCrypt password hashing

JWT-authenticated sessions

ADMIN / CUSTOMER role boundaries

DTO validation

Centralized exception handling

Server-side ownership checks

</td>
<td width="50%">

💰 Money movement is treated as a business operation

Transfers are validated for:

sender ownership

account status

receiver existence

same-account protection

sufficient balance

duplicate-request protection

transactional balance updates

</td>
</tr>
<tr>
<td>

🏦 Banking operations are connected

A customer action can create an administrative action:

Customer Loan
     ↓
Pending Queue
     ↓
Admin Review
     ↓
Approved / Rejected
     ↓
Disbursement
     ↓
Customer Repayment

</td>
<td>

🧾 Administration is traceable

Important administrative activity is exposed through the audit workspace, including actions such as:

ACCOUNT_DEPOSIT
BILLER_CREATED
LOAN_APPROVED
USER_ACTIVATED
USER_DEACTIVATED

</td>
</tr>
</table>

◈ Module Map

#

Module

Customer

Admin

Core responsibility

01

User Management & Authentication

✓

✓

Registration, login, roles, status and JWT session

02

Account Management

✓

✓

Account creation, balances, status and admin funding

03

Fund Transfer & Transactions

✓

—

Validated money transfers and transaction history

04

Bill Payment

✓

—

Biller discovery, payment processing and history

05

Biller Management

—

✓

Create and activate/deactivate billers

06

Loan Management

✓

✓

Apply → review → approve/reject → disburse → repay

07

Audit & Administration

—

✓

Operational controls and audit visibility

◈ Architecture

flowchart TB

    U["Customer / Admin"]
    FE["React + Vite Frontend"]
    JWT["Spring Security<br/>JWT + Role Authorization"]
    API["Spring Boot REST API"]

    C["Controllers"]
    S["Services<br/>Business Rules"]
    R["Repositories<br/>Spring Data JPA"]
    DB[("PostgreSQL")]

    U --> FE
    FE -->|REST / JSON| JWT
    JWT --> API
    API --> C
    C --> S
    S --> R
    R --> DB

Request path

React UI
   │
   │ HTTP + JSON
   ▼
Spring Security
   │
   ├── JWT validation
   └── role authorization
   │
   ▼
Controller
   │
   ▼
Service
   │
   ├── business validation
   ├── ownership checks
   ├── status checks
   └── transactional operations
   │
   ▼
Repository
   │
   ▼
PostgreSQL

◈ Security Model

BankEase separates authentication, authorization, validation, and business rules.

flowchart LR
    L["Login"] --> V["Verify BCrypt password"]
    V --> J["Issue JWT"]
    J --> R["Attach Bearer token"]
    R --> A["Validate JWT"]
    A --> ROLE{"Role?"}
    ROLE -->|CUSTOMER| C["Customer endpoints"]
    ROLE -->|ADMIN| AD["Admin endpoints"]

Access boundaries

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

✅ Bean validation

🧯 Centralized exception handling

🔑 Environment-based secret configuration

🛡️ Business-level ownership and balance checks

◈ Customer Experience

01 — Identity

Registration
    ↓
Validation
    ↓
Customer record
    ↓
CUSTOMER + ACTIVE
    ↓
Login
    ↓
JWT session

02 — Accounts

Open account
    ↓
SAVINGS / CURRENT
    ↓
Unique account number
    ↓
ACTIVE + ₹0 initial balance
    ↓
View account / statement

03 — Transfer

Choose sender
      ↓
Enter receiver
      ↓
Enter amount
      ↓
Backend validation
      ↓
Ownership + status + balance checks
      ↓
Transactional balance update
      ↓
Transaction record

04 — Bills

Choose active biller
      ↓
Enter consumer reference
      ↓
Enter amount
      ↓
Validate payment
      ↓
Debit account
      ↓
Persist bill payment
      ↓
Receipt / history

◈ Loan Desk

Loan processing is the longest connected workflow in the application.

stateDiagram-v2
    [*] --> PENDING
    PENDING --> APPROVED
    PENDING --> REJECTED
    APPROVED --> DISBURSED
    DISBURSED --> ACTIVE
    ACTIVE --> REPAYMENT
    REPAYMENT --> ACTIVE
    REPAYMENT --> CLOSED
    REJECTED --> [*]
    CLOSED --> [*]

Customer side

Loan type
   +
Requested amount
   +
Tenure
   +
Purpose
       ↓
Create application
       ↓
PENDING

Admin side

Loan Desk
    ↓
Pending application
    ↓
Review applicant
    ↓
APPROVED / REJECTED
    ↓
If approved → DISBURSE

Repayment side

ACTIVE loan
     ↓
Repayment request
     ↓
Validate amount + status + account
     ↓
Reduce outstanding amount
     ↓
Continue ACTIVE
       OR
     CLOSE

◈ Admin Control Plane

The admin workspace is the operational layer over the customer-facing system.

Admin area

What it controls

Overview

Registered users, active billers, pending loans, audit signals

Users

Customer access and active/inactive status

Accounts

Account status and development funding

Billers

Creation and ACTIVE / INACTIVE status

Loan Desk

Pending queue, application review and disbursement

Audit Center

Read-only visibility of important admin actions

◈ Frontend Experience

The interface uses a Ledger Noir visual language instead of a conventional blue fintech dashboard.

CHARCOAL   → workspace / depth
IVORY      → information / hierarchy
COPPER     → action / attention
OLIVE      → healthy system state

Customer workspace

Overview
Accounts
Transfer
Bills & Pay
Loans
Activity
Statement

Admin workspace

Overview
Users
Accounts
Billers
Loan Desk
Audit Center

The frontend also includes interactive filtering, statement presentation, responsive layouts and support contact information.

◈ Backend Structure

src/main/java/com/bankease/
│
├── config/
│   ├── SecurityConfig
│   └── AdminDataInitializer
│
├── controller/
│   ├── UserController
│   ├── AccountController
│   ├── TransactionController
│   ├── BillPaymentController
│   ├── BillerController
│   ├── LoanApplicationController
│   ├── LoanController
│   └── Admin* controllers
│
├── dto/
│
├── entity/
│   ├── Users
│   ├── Account
│   ├── Transaction
│   ├── Biller
│   ├── BillPayment
│   ├── LoanApplication
│   ├── Loan
│   ├── LoanRepayment
│   └── AuditLog
│
├── exception/
│   └── GlobalExceptionHandler
│
├── repository/
│
└── service/
    ├── UserService
    ├── AccountService
    ├── TransactionService
    ├── BillPaymentService
    ├── BillerService
    ├── LoanApplicationService
    ├── LoanService
    ├── AuditLogService
    └── JwtService

◈ Technology Stack

Layer

Technology

Language

Java 25

Backend

Spring Boot

Security

Spring Security + JWT

Persistence

Spring Data JPA / Hibernate

Database

PostgreSQL

Password hashing

BCrypt

Frontend

React + Vite

Client logic

JavaScript

Styling

CSS

Backend build

Maven

Frontend tooling

npm / Vite

Version control

Git / GitHub

◈ API Surface

Authentication

POST /users
POST /login

Customer

GET  /accounts
GET  /accounts/{accountNumber}

GET  /transactions
GET  /transactions/{reference}
POST /transactions/transfer

GET  /billers
GET  /bills/payments
POST /bills/payments

POST /loans/applications
GET  /loans/applications
GET  /loans/applications/{applicationReference}

GET  /loans
GET  /loans/{loanReference}
POST /loans/{loanReference}/repay
GET  /loans/{loanReference}/repayments

Admin

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

The controller layer in the repository remains the authoritative API contract.

◈ Domain Relationships

erDiagram
    USERS ||--o{ ACCOUNT : owns
    USERS ||--o{ TRANSACTION : initiates
    USERS ||--o{ LOAN_APPLICATION : submits
    ACCOUNT ||--o{ TRANSACTION : participates
    ACCOUNT ||--o{ BILL_PAYMENT : funds
    ACCOUNT ||--o{ LOAN : receives
    BILLER ||--o{ BILL_PAYMENT : receives
    LOAN_APPLICATION ||--o| LOAN : becomes
    LOAN ||--o{ LOAN_REPAYMENT : receives
    USERS ||--o{ AUDIT_LOG : associated

◈ Error Handling

BankEase centralizes API exception handling with:

@RestControllerAdvice

Representative domain exceptions include:

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

The frontend can therefore represent controlled error states instead of exposing raw server failures.

◈ Quick Start

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

2. Database

Create the PostgreSQL database:

CREATE DATABASE bankease;

Typical local configuration:

Host:     localhost
Port:     5432
Database: bankease
Username: postgres

3. Environment Variables

Configure locally through IntelliJ Run/Debug Configuration, a secure shell environment, or another secret-management mechanism:

DB_PASSWORD=your_postgres_password
JWT_SECRET=your_long_random_secret
ADMIN_EMAIL=admin@bankease.com
ADMIN_PASSWORD=your_admin_password

Never commit real credentials or secrets.

4. Start Backend

From the repository root:

Windows

.\mvnw.cmd spring-boot:run

Or run:

BankeaseApplication

from IntelliJ IDEA.

Backend:

http://localhost:8080

5. Start Frontend

Open another terminal:

cd bankease_frontend
npm install
npm run dev

Frontend:

http://localhost:5173

◈ Demo Path

Use this sequence for a connected project demonstration:

01  Register customer
 ↓
02  Login
 ↓
03  Open account
 ↓
04  Admin funds account
 ↓
05  Customer transfers funds
 ↓
06  Customer pays bill
 ↓
07  Customer applies for loan
 ↓
08  Admin opens Loan Desk
 ↓
09  Admin reviews application
 ↓
10  Admin approves / rejects
 ↓
11  Admin disburses approved loan
 ↓
12  Customer repays
 ↓
13  Admin opens Audit Center

◈ Validation Checklist

Backend

.\mvnw.cmd clean test

Frontend

cd bankease_frontend
npm run build

Manual flow

[ ] PostgreSQL connected
[ ] Backend starts successfully
[ ] Customer registration works
[ ] Login returns JWT
[ ] Customer account creation works
[ ] Admin funding works
[ ] Transfer validation works
[ ] Bill payment works
[ ] Loan application works
[ ] Admin review works
[ ] Loan disbursement works
[ ] Loan repayment works
[ ] Audit records appear

◈ Repository Layout

bankease/
│
├── src/
├── bankease_frontend/
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
└── README.md

◈ Project Status

<div align="center">

Area

Status

Customer registration

✅

Authentication

✅

JWT security

✅

Account management

✅

Fund transfers

✅

Transaction history

✅

Bill payments

✅

Biller administration

✅

Loan applications

✅

Loan review

✅

Loan disbursement

✅

Loan repayment

✅

Audit visibility

✅

React customer workspace

✅

React admin workspace

✅

Statement interface

✅

Responsive UI

✅

</div>

◈ Future Scope

Possible extensions beyond the current implementation:

📱 Mobile client using the existing REST layer

☁️ Cloud deployment and CI/CD

🔔 Notification services

🧪 Expanded automated integration/API testing

🔗 External payment and biller integrations

📈 Advanced operational reporting

◈ Screenshots

Store project screenshots under:

docs/screenshots/

Suggested layout:

docs/
└── screenshots/
    ├── login.png
    ├── signup.png
    ├── customer-overview.png
    ├── accounts.png
    ├── transfer.png
    ├── bills.png
    ├── loans.png
    ├── statement.png
    ├── admin-overview.png
    ├── users.png
    ├── admin-accounts.png
    ├── billers.png
    ├── loan-desk.png
    └── audit-center.png

Then render them directly in GitHub:

## Customer Overview

![BankEase Customer Overview](docs/screenshots/customer-overview.png)

## Admin Loan Desk

![BankEase Admin Loan Desk](docs/screenshots/loan-desk.png)

◈ Design Philosophy

A banking application should feel like a working financial desk, not a template dashboard.

CHARCOAL
Workspace

        IVORY
        Information

                COPPER
                Action

                        OLIVE
                        Healthy state

BankEase uses this visual hierarchy to keep financial state, operational actions and system status visually distinct.

👨‍💻 Author

<div align="center">

Aryan Mishra

B.Tech — Computer Science & Engineering (Data Science)

<a href="https://github.com/aryanmishra1182-byte">
  <img src="https://img.shields.io/badge/GitHub-aryanmishra1182--byte-161a16?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</a>

<br/><br/>

BankEase — NextGen Net Banking

Java • Spring Boot • PostgreSQL • React

</div>
