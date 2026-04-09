import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { type FormValues, schema } from "@/lib/schemas";
import { createTicket } from "../api";
import { zodResolver } from '@hookform/resolvers/zod';

export function CreateSouscriptionPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", priority: "MEDIUM" },
  });

  async function onSubmit(values: FormValues) {
    const ticket = await createTicket(values);
    console.log("Ticket créé :", ticket);
    navigate(`/souscriptions`, { replace: true });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-5"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Nouvelle demande
        </h2>
        <p className="text-sm text-gray-500">
          Renseignez les détails de votre demande de financement.
        </p>
      </div>
      <Field label="Titre" error={errors.title?.message}>
        <input
          type="text"
          {...register("title")}
          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-brand-blue focus:outline-brand-blue"
        />
      </Field>

      <Field label="Description" error={errors.description?.message}>
        <textarea
          {...register("description")}
          className="min-h-[140px] w-full resize-y rounded-xl border border-gray-200 p-3 text-sm focus:border-brand-blue focus:outline-brand-blue"
        />
      </Field>

      <Field label="Priorité" error={errors.priority?.message}>
        <select
          {...register("priority")}
          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-brand-blue focus:outline-brand-blue"
        >
          <option value="LOW">Basse</option>
          <option value="MEDIUM">Moyenne</option>
          <option value="HIGH">Haute</option>
        </select>
      </Field>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50"
        >
          {isSubmitting ? "Envoi…" : "Envoyer la demande"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
