import { DomainException } from '~/modules/Exception/Domain/DomainException.ts'

export class ValueObjectException extends DomainException {
  public static invalidPageSizeId = 'value_object_invalid_page_size'
  public static invalidPageNumberId = 'value_object_invalid_page_number'


  public static invalidPageSize(pageSize: number, max: number, min: number): ValueObjectException {
    return new ValueObjectException(
      `PageSize is out of bounds: : ${pageSize} (min ${min}, max ${max})`,
      this.invalidPageSizeId
    )
  }

  public static invalidPageNumber(pageNumber: number, max: number, min: number): ValueObjectException {
    return new ValueObjectException(
      `PageNumber is out of bounds: : ${pageNumber} (min ${min}, max ${max})`,
      this.invalidPageNumberId
    )
  }
}