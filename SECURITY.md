# Security & Compliance Constitution

## 1. Authentication Standard
- **Protocol**: OAuth2 / OIDC compliant flows.
- **Tokens**: Short-lived JWT (Access Token: 15min) + Secure HttpOnly Refresh Token (7 days).
- **hashing**: `Argon2id` (Memory cost: 65536, Iterations: 3, Parallelism: 4).
- **MFA**: TOTP required for `SUPER_ADMIN` and `FINANCE` roles.

## 2. Role-Based Access Control (RBAC) Matrix
*Derived from System Settings > Permissions Matrix*

| Role | Inventory | Sales | Finance | Users | Settings |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Super Admin** | FULL | FULL | FULL | FULL | FULL |
| **Brand Admin** | READ/WRITE | READ/WRITE | READ | READ/WRITE | READ |
| **Warehouse** | WRITE (Stock Only) | READ | NO_ACCESS | NO_ACCESS | NO_ACCESS |
| **Finance** | READ | READ | FULL | READ | NO_ACCESS |
| **Salesperson** | READ (Stock) | WRITE (Orders) | NO_ACCESS | NO_ACCESS | NO_ACCESS |

## 3. Data Protection
- **Input Validation**: strict "White-list" validation using Zod/DTOs. API rejects unknown fields.
- **SQL Injection**: Prevented via Prisma ORM parameterized queries.
- **XSS**: React automatic escaping + Content Security Policy (CSP) headers.
- **CSRF**: SameSite=Strict cookies for web sessions.

## 4. Audit Logging
Every write action (CREATE, UPDATE, DELETE) is logged to the `audit_logs` table with:
- `user_id`
- `ip_address`
- `action` (e.g., "PRICE_UPDATE")
- `resource_id`
- `timestamp`

## 5. Mobile Security (Online-Only Policy)
- **Zero Persistence**: No sensitive customer data is stored in SQLite/AsyncStorage.
- **RAM Only**: Data exists only in Redux/State memory.
- **SSL Pinning**: (Future Roadmap) to prevent Man-in-the-Middle attacks.
