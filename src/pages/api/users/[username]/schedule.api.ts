import { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import dayjs from 'dayjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getGoogleOAuthToken } from '@/lib/google'

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

  const availabilityExisting = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: schedulingDate.get('day'),
    },
  })

  if (!availabilityExisting) {
    return res.status(400).json({
      message: 'The user is not available for scheduling with this day.',
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

  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  })

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  })

  await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call: ${name}`,
      description: observations,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        dateTime: schedulingDate.add(1, 'hour').format(),
      },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return res.status(201).end()
}
