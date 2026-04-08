import type { Permission } from "@/contracts/api-contracts";
import {
  Building2,
  FileText,
  Gift,
  History,
  Home,
  LayoutDashboard,
  Receipt,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import type { ComponentType } from "react";
import { NavLink } from "react-router";
import { ProtectedComponent } from "../ProtectedComponent";
import { Logo } from "../Logo";
import { useUiStore } from "@/store/ui.store";

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  permission?: Permission;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/agence", label: "Mon agence", icon: Building2 },
  {
    to: "/souscriptions",
    label: "Souscriptions",
    icon: FileText,
    permission: "ticket:read",
  },
  {
    to: "/documents",
    label: "Attestations",
    icon: Receipt,
    permission: "document:read",
  },
  { to: "/wallet", label: "Mon Wallet Boaz", icon: Wallet },
  { to: "/historiques", label: "Mes historiques", icon: History },
  { to: "/affiliation", label: "Programme d’affiliation", icon: Gift },
];

const GENERAL_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/settings", label: "Paramètres", icon: Settings },
];

function NavRow({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const row = (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-brand-blue-soft text-brand-blue font-medium"
            : "text-gray-600 hover:bg-gray-100",
        ].join(" ")
      }
    >
      <item.icon />
      <span>{item.label}</span>
    </NavLink>
  );

  return item.permission ? (
    <ProtectedComponent permission={item.permission}>{row}</ProtectedComponent>
  ) : (
    row
  );
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex h-full flex-col bg-white gap-2 px-4 py-6 rounded-2xl shadow-lg border">
      <div className="flex items-center justify-between px-2 pb-4">
        <Logo />
        <button
          onClick={onNavigate}
          className="rounded-lg p-1 text-gray-500 hover:bg-gray-100lg:hidden"
          aria-label="Fermer le menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav>
        {NAV_ITEMS.map((item) => (
          <NavRow key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Général
        </div>
        {GENERAL_ITEMS.map((item) => (
          <NavRow key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

export function Sidebar() {
  const isOpen = useUiStore((s) => s.isSidebarOpen);
  const close = useUiStore((s) => s.closeCidebar);

  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0  lg:block py-6 px-2 ">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 flex bg-black/40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-transform duration-200 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        <SidebarContent onNavigate={close} />
      </aside>
    </>
  );
}
