<template>
  <div>
    <div id="container" ref="monacoeditorcontainer"></div>
  </div>
</template>

<script setup lang="ts">
import 'monaco-editor-core';
import 'monaco-volar';
import * as onigasm from 'onigasm';
import onigasmWasm from 'onigasm/lib/onigasm.wasm?url';
import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker';
import vueWorker from 'monaco-volar/vue.worker?worker';
import { editor, Uri } from 'monaco-editor-core';
import { loadGrammars, loadTheme, prepareVirtualFiles } from 'monaco-volar';

const monacoeditorcontainer = ref<HTMLElement | null>(null);
const loadOnigasm = async () => onigasm.loadWASM(onigasmWasm);

const loadMonacoEnv = () => {
  (self as any).MonacoEnvironment = {
    async getWorker(_: any, label: string) {
      if (label === 'vue') {
        return new vueWorker();
      }
      return new editorWorker();
    },
  };
};

onMounted(() => {
  Promise.all([loadMonacoEnv(), loadOnigasm()]).then(([, ,]) => {
    // Check for valid element.
    if (!monacoeditorcontainer.value) return;

    // Prepare the virtual files.
    prepareVirtualFiles();

    const model = editor.createModel(
      '<template>\n\t<div>Hello World</div>\n</template>',
      'vue',
      Uri.parse('file:///demo.vue')
    );
    // Create the editor.
    const editorInstance = editor.create(monacoeditorcontainer.value, {
      theme: 'vs-dark',
      model,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: {
        enabled: false,
      },
      inlineSuggest: {
        enabled: false,
      },
    });

    loadGrammars(editorInstance);
  });
});
</script>

<style scoped>
#container {
  width: 100%;
  min-height: 800px;
}
</style>
