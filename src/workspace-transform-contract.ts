import '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Events {
    'practice/workspace-transform': (
      input: string,
      next: () => Promise<string>,
    ) => Promise<string>
  }
}
