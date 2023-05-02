import { Button, Text, TextArea, TextInput } from '@ig-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dayjs from 'dayjs'

import { ConfirmForm, FormActions, FormError, FormHeader } from './style'
import { AxiosError } from 'axios'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'

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

interface ConfirmStepProps {
  schedulingDate: Date
  onFinishedConfirmation: () => void
}

export function ConfirmStep({
  schedulingDate,
  onFinishedConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmSchedulingFormData>({
    resolver: zodResolver(confirmSchedulingFormSchema),
  })

  const router = useRouter()
  const username = String(router.query.username)

  async function handleConfirmScheduling(data: ConfirmSchedulingFormData) {
    const { name, email, observations } = data

    try {
      await api.post(`/users/${username}/schedule`, {
        name,
        email,
        observations,
        date: schedulingDate,
      })

      onFinishedConfirmation()
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.message) {
        return alert(error.response.data.message)
      }

      console.error(error)
    }
  }

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
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
        <Button
          type="button"
          variant="tertiary"
          onClick={onFinishedConfirmation}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
