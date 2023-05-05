import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const createUserBodySchema = z.object({
    name: z.string().trim().min(3),
    username: z
      .string()
      .min(3)
      .regex(/^[a-z]([a-z-]+)[a-z]$/i)
      .toLowerCase(),
  })

  const createUserValidation = createUserBodySchema.safeParse(req.body)

  if (createUserValidation.success === false) {
    return res.status(400).json({
      code: 'INVALID_DATA',
      message: 'Validation error.',
      issues: createUserValidation.error.format(),
    })
  }

  const { name, username } = createUserValidation.data

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).send({
      code: 'USERNAME_ALREADY_TAKEN',
      message: 'Username is already taken.',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return res.status(201).end()
}
