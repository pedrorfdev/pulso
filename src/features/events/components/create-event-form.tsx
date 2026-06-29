import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useCreateEvent } from "../hooks/use-create-event";
import type { CreateEventFormValues } from "../schemas/create-event-schema";

// Schema estendido pra suportar data e hora separados
const formSchema = z.object({
  title: z.string().min(3, "O título precisa ter pelo menos 3 letras").max(100),
  description: z.string().max(500).optional(),
  location: z.string().max(150).optional(),
  date: z.string().min(1, "Escolha uma data"),
  time: z.string().min(1, "Escolha um horário"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateEventForm() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateEvent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { time: "18:00" },
  });

  function onSubmit(values: FormValues) {
    // Reconstrói o datetime-local a partir dos dois campos
    const startsAt = `${values.date}T${values.time}:00-03:00`;

    const payload: CreateEventFormValues = {
      title: values.title,
      description: values.description,
      location: values.location,
      startsAt,
    };

    console.log(payload);

    mutate(payload, {
      onSuccess: (event) => {
        navigate({
          to: "/events/$eventId/manage",
          params: { eventId: event.id },
        });
      },
    });
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-surface transition"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 4L6 8l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-foreground">Novo evento</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Título */}
        <div>
          <input
            {...register("title")}
            placeholder="Título (ex: Culto de domingo)"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-pulse">{errors.title.message}</p>
          )}
        </div>

        {/* Data e Hora separados */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Data
            </label>
            <input
              {...register("date")}
              type="date"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-pulse">{errors.date.message}</p>
            )}
          </div>
          <div className="w-32">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Horário
            </label>
            <input
              {...register("time")}
              type="time"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
            />
            {errors.time && (
              <p className="mt-1 text-sm text-pulse">{errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Local */}
        <div>
          <input
            {...register("location")}
            placeholder="Local (opcional)"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
          />
        </div>

        {/* Descrição */}
        <div>
          <textarea
            {...register("description")}
            placeholder="Descrição (opcional)"
            rows={3}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
          />
        </div>

        {error && (
          <p className="text-sm text-pulse">
            Não deu pra criar o evento. Tenta de novo em instantes.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-gradient-pulse px-6 py-3.5 font-medium text-pulse-foreground transition disabled:opacity-50"
        >
          {isPending ? "Criando..." : "Criar evento"}
        </button>
      </form>
    </div>
  );
}
