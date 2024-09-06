// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET, // 项目 Secret
    cookieDomain: process.env.COOKIE_DOMAIN, // JWT 签发者
    cosSecretId: process.env.NUXT_COS_SECRET_ID, // Secret ID
    cosSecretKey: process.env.NUXT_COS_SECRET_KEY, // secret Key
    public: {
      projectName: process.env.NUXT_PROJECT_NAME, // 项目简称
      projectFullName: process.env.NUXT_PROJECT_FULL_NAME, // 项目全程
      projectDescription: process.env.NUXT_PROJECT_DESCRIPTION, // 项目描述
      projectRepositoryUrl: process.env.NUXT_PROJECT_REPOSITORY_URL, // 项目代码托管存储库地址
      projectLicenseType: process.env.NUXT_PROJECT_LICENSE_TYPE, // 项目许可证类型
      projectLicenseUrl: process.env.NUXT_PROJECT_LICENSE_URL, // 项目许可证地址
      cosBucket: process.env.NUXT_COS_BUCKET, // 存储桶名称
      cosRegion: process.env.NUXT_COS_REGION, // 所属地域
      cosAppId: process.env.NUXT_COS_APPID, // 存储桶 ID
    },
  },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@prisma/nuxt', '@sidebase/nuxt-auth'],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  prisma: {
    autoSetupPrisma: true,
  },
  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    baseURL: '/api/auth',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        getSession: { path: '/user', method: 'get' },
      },
      session: {
        dataType: {
          iss: 'string',
          sub: 'string',
          exp: 'number',
          username: 'string',
          nickname: 'string',
          avatar_url: 'string',
          roles: 'object',
        },
      },
      token: {
        signInResponseTokenPointer: '/token/accessToken',
        sameSiteAttribute: 'lax',
      },
      refresh: {
        isEnabled: true,
        endpoint: { path: '/refresh', method: 'post' },
        refreshOnlyToken: true,
        token: {
          signInResponseRefreshTokenPointer: '/token/refreshToken',
          maxAgeInSeconds: 60 * 60 * 24,
        },
      },
      pages: {
        login: '/login',
      },
    },
    globalAppMiddleware: true,
  },
})
