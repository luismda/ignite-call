import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Button, Heading, MultiStep, Text } from '@ig-ui/react'
import { ArrowRight, Check } from 'phosphor-react'
import { NextSeo } from 'next-seo'

import { Container, Header } from '../style'
import { AuthError, ConnectBox, ConnectItem } from './style'

type AuthErrorType = 'permissions' | 'account' | undefined

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const isSignedIn = session.status === 'authenticated'
  const hasAuthError = !!router.query.error && !isSignedIn
  const authErrorType = (
    hasAuthError ? String(router.query.error) : undefined
  ) as AuthErrorType

  async function handleConnectCalendar() {
    await signIn('google')
  }

  async function handleNavigateToNextStep() {
    await router.push('/register/time-intervals')
  }

  return (
    <>
      <NextSeo title="Conecte sua agenda do Google | Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>

          <MultiStep size={4} currentStep={2} />
        </Header>

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>

            {isSignedIn ? (
              <Button size="sm" variant="secondary" disabled>
                Conectado
                <Check />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleConnectCalendar}
              >
                Conectar
                <ArrowRight />
              </Button>
            )}
          </ConnectItem>

          {hasAuthError && (
            <AuthError size="sm">
              {authErrorType === 'permissions' &&
                'Falha ao se conectar com o Google. Verifique se você habilitou as permissões de acesso ao Google Calendar.'}

              {authErrorType === 'account' &&
                'Falha ao se conectar com o Google. Tente utilizar outra conta.'}
            </AuthError>
          )}

          <Button onClick={handleNavigateToNextStep} disabled={!isSignedIn}>
            Próximo passo
            <ArrowRight />
          </Button>
        </ConnectBox>
      </Container>
    </>
  )
}
