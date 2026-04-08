import { NavLink } from "react-router";

export function Page404() {
  return (
    <div className="flex items-center justify-center flex-col">
      <img src="/404.png" alt="404 image" />
      <div className="mt-12 flex flex-col items-center gap-6">
        <h1>OUPS | PAGE INDISPONIBLE</h1>
        <NavLink to={'/'} className="bg-yellow-400 text-white rounded-2xl px-6 py-2 hover:bg-yellow-500 transition-colors">
          Acceuil
        </NavLink>
      </div>
    </div>
  );
}
