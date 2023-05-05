import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  Button,
  Heading,
  MultiStep,
  Text,
  TextInput,
  Toast,
} from '@ig-ui/react'
import { AxiosError } from 'axios'
import { ArrowRight } from 'phosphor-react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NextSeo } from 'next-seo'

import { Container, Form, FormError, Header } from './style'
import { api } from '@/lib/axios'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^[a-z]([a-z-]+)[a-z]$/i, {
      message: 'O usuário deve ter apenas letras e hifens para separação.',
    })
    .toLowerCase(),
  name: z
    .string()
    .trim()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

type CodeError = 'INVALID_DATA' | 'USERNAME_ALREADY_TAKEN'
type RegisterError = AxiosError<{ code: CodeError; message: string }>

const registerErrorMessages = {
  INVALID_DATA: 'Informe os dados no formato correto.',
  USERNAME_ALREADY_TAKEN:
    'O nome de usuário não está disponível, tente escolher outro.',
}

export default function Register() {
  const registerUser = useMutation<any, RegisterError, RegisterFormData>(
    async (data) => {
      const response = await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      return response.data
    },
  )

  const error = registerUser.error?.response?.data
  const errorMessage = error?.code ? registerErrorMessages[error.code] : null

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await registerUser.mutateAsync({
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {}
  }

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text as="span" size="sm">
              Nome de usuário
            </Text>
            <TextInput
              prefix="call.com/"
              placeholder="seu-usuario"
              {...register('username')}
            />

            {errors.username && (
              <FormError as="span" size="sm">
                {errors.username.message}
              </FormError>
            )}
          </label>

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

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>

      {registerUser.isError && (
        <Toast
          title="Ops..."
          description={
            <Text>
              {errorMessage ??
                'Ocorreu um erro ao realizar o cadastro. Tente novamente.'}
            </Text>
          }
        />
      )}
    </>
  )
}
