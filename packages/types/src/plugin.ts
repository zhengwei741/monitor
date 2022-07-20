export interface Plugin {
  name: string
  method: (...args: any) => any
}
