# Inventory Management System (IMS)

## Project Structure: Monorepo
This project uses a **Monorepo** (Monolithic Repository) architecture. This means all distinct parts of the application (Backend, Web, Mobile) live in a single folder but run independently.

### Structure
- **apps/**: Contains the running applications.
  - **api/**: The Backend Server (NestJS). Handles high-security database connections and API logic.
  - **web/**: The Admin Portal (Next.js). The website for Admins and Warehouse Managers.
  - **mobile/**: The Android User App (React Native). The app for Salespersons.
- **packages/**: Contains shared code.
  - Shared Security Validation (so Web and Mobile follow the exact same rules).
  - Shared TypeScript Types (so the Frontend never guesses what the Backend is sending).

## Why this approach?
1. **Consistency**: If we update a Product's definition, we update it in *one* place, and both the Website and Android App get the update immediately.
2. **Security**: We can write our security logic once and import it everywhere.
3. **Speed**: Easier to manage and deploy.
