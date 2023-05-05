import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
  Toast,
} from '@ig-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'phosphor-react'
import { NextSeo } from 'next-seo'
import { useMutation } from '@tanstack/react-query'

import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { api } from '@/lib/axios'
import { Container, Header } from '../style'
import { FormAnnotation, ProfileBox } from './style'

const updateProfileFormSchema = z.object({
  bio: z.string().trim(),
})

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>

export default function UpdateProfile() {
  const updateProfile = useMutation(async (data: UpdateProfileFormData) => {
    const response = await api.put('/users/profile', {
      bio: data.bio,
    })

    return response.data
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
  })

  const session = useSession()

  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileFormData) {
    try {
      await updateProfile.mutateAsync({
        bio: data.bio,
      })

      await router.push(`/schedule/${session.data?.user.username}`)
    } catch (error) {}
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text>Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </label>

          <label>
            <Text>Sobre você</Text>
            <TextArea {...register('bio')} />
            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Finalizar
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>

      {updateProfile.isError && (
        <Toast
          title="Ops..."
          description={
            <Text>
              Ocorreu um erro ao atualizar seu perfil. Tente novamente.
            </Text>
          }
        />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}
