// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
  },
})
