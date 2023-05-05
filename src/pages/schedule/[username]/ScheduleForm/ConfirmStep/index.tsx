import { useRouter } from 'next/router'
import { Button, Text, TextArea, TextInput, Toast } from '@ig-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dayjs from 'dayjs'
import { useMutation } from '@tanstack/react-query'

import { ConfirmForm, FormActions, FormError, FormHeader } from './style'
import { api } from '@/lib/axios'

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
  onCancelConfirmation: () => void
  onSuccessConfirmation: () => void
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
  onSuccessConfirmation,
}: ConfirmStepProps) {
  const router = useRouter()
  const username = String(router.query.username)

  const confirmScheduling = useMutation(
    async (data: ConfirmSchedulingFormData) => {
      const response = await api.post(`/users/${username}/schedule`, {
        name: data.name,
        email: data.email,
        observations: data.observations,
        date: schedulingDate,
      })

      return response.data
    },
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmSchedulingFormData>({
    resolver: zodResolver(confirmSchedulingFormSchema),
  })

  async function handleConfirmScheduling(data: ConfirmSchedulingFormData) {
    const { name, email, observations } = data

    try {
      await confirmScheduling.mutateAsync({
        name,
        email,
        observations,
      })

      onSuccessConfirmation()
    } catch (error) {}
  }

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

  return (
    <>
      <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
        <FormHeader>
          <Text as="strong">
            <CalendarBlank />
            {describedDate}
          </Text>
          <Text as="strong">
            <Clock />
            {describedTime}
          </Text>
        </FormHeader>

        <label>
          <Text as="span" size="sm">
            Nome completo
          </Text>
          <TextInput placeholder="Seu nome" {...register('name')} />

          {errors.name && (
            <FormError as="span" size="sm">
              {errors.name.message}
            </FormError>
          )}
        </label>

        <label>
          <Text as="span" size="sm">
            Endereço de e-mail
          </Text>
          <TextInput
            type="email"
            placeholder="johndoe@example.com"
            {...register('email')}
          />

          {errors.email && (
            <FormError as="span" size="sm">
              {errors.email.message}
            </FormError>
          )}
        </label>

        <label>
          <Text as="span" size="sm">
            Observações
          </Text>
          <TextArea {...register('observations')} />
        </label>

        <FormActions>
          <Button
            type="button"
            variant="tertiary"
            onClick={onCancelConfirmation}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Confirmar
          </Button>
        </FormActions>
      </ConfirmForm>

      {confirmScheduling.isError && (
        <Toast
          title="Ops..."
          description={
            <Text>
              Ocorreu um erro ao confirmar agendamento. Tente novamente.
            </Text>
          }
        />
      )}
    </>
  )
}
