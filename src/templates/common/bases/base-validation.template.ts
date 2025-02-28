export function generateBaseValidationContent(): string {
  return `import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BaseExceptionResponse } from './base.response';

@Injectable()
export class BaseValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]): BaseExceptionResponse[] {
    return errors.map((err) => {
      const { constraints } = err;
      const code = Object.keys(constraints)[0];
      const detail = constraints[code];
      const baseErrorFormat = new BaseExceptionResponse(
        code,
        detail,
        err.property,
      );
      return baseErrorFormat;
    });
  }
}
    `;
}
