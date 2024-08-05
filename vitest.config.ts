import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  test: {
    globalSetup: [
      './test.setup.ts'
    ],
  },
})