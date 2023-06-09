import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
  Toast,
} from '@ig-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NextSeo } from 'next-seo'
import { getServerSession } from 'next-auth'
import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { getWeekDays } from '@/utils/get-week-days'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { Container, Header } from '../style'
import {
  FormError,
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './style'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana.',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'O hoŕario de término deve ser pelo menos 1h distante do início.',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const setTimeIntervals = useMutation(
    async (data: TimeIntervalsFormOutput) => {
      const response = await api.post('/users/time-intervals', {
        intervals: data.intervals,
      })

      return response.data
    },
  )

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervals = watch('intervals')

  const weekDays = getWeekDays()

  const router = useRouter()

  async function handleSetTimeInervals(data: any) {
    const { intervals }: TimeIntervalsFormOutput = data

    try {
      await setTimeIntervals.mutateAsync({
        intervals,
      })

      await router.push('/register/update-profile')
    } catch (error) {}
  }

  return (
    <>
      <NextSeo title="Selecione sua disponibilidade | Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Defina sua disponibilidade</Heading>
          <Text>
            Defina o intervalo de horários que você está disponível em cada dia
            da semana.
          </Text>

          <MultiStep size={4} currentStep={3} />
        </Header>

        <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeInervals)}>
          <IntervalsContainer>
            {fields.map((field, index) => {
              return (
                <IntervalItem key={field.id}>
                  <IntervalDay>
                    <Controller
                      name={`intervals.${index}.enabled`}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Checkbox
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true)
                            }}
                            checked={field.value}
                          />
                        )
                      }}
                    />
                    <Text as="span">{weekDays[field.weekDay]}</Text>
                  </IntervalDay>

                  <IntervalInputs>
                    <TextInput
                      variant="sm"
                      type="time"
                      step={60}
                      disabled={intervals[index].enabled === false}
                      aria-label={`Horário inicial de disponibilidade (${
                        weekDays[field.weekDay]
                      })`}
                      {...register(`intervals.${index}.startTime`)}
                    />
                    <TextInput
                      variant="sm"
                      type="time"
                      step={60}
                      disabled={intervals[index].enabled === false}
                      aria-label={`Horário final de disponibilidade (${
                        weekDays[field.weekDay]
                      })`}
                      {...register(`intervals.${index}.endTime`)}
                    />
                  </IntervalInputs>
                </IntervalItem>
              )
            })}
          </IntervalsContainer>

          {errors.intervals && (
            <FormError size="sm">{errors.intervals.message}</FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </IntervalBox>
      </Container>

      {setTimeIntervals.isError && (
        <Toast
          title="Ops..."
          description={
            <Text>
              Ocorreu um erro ao salvar sua disponibilidade. Tente novamente.
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

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
