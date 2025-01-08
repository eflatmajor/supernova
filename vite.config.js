import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src')
      },
      {
        find: 'game',
        replacement: resolve(__dirname, './src/game')
      },
      {
        find: 'stores',
        replacement: resolve(__dirname, './src/stores')
      },
      {
        find: 'components',
        replacement: resolve(__dirname, './src/components')
      },
      {
        find: 'components',
        replacement: resolve(__dirname, './src/components')
      },
      {
        find: 'utilities',
        replacement: resolve(__dirname, './src/utilities')
      },
      {
        find: 'items',
        replacement: resolve(__dirname, './data/items')
      },
      {
        find: 'loot_tables',
        replacement: resolve(__dirname, './data/loot_tables')
      },
    ]
  }
});
