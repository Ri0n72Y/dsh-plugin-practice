import '@deepseek-ai/cordis'

export interface WorkspaceAnnouncedPayload {
  name: string
}

declare module '@deepseek-ai/cordis' {
  interface Events {
    'practice/workspace-announced': (payload: WorkspaceAnnouncedPayload) => void
  }
}
