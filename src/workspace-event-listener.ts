import type { Context } from '@deepseek-ai/cordis'
import './workspace-event-contract.ts'

export const name = 'practice-workspace-event-listener'

export function apply(ctx: Context): void {
  ctx.on('practice/workspace-announced', ({ name }) => {
    console.log(`[workspace-event] announced: ${name}`)
  })
}
