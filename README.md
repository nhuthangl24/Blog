# Security Blog Project

A professional full-stack security blog built with Next.js 14, MongoDB, and TailwindCSS.

## Features

- **Tech Stack**: Next.js 14 (App Router), TypeScript, MongoDB, TailwindCSS, Shadcn UI.
- **Content**: MDX support with syntax highlighting (rehype-pretty-code).
- **Security**: NextAuth.js authentication, role-based access control (RBAC).
- **Admin Dashboard**: Manage posts, media, and comments.
- **Public Interface**: Browse CVEs, PoCs, and writeups with search and filtering.

## Prerequisites

- Node.js 18+
- MongoDB (Local or Atlas)

## Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Copy `.env.example` to `.env.local` and update the values:

    ```bash
    cp .env.example .env.local
    ```

    Update `MONGODB_URI` and `NEXTAUTH_SECRET`.

3.  **Seed Database**:
    Create the initial admin user and sample posts:

    ```bash
    npm run seed
    ```

    Default Admin Credentials:

    - Email: `admin@example.com`
    - Password: `adminpassword`

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Utility libraries (DB connection, Auth).
- `models/`: Mongoose data models.
- `scripts/`: Database seeding scripts.
- `public/`: Static assets.

## Docker Support

Build and run with Docker Compose:

```bash
docker-compose up --build
```

## License

MIT
