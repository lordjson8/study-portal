import { useAuth } from "@/hooks/useAuth";
import { useUiStore } from "@/store/ui.store";
import { Bell, Building2, ChevronDown, Menu } from "lucide-react";
import { ProtectedComponent } from "../ProtectedComponent";
import { Link } from "react-router";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth();
  const openSidebar = useUiStore((s) => s.openSidebar);

  return (
    <header className="flex items-center justify-between gap-3 bg-white border-gray-200 rounded-2xl  px-4 py-3 shadow-sm border sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-3 ">
        <button
          onClick={openSidebar}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-brand-blue sm:text-xl">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2 sm:gp-4">
        <button className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 md:flex">
          <Building2 className="h-4 w-4" />
          Mon agence
        </button>

        <ProtectedComponent permission="notification:read">
          <Link
            to={"/notifications"}
            className="relative rounded-full p-2 hover:bg-gray-100"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-orange" />
          </Link>
        </ProtectedComponent>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-6 w-9 items-center justify-center rounded-full bg-brand-blue-soft text-sm font-semibold text-brand-blue">
            {user?.preferred_username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-900">
              {user?.preferred_username ?? "—"}
            </div>
            <div className="text-xs text-gray-500">{user?.email ?? ""}</div>
          </div>
          <ProfileDropdownMenu>
            <button
              className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </ProfileDropdownMenu>
        </div>
      </div>
    </header>
  );
}

function ProfileDropdownMenu({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
