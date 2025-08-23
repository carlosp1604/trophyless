import { ValueObject } from './ValueObject'
import { ValueObjectException } from '~/modules/Shared/Domain/ValueObject/ValueObjectException.ts'

export class PageSizeValueObject extends ValueObject<number> {
  private constructor(value: number) {
    super(value) 
  }

  static withinBounds(pageSize: number, min: number, max: number): PageSizeValueObject {
    if (pageSize < min || pageSize > max) {
      throw ValueObjectException.invalidPageSize(pageSize, max, min)
    }

    return new PageSizeValueObject(pageSize)
  }
}