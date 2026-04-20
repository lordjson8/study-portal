import { Link } from "react-router";
import { FileText, Receipt, Bell } from "lucide-react";
import { ProtectedComponent } from "@/components/ProtectedComponent";
import { useAuth } from "@/hooks/useAuth";

interface TileProps {
  to: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  cta: string;
  imageUrl?: string;
}

function Tile({ to, title, description, icon: Icon, cta, imageUrl }: TileProps) {
    const containerStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${imageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  return (
    <Link
      to={to}
      className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white  shadow-sm transition hover:-translate-y-0.5 hover:border-brand-blue hover:shadow-md"
    >
      <div className={`p-8 lex flex-col flex-1 items-center gap-3 flex rounded-t-2xl w-full`} style={containerStyle}>
        {" "}
        <div className="flex h-10  w-10 items-center justify-center rounded-xl  text-brand-blue">
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div className="text-base font-semibold text-white">{title}</div>
        <div className="text-sm text-white">{description}</div>
      </div>

      <span className="inline-flex w-full items-center justify-center  rounded-b-2xl p-3 bg-brand-orange px-3 text-center text-xs font-medium text-white group-hover:brightness-110">
        {cta}
      </span>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Bonjour {user?.preferred_username} 👋
        </h2>
        <p className="text-sm text-gray-500">
          Voici les services disponibles pour votre profil.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProtectedComponent permission="ticket:read">
          <Tile
            to="/souscriptions"
            title="Souscriptions"
            description="Vos demandes de financement et leur statut."
            icon={FileText}
            cta="Voir mes demandes"
            imageUrl="/images/1.png"
          />
        </ProtectedComponent>

        <ProtectedComponent permission="document:read">
          <Tile
            to="/documents"
            title="Attestations"
            description="Téléchargez vos justificatifs et attestations."
            icon={Receipt}
            imageUrl="/images/3.png"
            cta="Voir les documents"
          />
        </ProtectedComponent>

        <ProtectedComponent permission="notification:read">
          <Tile
            to="/notifications"
            title="Notifications"
            description="Vos alertes et mises à jour récentes."
            icon={Bell}
            imageUrl="/images/2.png"
            cta="Ouvrir le centre"
          />
        </ProtectedComponent>
      </div>
    </div>
  );
}
