export class Signal<T = void> {
  private observers: Array<(data: T) => void> = [];

  public subscribe(observer: (data: T) => void) {
    this.observers.push(observer);
    return () => this.unsubscribe(observer);
  }

  public unsubscribe(observer: (data: T) => void): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public notify(data: T): void {
    for (const observer of this.observers) {
      observer(data);
    }
  }
}
