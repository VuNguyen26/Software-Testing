/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',

    alias: {
      '@': path.resolve(__dirname, './src'),
    },

    // Luôn đảm bảo MODE=test khi chạy Vitest
    env: {
      MODE: "test",
      NODE_ENV: "test",
    },

    // PATCH COVERAGE FULL — cực quan trọng
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],

      // ÉP Vitest đọc coverage của TẤT CẢ file
      all: true,

      // Chỉ tính coverage trong src
      include: ['src/**/*.{js,jsx}'],

      // Giải quyết lỗi line mapping không đúng (đặc biệt khi dùng mock)
      cleanOnRerun: true,
      reportsDirectory: './coverage',
    },
  },
})
