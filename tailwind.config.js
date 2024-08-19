/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Avenir', 'Bahnschrift', 'Tahoma', 'Helvetica Neue', 'Segoe UI', 'Arial', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', 'sans-serif', 'Apple Logo'],
      },
    },
  },
  plugins: [],
}
