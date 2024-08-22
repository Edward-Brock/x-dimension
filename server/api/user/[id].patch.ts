import { z } from 'zod'
import prisma from '~/lib/prisma'

const updateUserSchema = z.object({
  nickname: z.string().max(80).optional(),
  email: z.string().email().optional(),
  mobile: z.string().length(11).optional(),
  avatarUrl: z.string().url().optional(),
  gender: z.enum(['Male', 'Female', 'Other', 'Unknown']).optional(),
  status: z.enum(['Active', 'Banned', 'Locked', 'Inactive']).optional(),
  remark: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id

  if (!userId) {
    return createError({ statusCode: 400, statusMessage: '缺少用户 ID' })
  }

  const body = await readBody(event)
  const parsedBody = updateUserSchema.safeParse(body)

  if (!parsedBody.success) {
    return createError({ statusCode: 400, statusMessage: '请求参数无效' })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: parsedBody.data,
    })

    return {
      status: 'success',
      data: updatedUser,
    }
  }
  catch (error) {
    console.error(error)
    return sendError(event, new Error('更新用户信息失败'))
  }
})
