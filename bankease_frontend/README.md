# BankEase Frontend

A polished React/Vite frontend for the BankEase Spring Boot API.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

The Vite dev server proxies BankEase API paths to `http://localhost:8080`, so the frontend can work with the backend without adding CORS just for local development.

## Backend assumptions

The UI is wired to the current BankEase endpoints:

- `POST /login`
- `POST /users`
- `GET/POST /accounts...`
- `POST/GET /transactions...`
- `GET /billers...`
- `POST/GET /bills/payments...`
- `GET/POST /loans...`
- `/admin/users...`
- `/admin/billers...`
- `/admin/loans/...`
- `/admin/audit-logs...`

No fake production data is required for core screens. When an endpoint is unavailable, the UI falls back to empty states.

## Notes

The admin loan desk is reference-driven because the current backend does not expose an endpoint for listing pending loan applications.

The backend currently exposes development funding via `/admin/accounts/{accountNumber}/deposit`; the frontend does not expose this as a customer operation.
