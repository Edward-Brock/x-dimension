// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@prisma/nuxt"],
  eslint: {
    config: {
      stylistic: true
    }
  },
  prisma: {
    autoSetupPrisma: true
  }
})