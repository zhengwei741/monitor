export class MonitorError extends Error {
  public name: string;

  public constructor(public message: string) {
    super(message);

    this.name = new.target.prototype.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
