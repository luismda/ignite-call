import { Button, Text, TextArea, TextInput } from '@ig-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ConfirmForm, FormActions, FormError, FormHeader } from './style'

const confirmSchedulingFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'O nome deve ter no mínimo 3 letras.' }),
  email: z.string().email({ message: 'Informe um e-mail válido.' }),
  observations: z
    .string()
    .trim()
    .nullable()
    .transform((observations) => observations || null),
})

type ConfirmSchedulingFormData = z.infer<typeof confirmSchedulingFormSchema>

export function ConfirmStep() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmSchedulingFormData>({
    resolver: zodResolver(confirmSchedulingFormSchema),
  })

  async function handleConfirmScheduling(data: ConfirmSchedulingFormData) {}

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          28 de Abril de 2023
        </Text>
        <Text>
          <Clock />
          28 de Abril de 2023
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />

        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          type="email"
          placeholder="johndoe@example.com"
          {...register('email')}
        />

        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
