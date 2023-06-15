import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

const toNumber = (value: string, opts: ToNumberOptions = {}): number => {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
};

export class DefaultPagination {
  @Transform(({ value }) => toNumber(value, { min: 1, default: 1 }))
  @IsOptional()
  pageNumber = 1;

  @Transform(({ value }) => toNumber(value, { min: 1, default: 10 }))
  @IsOptional()
  pageSize = 10;

  @IsOptional()
  sortBy = 'created_at';

  @Transform(({ value }) => (value === 'asc' ? 'asc' : 'desc'))
  @IsOptional()
  sortDirection: 'asc' | 'desc' = 'desc';

  skip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export class BlogQueryPagination extends DefaultPagination {
  @Transform(({ value }) => value ?? '')
  @IsOptional()
  searchNameTerm = '';
}

export class PostQueryPagination extends DefaultPagination {}

export class CommentQueryPagination extends DefaultPagination {}

export class SaQueryPagination extends DefaultPagination {
  @Transform(({ value }) => value ?? '')
  @IsOptional()
  searchEmailTerm = '';

  @Transform(({ value }) => value ?? '')
  @IsOptional()
  searchLoginTerm = '';

  @Transform(({ value }) =>
    value === 'banned' ? true : value === 'notBanned' ? false : null,
  )
  @IsOptional()
  banStatus: null | true | false = null;
}
