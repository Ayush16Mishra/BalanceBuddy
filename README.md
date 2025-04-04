# BalanceBuddy

BalanceBuddy is a full-stack expense-sharing application similar to Splitwise. It allows users to track shared expenses, manage debts, and settle balances efficiently. The app has a React frontend, an Express.js backend, and a PostgreSQL database.

## Features
- User authentication (Passport.js with bcrypt for security)
- Role-based access control (Admin & Members)
- Group-based expense tracking
- Expense and debt management
- Real-time notifications for group activity
- Charts and analytics for spending insights

## Tech Stack
### Frontend:
- React.js (with MUI for UI components)
- Recharts for data visualization
- Framer Motion for animations

### Backend:
- Express.js with Node.js
- PostgreSQL
- Passport.js for authentication
- Multer for file uploads (profile pictures)

## Installation & Setup
### Prerequisites:
- Node.js (v16+ recommended)
- PostgreSQL (Ensure you have a running instance)

### Steps:
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/BalanceBuddy.git
   cd BalanceBuddy
   ```

2. Set up the backend:
   ```sh
   cd backend
   npm install
   ```
   - Create a `.env` file in the backend folder and configure the following:
     ```env
     DATABASE_URL=your_postgres_url
     SESSION_SECRET=your_secret_key
     ```
   - Start the backend server:
     ```sh
     npm start
     ```

3. Set up the frontend:
   ```sh
   cd ../frontend
   npm install
   npm start
   ```

## Deployment
For deployment, you can use:
- **Backend:** Railway/ Supabase (for DB)
- **Frontend:** Vercel

Make sure to store environment variables securely and not push them to the repo.

## Default Credentials
- **Username:** `Admin`
- **Password:** `kim`


