// https://v3.nuxtjs.org/api/configuration/nuxt.config
import monacoEditor from 'vite-plugin-monaco-editor';

export default defineNuxtConfig({
  vite: {
    plugins: [
      monacoEditor()
    ]
  }
})
