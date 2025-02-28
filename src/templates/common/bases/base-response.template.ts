export function generateBaseResponseContent(): string {
  return `import { ApiProperty } from '@nestjs/swagger';

export class BasePaginationResponse {
  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPage: number;

  @ApiProperty()
  totalData: number;

  constructor(page?: number, totalPage?: number, totalData?: number) {
    this.page = page ? page : 1;
    this.totalPage = totalPage ? totalPage : 1;
    this.totalData = totalData ? totalData : 0;
  }
}

export class BaseSuccessResponse<TData> {
  @ApiProperty()
  data: TData | TData[];

  @ApiProperty()
  meta?: BasePaginationResponse | null;

  constructor(data: TData | TData[], meta?: BasePaginationResponse) {
    this.data = data;
    this.meta = meta || null;
  }
}

export class BaseExceptionResponse {
  code: string;
  detail: string;
  attr?: string;

  constructor(code: string, detail: string, attr?: string) {
    this.code = code;
    this.detail = detail;
    this.attr = attr ? attr : '';
  }
}

export class BaseErrorResponse {
  @ApiProperty()
  type: string;

  @ApiProperty()
  errors: BaseExceptionResponse | BaseExceptionResponse[] | string | object;

  @ApiProperty()
  path: string;

  @ApiProperty()
  timestamp?: Date;

  constructor(
    type: string,
    errors: BaseExceptionResponse | BaseExceptionResponse[] | string | object,
    path?: string,
    timestamp?: Date,
  ) {
    this.type = type;
    this.errors = errors;
    this.path = path ? path : 'pathUrl';
    this.timestamp = timestamp ? timestamp : new Date();
  }
}

export class ResponseWrapperService {
  async list<TData>(
    data: TData,
    meta: BasePaginationResponse,
  ): Promise<BaseSuccessResponse<TData>> {
    return new BaseSuccessResponse(data, meta);
  }

  async detail<TData>(data: TData): Promise<BaseSuccessResponse<TData>> {
    const result = new BaseSuccessResponse(data);
    delete result.meta;
    return result;
  }

  async error(
    type: string,
    errors: BaseExceptionResponse | BaseExceptionResponse[] | string | object,
    path: string,
    timestamp?: Date,
  ): Promise<BaseErrorResponse> {
    return new BaseErrorResponse(type, errors, path, timestamp);
  }
}
`;
}
