import { Outlet, useMatches } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { DevProfileSwitcher } from "../DevProfileSwitcher";

interface RouteHandle {
  title?: string;
}

export function MainLayout() {
  const matches = useMatches();
  const title =
    [...matches]
      .reverse()
      .map((m) => (m.handle as RouteHandle | undefined)?.title)
      .find((t): t is string => typeof t === "string") ?? "StudyPortal";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-6">
        <Header title={title} />
        <main className="flex-1 rounded-2xl  bg-white p-4 border-gray-200 border shadow-lg sm:p-6">
          <Outlet />
        </main>
      </div>
      <DevProfileSwitcher />
    </div>
  );
}
