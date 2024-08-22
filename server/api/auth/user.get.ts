import type { H3Event } from 'h3'
import { createError, eventHandler, getRequestHeader } from 'h3'
import jwt from 'jsonwebtoken'
import prisma from '~/lib/prisma'

interface User {
  username: string
  nickname: string
  avatar_url: string
  roles: object
}

interface JwtPayload extends User {
  iss: string
  sub: string
  iat: number
  exp: number
}

const SECRET = useRuntimeConfig().authSecret
const TOKEN_TYPE = 'Bearer'

const extractToken = (authHeaderValue: string) => {
  const parts = authHeaderValue.split(`${TOKEN_TYPE} `)
  if (parts.length !== 2) {
    throw createError({ statusCode: 403, statusMessage: '无效的授权头' })
  }
  return parts[1]
}

const ensureAuth = (event: H3Event) => {
  const authHeaderValue = getRequestHeader(event, 'authorization')
  if (typeof authHeaderValue === 'undefined') {
    throw createError({ statusCode: 403, statusMessage: '需要传递有效的 Bearer-authorization 标头才能访问此端点' })
  }

  const extractedToken = extractToken(authHeaderValue)
  try {
    return jwt.verify(extractedToken, SECRET)
  }
  catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw createError({ statusCode: 401, statusMessage: '访问令牌已过期，请刷新令牌' })
    }
    else {
      console.error('登录失败，错误信息：', error)
      throw createError({ statusCode: 403, statusMessage: '必须登录才能使用此端点' })
    }
  }
}

// 获取当前用户所有信息包含角色完整信息
const getUserInfo = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          Role: true,
        },
      },
    },
  })

  // 排除 password 字段
  return exclude(user, ['password'])
}

/**
 * 排除 User 表中特定字段
 * @param user User 表
 * @param keys 排除字段名称
 */
function exclude<User, Key extends keyof User>(
  user: any,
  keys: any[],
): Omit<User, Key> {
  const entries = Object.entries(user).filter(([key]) => !keys.includes(key as Key))
  return Object.fromEntries(entries) as Omit<User, Key>
}

export default eventHandler(async (event) => {
  // 获取需要查询的类型，默认为 'token'
  const queryType = getQuery(event).type || 'token'
  // 解密用户 token
  const authInfo = ensureAuth(event) as JwtPayload

  switch (queryType) {
  // 返回用户 token 解密信息
    case 'token':
      return authInfo
    // 返回用户完整个人信息
    case 'info':
      return await getUserInfo(authInfo.sub)
    default:
      throw createError({ statusCode: 400, statusMessage: '无效的查询类型' })
  }
})
