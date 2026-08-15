import type { Context } from '@deepseek-ai/cordis'
import type {} from './workspace-transform-contract.ts'

export const name = 'practice-workspace-transform-uppercase'

export function apply(ctx: Context): void {
  ctx.on('practice/workspace-transform', async (_input, next) => {
    const downstream = await next()
    return downstream.toUpperCase()
  })
}
