import { basename } from 'node:path'
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    workspaceName: WorkspaceNameService
  }
}

export default class WorkspaceNameService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'workspaceName')
  }

  getName(): string {
    return basename(process.cwd())
  }
}
