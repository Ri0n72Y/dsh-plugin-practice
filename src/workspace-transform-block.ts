import type { Context } from '@deepseek-ai/cordis'
import type {} from './workspace-transform-contract.ts'

export const name = 'practice-workspace-transform-block'

export function apply(ctx: Context): void {
  ctx.on('practice/workspace-transform', async (input, next) => {
    if (input.includes('blocked')) return '** blocked **'
    return next()
  })
}
