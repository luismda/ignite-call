import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const timeIntervalsBodySchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        startTimeInMinutes: z.number(),
        endTimeInMinutes: z.number(),
      }),
    )
    .min(1)
    .max(7)
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'The end time should be at least 1 hour of distance to start time.',
      },
    ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }

  const timeIntervalsBodyValidation = timeIntervalsBodySchema.safeParse(
    req.body,
  )

  if (timeIntervalsBodyValidation.success === false) {
    return res.status(400).json({
      code: 'INVALID_DATA',
      message: 'Validation error.',
      issues: timeIntervalsBodyValidation.error.format(),
    })
  }

  const { intervals } = timeIntervalsBodyValidation.data

  await prisma.userTimeInterval.createMany({
    data: intervals.map((interval) => {
      return {
        user_id: session.user.id,
        week_day: interval.weekDay,
        time_start_in_minutes: interval.startTimeInMinutes,
        time_end_in_minutes: interval.endTimeInMinutes,
      }
    }),
  })

  res.status(201).end()
}
