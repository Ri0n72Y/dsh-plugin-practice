import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/plugin.ts',
    'src/workspace-info.ts',
    'src/configurable-greet.ts',
    'src/workspace-name-service.ts',
    'src/workspace-name-tool.ts',
    'src/workspace-event-contract.ts',
    'src/workspace-event-emitter.ts',
    'src/workspace-event-listener.ts',
    'src/workspace-transform-contract.ts',
    'src/workspace-transform-uppercase.ts',
    'src/workspace-transform-block.ts',
    'src/workspace-transform-tool.ts',
  ],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: true,
})
