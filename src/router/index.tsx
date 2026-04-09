import { MainLayout } from "@/components/layout/MainLayout";
import { RequirePermission } from "@/components/RequirePermission";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/portals/auth-portal/pages/LoginPage";
import { Page404 } from "@/portals/error-portal/pages/Page404";
import DashBoardPage from "@/portals/main-portal/pages/DashBoardPage";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router";

// eslint-disable-next-line react-refresh/only-export-components
const SouscriptionsPage = lazy(() => {
  return import("@/portals/main-portal/features/souscriptions/pages/SouscriptionsListPage").then(
    (m) => ({ default: m.SouscriptionsListPage }),
  );
});

// eslint-disable-next-line react-refresh/only-export-components
const SouscriptionDetailPage = lazy(() => {
  return import("@/portals/main-portal/features/souscriptions/pages/SouscriptionDetailPage").then(
    (m) => ({ default: m.SouscriptionDetailPage }),
  );
});

// eslint-disable-next-line react-refresh/only-export-components
const CreateSouscriptionPage = lazy(() => {
  return import("@/portals/main-portal/features/souscriptions/pages/CreateSouscriptionPage").then(
    (m) => ({ default: m.CreateSouscriptionPage }),
  );
});

// eslint-disable-next-line react-refresh/only-export-components
const DocumentsListPage = lazy(() =>
  import("@/portals/main-portal/features/documents/pages/DocumentsListPage").then(
    (m) => ({
      default: m.DocumentsListPage,
    }),
  ),
);

// eslint-disable-next-line react-refresh/only-export-components
function RequireAuth() {
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// eslint-disable-next-line react-refresh/only-export-components
const NotificationsPage = lazy(() =>
  import("@/portals/main-portal/features/notifications/NotificationsPage").then(
    (m) => ({
      default: m.NotificationsPage,
    }),
  ),
);

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
          {
            element: <RequirePermission permission="ticket:read" />,
            children: [
              {
                path: "souscriptions",
                element: (
                  <Suspense
                    fallback={
                      <div className="flex flex-1 items-center justify-center text-gray-400">
                        Chargement…
                      </div>
                    }
                  >
                    <SouscriptionsPage />
                  </Suspense>
                ),
                handle: { title: "Souscriptions" },
              },
              {
                path: "souscriptions/:id",
                element: (
                  <Suspense
                    fallback={<div className="text-gray-400">Chargement…</div>}
                  >
                    <SouscriptionDetailPage />
                  </Suspense>
                ),
                handle: { title: "Détail de la demande" },
              },
            ],
          },
          {
            element: <RequirePermission permission="ticket:read" />,
            children: [
              {
                path: "souscriptions/nouvelle",
                element: (
                  <Suspense
                    fallback={<div className="text-gray-400">Chargement…</div>}
                  >
                    <CreateSouscriptionPage />
                  </Suspense>
                ),
                handle: { title: "Nouvelle demande" },
              },
            ],
          },
          {
            element: <RequirePermission permission="notification:read" />,
            children: [
              {
                path: "notifications",
                element: (
                  <Suspense
                    fallback={<div className="text-gray-400">Chargement…</div>}
                  >
                    <NotificationsPage />
                  </Suspense>
                ),
                handle: { title: "Notifications" },
              },
            ],
          },
          {
            element: <RequirePermission permission="document:read" />,
            children: [
              {
                path: "documents",
                element: (
                  <Suspense
                    fallback={<div className="text-gray-400">Chargement…</div>}
                  >
                    <DocumentsListPage />
                  </Suspense>
                ),
                handle: { title: "Attestations" },
              },
            ],
          },

          { path: "*", element: <Page404 /> },
        ],
      },
    ],
  },
]);
