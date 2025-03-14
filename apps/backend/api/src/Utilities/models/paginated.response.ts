export class PaginatedResponseDto<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: T;
  constructor(data: T, total, page, limit) {
    console.log(data, total, page, limit);
    this.data = data;
    this.total = total;
    this.limit = limit;
    this.page = page;
    this.totalPages = Math.ceil(total / limit);
  }
}
