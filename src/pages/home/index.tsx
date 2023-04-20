import Image from 'next/image'
import { Heading, Text } from '@ig-ui/react'
import { BackgroundGrid, Container, Hero, Preview } from './style'

import previewImage from '@/assets/app-preview.png'
import backgroundGridImage from '@/assets/background-grid.png'

import { ClaimUsernameForm } from './components/ClaimUsernameForm'

export default function Home() {
  return (
    <Container>
      <BackgroundGrid>
        <Image
          src={backgroundGridImage}
          width={1208}
          height={680}
          priority
          alt=""
        />
      </BackgroundGrid>

      <Hero>
        <Heading as="h1" size="4xl">
          Agendamento descomplicado
        </Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image
          src={previewImage}
          height={400}
          quality={100}
          priority
          alt="Calendário com o mês de Setembro de 2022 e alguns horários disponíveis para agendamento no dia 20 desse mês, simbolizando a aplicação em funcionamento."
        />
      </Preview>
    </Container>
  )
}
