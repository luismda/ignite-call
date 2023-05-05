import { useRouter } from 'next/router'
import { Button, Text, TextInput } from '@ig-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Form, FormAnnotation } from './style'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^[a-z]([a-z-]+)[a-z]$/i, {
      message: 'O usuário deve ter apenas letras e hifens para separação.',
    })
    .toLowerCase(),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          aria-label="Digite um nome de usuário"
          variant="sm"
          prefix="call.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text as="span" size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome de usuário desejado.'}
        </Text>
      </FormAnnotation>
    </>
  )
}
