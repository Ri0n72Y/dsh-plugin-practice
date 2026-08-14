import { basename } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'practice-workspace-info'
export const inject = ['tools']

export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'workspace_info',
    description: 'Return basic information about the current workspace.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        properties: {
          cwd: { type: 'string', required: true },
          name: { type: 'string', required: true },
        },
        additionalProperties: false,
      },
      render: (_args, value) => [{
        type: 'text',
        text: `Workspace: ${value.name}\nPath: ${value.cwd}`,
      }],
    },
    async execute() {
      const cwd = process.cwd()
      return {
        cwd,
        name: basename(cwd),
      }
    },
  }))
}
