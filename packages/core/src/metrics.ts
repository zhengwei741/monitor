interface IBaseMetrics<T> {
  /**已上报id列表*/
  submitids: Array<number>;
  /**生成id*/
  createId?: (metrics: T) => string | boolean;
}

export abstract class BaseMetrics<T> implements IBaseMetrics<T> {
  public submitids: number[] = [];

  hashId(str: string): number {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }
}
