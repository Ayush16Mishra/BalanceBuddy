/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  }))
);

const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  }))
);

const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((module) => ({
    default: module.ForgotPasswordPage,
  }))
);

const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/ResetPasswordPage").then((module) => ({
    default: module.ResetPasswordPage,
  }))
);

const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  }))
);

const GroupsPage = lazy(() =>
  import("@/features/groups/pages/GroupsPage").then((module) => ({
    default: module.GroupsPage,
  }))
);

const GroupDetailsPage = lazy(() =>
  import("@/features/group-details/pages/GroupDetailsPage").then((module) => ({
    default: module.GroupDetailsPage,
  }))
);

const BalancesPage = lazy(() =>
  import("@/features/balances/pages/BalancesPage").then((module) => ({
    default: module.BalancesPage,
  }))
);

const ExpenseDetailsPage = lazy(() =>
  import("@/features/expenses/pages/ExpenseDetailsPage").then((module) => ({
    default: module.ExpenseDetailsPage,
  }))
);

const ProfilePage = lazy(() =>
  import("@/features/profile/pages/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  }))
);

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: (
              <LazyPage>
                <LoginPage />
              </LazyPage>
            ),
          },
          {
            path: "/register",
            element: (
              <LazyPage>
                <RegisterPage />
              </LazyPage>
            ),
          },
          {
            path: "/forgot-password",
            element: (
              <LazyPage>
                <ForgotPasswordPage />
              </LazyPage>
            ),
          },
          {
            path: "/reset-password",
            element: (
              <LazyPage>
                <ResetPasswordPage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: (
              <LazyPage>
                <DashboardPage />
              </LazyPage>
            ),
          },
          {
            path: "/groups",
            element: (
              <LazyPage>
                <GroupsPage />
              </LazyPage>
            ),
          },
          {
            path: "/groups/:groupId",
            element: (
              <LazyPage>
                <GroupDetailsPage />
              </LazyPage>
            ),
          },
          {
            path: "/groups/:groupId/balances",
            element: (
              <LazyPage>
                <BalancesPage />
              </LazyPage>
            ),
          },
          {
            path: "/expenses/:expenseId",
            element: (
              <LazyPage>
                <ExpenseDetailsPage />
              </LazyPage>
            ),
          },
          {
            path: "/profile",
            element: (
              <LazyPage>
                <ProfilePage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
]);
