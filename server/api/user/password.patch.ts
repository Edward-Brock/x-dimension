import bcrypt from 'bcrypt'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const { userId, currentPassword, newPassword } = await readBody(event)

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: '缺少用户 ID' })
  }

  // 获取当前用户的数据库记录
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!currentUser) {
    return createError({ statusCode: 403, statusMessage: '用户不存在' })
  }

  if (!currentPassword || !newPassword) {
    throw createError({ statusCode: 400, statusMessage: '缺少密码信息' })
  }

  // 验证原密码
  const passwordMatch = await bcrypt.compare(currentPassword, currentUser.password)
  if (!passwordMatch) {
    return createError({ statusCode: 403, statusMessage: '原密码错误' })
  }

  // 更新为新密码
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      password: hashedPassword,
    },
  })

  return {
    statusCode: 200,
    message: '密码成功更新',
  }
})
