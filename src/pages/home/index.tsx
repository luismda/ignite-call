import Image from 'next/image'
import { Heading, Text } from '@ig-ui/react'
import { NextSeo } from 'next-seo'

import previewImage from '@/assets/app-preview.png'
import backgroundGridImage from '@/assets/background-grid.png'

import { ClaimUsernameForm } from './components/ClaimUsernameForm'
import { BackgroundGrid, Container, Hero, Preview } from './style'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />

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
            alt="Calendário com o mês de Setembro de 2022 e o dia 20 selecionado (terça-feira), com alguns horários listados ao lado direito, das 09:00h até as 16:00h representando os horários disponíveis para agendamento nesse dia."
          />
        </Preview>
      </Container>
    </>
  )
}
