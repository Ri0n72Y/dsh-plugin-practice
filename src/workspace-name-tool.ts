import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type {} from './workspace-name-service.ts'

export const name = 'practice-workspace-name-tool'
export const inject = ['tools', 'workspaceName']

export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'workspace_name',
    description: 'Return the current workspace name through the workspaceName service.',
    parameters: {},
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute() {
      return ctx.workspaceName.getName()
    },
  }))
}
