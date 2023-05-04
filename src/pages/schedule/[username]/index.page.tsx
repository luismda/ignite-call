import 'react-loading-skeleton/dist/skeleton.css'

import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Avatar, Heading, Text, theme } from '@ig-ui/react'
import { NextSeo } from 'next-seo'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import { prisma } from '@/lib/prisma'
import { ScheduleForm } from './ScheduleForm'
import { Container, ProfileHeader } from './style'

interface ScheduleProps {
  user:
    | {
        name: string
        bio: string
        avatarUrl: string
      }
    | undefined
}

export default function Schedule({ user }: ScheduleProps) {
  const { isFallback } = useRouter()

  const skeletonBaseColor = String(theme.colors.gray800)
  const skeletonHighlightColor = String(theme.colors.gray700)

  return (
    <>
      <NextSeo
        title={`Agendar${isFallback ? '' : ` com ${user?.name}`} | Ignite Call`}
        description={`Agende um dia e horário${
          isFallback ? '' : ` com ${user?.name}`
        }.`}
      />

      <Container>
        <SkeletonTheme
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        >
          <ProfileHeader>
            {isFallback ? (
              <Skeleton width={64} height={64} circle />
            ) : (
              <Avatar src={user?.avatarUrl} alt="" />
            )}

            <Heading>
              {isFallback ? <Skeleton width={132} height={32} /> : user?.name}
            </Heading>
            <Text>
              {isFallback ? <Skeleton width={148} height={25} /> : user?.bio}
            </Text>
          </ProfileHeader>
        </SkeletonTheme>

        <ScheduleForm />
      </Container>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
