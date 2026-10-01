# BankEase Backend Review — Based on the uploaded project

## Must fix before production

1. **Secrets:** `application.properties` references environment variables now, which is good. If any real values were ever committed to Git history, rotate the DB password, JWT secret, and admin password rather than only editing the latest file.
2. **Admin self-lockout / role management:** `/admin/users/{id}/status` can deactivate an admin account. Decide whether an admin may deactivate themselves or another admin.
3. **Admin loan queue:** there is no endpoint for admins to list pending loan applications. The frontend therefore uses application-reference-driven review.
4. **Financial ledger completeness:** transfers, bill payments, repayments and admin deposits are stored in separate records; `GET /transactions` is not a unified financial ledger.
5. **Loan interest model:** interest rate is stored, but current repayments reduce principal/outstanding directly; there is no EMI/amortization schedule.
6. **Bill consumer validation:** `consumerNumber` is stored with the payment but is not validated against an actual external/local biller account registry.

## Code-quality / cleanup

- Remove unused imports such as `Customizer`, `AcceptPendingException`, `Optional`, and the unused `LoanStatus` import in `LoanDecisionDTO`.
- `LoginResponseDTO.id` uses `@NotBlank` on an `int`; remove that annotation.
- `TestController` is currently unnecessary and is denied by the security catch-all, so remove it before a final production build.
- `LoanRequestDTO` appears unused; remove it.
- Consider making mutating BillerService methods transactional for consistency with other business writes.
- Consider locking loan/application rows for concurrent admin review/disbursement hardening.
- Consider an explicit user-level active check in authentication/authorization if immediate deactivation should invalidate already-issued JWTs.

## Security configuration

The current route split is sensible for the built API:

- `/users`, `/login` — public
- `/accounts/**`, `/transactions/**`, `/bills/**`, `/loans/**` — CUSTOMER
- `/admin/**` — ADMIN
- `/billers/**` — authenticated
- unknown routes — denied

This is represented directly in `SecurityConfig`.
