import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import { RouterProvider } from "react-router";
import { router } from "./router";

function App() {
  const isReady = useAuthStore((s) => s.isReady);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Chargement…
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />;
    </>
  );
}

export default App;
