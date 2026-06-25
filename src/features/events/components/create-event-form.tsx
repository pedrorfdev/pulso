import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import {
  createEventSchema,
  type CreateEventFormValues,
} from "../schemas/create-event-schema"
import { useCreateEvent } from "../hooks/use-create-event"

/**
 * Form de criação de evento. Cria em modo rascunho — o líder ainda
 * precisa adicionar membros e publicar numa tela seguinte (fluxo em
 * 2 passos, batendo com a Jornada 4: cria -> adiciona -> publica).
 */
export function CreateEventForm() {
  const navigate = useNavigate()
  const { mutate, isPending, error } = useCreateEvent()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
  })

  function onSubmit(values: CreateEventFormValues) {
    mutate(values, {
      onSuccess: (event) => {
        navigate({
          to: "/events/$eventId/manage",
          params: { eventId: event.id },
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold text-foreground">Novo evento</h1>

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

      <div>
        <input
          {...register("location")}
          placeholder="Local (opcional)"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
        />
      </div>

      <div>
        <input
          {...register("startsAt")}
          type="datetime-local"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
        />
        {errors.startsAt && (
          <p className="mt-1 text-sm text-pulse">{errors.startsAt.message}</p>
        )}
      </div>

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
        className="rounded-xl bg-gradient-pulse px-6 py-3 font-medium text-pulse-foreground transition disabled:opacity-50"
      >
        {isPending ? "Criando..." : "Criar evento"}
      </button>
    </form>
  )
}
