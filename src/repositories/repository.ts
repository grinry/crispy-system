export class Repository<T> {
  protected items: Array<T> = [];
  public add(item: T): number {
    return this.items.push(item);
  }
  public remove(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
  public all(): Array<T> {
    return this.items;
  }
}
