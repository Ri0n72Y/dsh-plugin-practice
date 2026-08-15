import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type {} from './workspace-transform-contract.ts'

export const name = 'practice-workspace-transform-tool'
export const inject = ['tools']

export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'waterfall_demo',
    description: 'Run text through the practice Cordis waterfall middleware chain.',
    parameters: {
      input: { type: 'string', required: true, description: 'Text to transform' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return ctx.waterfall(
        'practice/workspace-transform',
        args.input,
        async () => args.input,
      )
    },
  }))
}
