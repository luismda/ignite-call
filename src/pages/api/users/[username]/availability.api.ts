import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const availabilityQuerySchema = z.object({
    username: z.string(),
    date: z.string().regex(/^(\d{4}-\d{2}-\d{2})$/),
  })

  const availabilityQueryValidation = availabilityQuerySchema.safeParse(
    req.query,
  )

  if (availabilityQueryValidation.success === false) {
    return res.status(400).json({
      code: 'INVALID_DATA',
      message: 'Validation error.',
      issues: availabilityQueryValidation.error.format(),
    })
  }

  const { username, date } = availabilityQueryValidation.data

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({
      code: 'USER_DOES_NOT_EXIST',
      message: 'User does not exist.',
    })
  }

  const referenceDate = dayjs(date)
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.startOf('day').toDate(),
        lte: referenceDate.endOf('day').toDate(),
      },
    },
  })

  return res.json({ possibleTimes, blockedTimes })
}
