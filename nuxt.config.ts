// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  css: [
    '~/assets/normalize.css',
    '~/assets/reset.local.css',
  ],

  modules: ['@nuxtjs/color-mode'],
})