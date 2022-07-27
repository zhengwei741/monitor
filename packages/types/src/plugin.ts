/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Plugin {
  name: string
  method: (...args: any) => any
}
