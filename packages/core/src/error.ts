interface IBaseError<T> {
  submitErrorids: Array<number>

  createErrorid?: (metrics: T) => string | boolean
}

export abstract class BaseError<T> implements IBaseError<T> {
  public submitErrorids: number[] = []

  hashErrorId(str: string): number {
    let hash = 0
    if (str.length == 0) return hash
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return hash
  }
}
