import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const createSchedulingBodySchema = z.object({
    name: z.string().trim().min(3),
    email: z.string().email(),
    observations: z.string().trim().nullable(),
    date: z.string().datetime(),
  })

  const schedulingBodyValidation = createSchedulingBodySchema.safeParse(
    req.body,
  )

  if (schedulingBodyValidation.success === false) {
    return res.status(400).json({
      message: 'Validation error.',
      issues: schedulingBodyValidation.error.format(),
    })
  }

  const { name, email, observations, date } = schedulingBodyValidation.data

  const schedulingDate = dayjs(date).startOf('hour')

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({
      message: 'Date is in the past.',
    })
  }

  const schedulingTimeInMinutes = schedulingDate.get('hours') * 60

  const availabilityExisting = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: schedulingDate.get('day'),
      time_start_in_minutes: {
        lte: schedulingTimeInMinutes,
      },
      time_end_in_minutes: {
        gte: schedulingTimeInMinutes,
      },
    },
  })

  if (!availabilityExisting) {
    return res.status(400).json({
      message:
        'The user is not available for scheduling with this day and time.',
    })
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    return res.status(400).json({
      message: 'There is another scheduling at the same time.',
    })
  }

  await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  })

  return res.status(201).end()
}
