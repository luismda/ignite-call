import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { SkeletonTheme } from 'react-loading-skeleton'
import { theme } from '@ig-ui/react'

import { api } from '@/lib/axios'
import { Calendar } from '@/components/Calendar'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerItemSkeleton,
  TimePickerList,
} from './style'

interface Availability {
  possibleTimes: number[]
  blockedTimes: Array<{ date: string }>
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const username = String(router.query.username)

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  function handleSelectTime(hour: number, minutes: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .set('minutes', minutes)
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  const { data: availability, isLoading } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    {
      enabled: isDateSelected,
    },
  )

  const availableTimes = availability?.possibleTimes.filter((time) => {
    const timeInMinutes = time * 60
    const minutes = timeInMinutes % 60

    const isTimeBlocked = availability.blockedTimes.some((blockedTime) => {
      const blockedDateTime = dayjs(blockedTime.date)

      const blockedHour = blockedDateTime.get('hour')
      const blockedMinutes = blockedDateTime.get('minutes')

      const blockedTimeInMinutes = blockedHour * 60 + blockedMinutes

      return blockedTimeInMinutes === timeInMinutes
    })

    const isTimeInPast = dayjs(selectedDate)
      .set('hour', time)
      .set('minutes', minutes)
      .isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  const skeletonBaseColor = String(theme.colors.gray700)
  const skeletonHighlightColor = String(theme.colors.gray600)

  return (
    <SkeletonTheme
      baseColor={skeletonBaseColor}
      highlightColor={skeletonHighlightColor}
    >
      <Container isTimePickerOpen={isDateSelected}>
        <Calendar
          selectedDate={selectedDate}
          onSelectedDate={setSelectedDate}
        />

        {isDateSelected && (
          <TimePicker>
            <TimePickerHeader as="strong">
              {weekDay}, <span>{describedDate}</span>
            </TimePickerHeader>

            <TimePickerList>
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => {
                    return <TimePickerItemSkeleton key={i} />
                  })
                : availability?.possibleTimes.map((hour, index, hours) => {
                    const timeInMinutes = hour * 60
                    const minutes = timeInMinutes % 60

                    const isShouldBeHourDisabled =
                      !availableTimes?.includes(hour)

                    const isFirstHourEnabled = hours
                      .slice(0, index)
                      .every((hour) => !availableTimes?.includes(hour))
                    const isShouldBeAutoFocus =
                      !isShouldBeHourDisabled && isFirstHourEnabled

                    return (
                      <TimePickerItem
                        key={hour}
                        autoFocus={isShouldBeAutoFocus}
                        onClick={() => handleSelectTime(hour, minutes)}
                        disabled={isShouldBeHourDisabled}
                      >
                        {dayjs(selectedDate)
                          .set('hour', hour)
                          .set('minutes', minutes)
                          .format('HH:mm[h]')}
                      </TimePickerItem>
                    )
                  })}
            </TimePickerList>
          </TimePicker>
        )}
      </Container>
    </SkeletonTheme>
  )
}
