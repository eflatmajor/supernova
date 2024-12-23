// import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src')
      },
      {
        find: 'commands',
        replacement: resolve(__dirname, './src/components/commands')
      },
      {
        find: 'item',
        replacement: resolve(__dirname, './data/items')
      },
      {
        find: 'loot',
        replacement: resolve(__dirname, './data/loot_tables')
      },
    ]
  }
})
