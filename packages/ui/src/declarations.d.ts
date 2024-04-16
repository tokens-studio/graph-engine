declare module '*.svg' {
  export = React.PureComponent;
}


declare module "spyfs" {

  type Action = Promise & {
    args: any[]
    exec: () => any
    isAsync: boolean
    method: string
    resolve: (result: any) => void
    reject: (error: any) => void
  }

  interface Spied {
    subscribe: (cb: (action: Action) => void) => void;
    on(event:string, cb: (action: Action) => void): void;
  }

  export function spy<T>(fs: T): T & Spied;
}