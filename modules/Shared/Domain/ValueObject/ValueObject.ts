export abstract class ValueObject<T> {
  protected readonly _value: T

  protected constructor(value: T) {
    this._value = value
    Object.freeze(this)
  }

  public get value(): T {
    return this._value
  }

  public equals(other: ValueObject<T>): boolean {
    if (other === this) return true
    if (!other) return false

    return Object.is(this._value, other._value)
  }

  public toPrimitives(): T {
    return this._value
  }

  public toString(): string {
    return String(this._value)
  }
}