import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { CaretLeft, CaretRight } from 'phosphor-react'

import { getWeekDays } from '@/utils/get-week-days'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarDaySkeleton,
  CalendarHeader,
  CalendarTitle,
} from './style'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

interface CalendarProps {
  selectedDate: Date | null
  onSelectedDate: (date: Date) => void
}

export function Calendar({ selectedDate, onSelectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()
  const username = String(router.query.username ?? '')

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month')

    setCurrentDate(nextMonthDate)
  }

  const { data: blockedDates, isLoading } = useQuery<BlockedDates>(
    ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.get('month') + 1,
        },
      })

      return response.data
    },
    {
      enabled: !!username,
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  const shortWeekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM')
  const previousMonth = currentDate
    .subtract(1, 'month')
    .format('MMMM[ de ]YYYY')
  const nextMonth = currentDate.add(1, 'month').format('MMMM[ de ]YYYY')
  const currentYear = currentDate.format('YYYY')

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle as="strong">
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button
            onClick={handlePreviousMonth}
            aria-label={`Mês anterior (${previousMonth})`}
          >
            <CaretLeft />
          </button>
          <button
            onClick={handleNextMonth}
            aria-label={`Próximo mês (${nextMonth})`}
          >
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, week) => {
                return (
                  <tr key={week}>
                    {Array.from({ length: 7 }).map((_, day) => {
                      return (
                        <td key={day}>
                          <CalendarDaySkeleton />
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            : calendarWeeks.map(({ week, days }) => {
                return (
                  <tr key={week}>
                    {days.map(({ date, disabled }) => {
                      const describedDate = date.format(
                        'dddd[, ]DD[ de ]MMMM[ de ]YYYY',
                      )

                      return (
                        <td key={date.toString()}>
                          <CalendarDay
                            onClick={() => onSelectedDate(date.toDate())}
                            aria-label={describedDate}
                            disabled={disabled}
                          >
                            {date.get('date')}
                          </CalendarDay>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
