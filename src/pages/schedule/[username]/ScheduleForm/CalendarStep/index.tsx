import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { api } from '@/lib/axios'
import { Calendar } from '@/components/Calendar'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './style'

interface Availability {
  possibleTimes: number[]
  unavailableTimes: Date[]
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

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  const { data: availability } = useQuery<Availability>(
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

  const unavailableTimes = availability?.unavailableTimes.map(
    (unavailableTime) => {
      const hours = dayjs(unavailableTime).get('hour')
      const minutes = dayjs(unavailableTime).get('minute')

      const unavailableTimeInMinutes = hours * 60 + minutes
      const unavailableTimeInHours = unavailableTimeInMinutes / 60

      return unavailableTimeInHours
    },
  )

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onSelectedDate={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay}, <span>{describedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability &&
              availability.possibleTimes.map((hour) => {
                const timeInMinutes = hour * 60
                const minutes = timeInMinutes % 60

                return (
                  <TimePickerItem
                    key={hour}
                    onClick={() => handleSelectTime(hour)}
                    disabled={
                      unavailableTimes?.includes(hour) ||
                      dayjs(selectedDate)
                        .set('hour', hour)
                        .set('minutes', minutes)
                        .isBefore(new Date())
                    }
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
  )
}
