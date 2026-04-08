import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/portals/auth-portal/pages/LoginPage";
import { Page404 } from "@/portals/error-portal/pages/Page404";
import DashBoardPage from "@/portals/main-portal/pages/DashBoardPage";
import { createBrowserRouter, Navigate, Outlet } from "react-router";

function RequireAuth() {
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    handle: { title: "Tableau de bords" },
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashBoardPage />,
            handle: { title: "Tableau de bord" },
          },
          { path: "*", element: <Page404 /> },
        ],
      },
    ],
  },
  { path: "*", element: <Page404 /> },
]);
