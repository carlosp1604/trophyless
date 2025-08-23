import { ValueObject } from './ValueObject'
import { ValueObjectException } from '~/modules/Shared/Domain/ValueObject/ValueObjectException.ts'

export class PageNumberValueObject extends ValueObject<number> {
  private constructor(value: number) {
    super(value)
  }

  static withinBounds(pageNumber: number, min: number, max: number): PageNumberValueObject {
    if (pageNumber < min || pageNumber > max) {
      throw ValueObjectException.invalidPageNumber(pageNumber, max, min)
    }

    return new PageNumberValueObject(pageNumber)
  }
}