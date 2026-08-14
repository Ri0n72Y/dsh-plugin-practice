import type { Context } from '@deepseek-ai/cordis'

export const name = 'practice-lifecycle'

export function apply(ctx: Context): void {
  console.log('[practice-lifecycle] loaded')

  ctx.effect(() => {
    const timer = setInterval(() => {
      console.log('[practice-lifecycle] heartbeat')
    }, 5_000)

    return () => {
      clearInterval(timer)
      console.log('[practice-lifecycle] disposed')
    }
  }, 'practice-lifecycle.heartbeat()')
}
