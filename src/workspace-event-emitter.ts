import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import './workspace-event-contract.ts'
import './workspace-name-service.ts'

export const name = 'practice-workspace-event-emitter'
export const inject = ['tools', 'workspaceName']

export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'announce_workspace',
    description: 'Announce the current workspace through a Cordis event.',
    parameters: {},
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute() {
      const name = ctx.workspaceName.getName()
      ctx.emit('practice/workspace-announced', { name })
      return name
    },
  }))
}
