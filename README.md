# CogniCheck

CogniCheck is a modern web application for managing users, their details, and call configurations. Built with Next.js, React, and lowdb, it provides a clean, intuitive interface for practitioners and admins to add, edit, and manage user information efficiently.

## Features

- **User Management:**
  - Add, edit, and delete users with detailed information (name, sex, date of birth, phone, etc.)
  - Sidebar with searchable, scrollable user list
  - Click to view or edit user details in a responsive right panel
  - Inline editing with safe save/cancel flow
  - Prevents accidental data loss during edits

- **Call Configuration (Planned):**
  - Set call days, times, and frequency for each user
  - Track call history and notes

- **Modern UI/UX:**
  - Responsive, accessible, and visually appealing design
  - Built with Tailwind CSS and React best practices

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000) (or another port if 3000 is in use).

3. **Database:**
   - User data is stored in a local `users.json` file using [lowdb](https://github.com/typicode/lowdb).
   - No external database setup required for development.

## Project Structure

- `src/app/page.tsx` — Main app UI and logic
- `src/app/api/users/` — API routes for user CRUD operations
- `users.json` — Local database file

## Development

- All development is tracked in the [`waliayuvraj/cognicheck`](https://github.com/waliayuvraj/cognicheck) repository.
- Please use the `main` branch for all ongoing work.
- PRs and issues are welcome!

## License

MIT License. See [LICENSE](LICENSE) for details.

---

*CogniCheck — Designed for practitioners. Built for people.*
