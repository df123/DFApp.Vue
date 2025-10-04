import ApiService from "./base";
import type { PagedRequestDto, PagedResultDto } from "../types/api";
import type {
  BookkeepingCategoryDto,
  CreateUpdateBookkeepingCategoryDto,
  BookkeepingExpenditureDto,
  CreateUpdateBookkeepingExpenditureDto,
  GetExpendituresRequestDto,
  ChartJSDto,
  ChartDataRequestDto,
  MonthlyExpenditureDto
} from "../types/business";

// 记账分类 API
export class BookkeepingCategoryApi extends ApiService {
  constructor() {
    super("/api");
  }

  // GET /api/app/bookkeeping-category
  async getCategories(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<BookkeepingCategoryDto>> {
    return this.get("/app/bookkeeping-category", params);
  }

  // POST /api/app/bookkeeping-category
  async createCategory(
    request: CreateUpdateBookkeepingCategoryDto
  ): Promise<BookkeepingCategoryDto> {
    return this.post("/app/bookkeeping-category", request);
  }

  // PUT /api/app/bookkeeping-category/{id}
  async updateCategory(
    id: number,
    request: CreateUpdateBookkeepingCategoryDto
  ): Promise<BookkeepingCategoryDto> {
    return this.put(`/app/bookkeeping-category/${id}`, request);
  }

  // DELETE /api/app/bookkeeping-category/{id}
  async deleteCategory(id: number): Promise<void> {
    return this.delete(`/app/bookkeeping-category/${id}`);
  }
}

// 记账支出 API
export class BookkeepingExpenditureApi extends ApiService {
  constructor() {
    super("/api");
  }

  // GET /api/app/bookkeeping-expenditure
  async getExpenditures(
    params?: GetExpendituresRequestDto
  ): Promise<PagedResultDto<BookkeepingExpenditureDto>> {
    return this.get("/app/bookkeeping-expenditure", params);
  }

  // POST /api/app/bookkeeping-expenditure
  async createExpenditure(
    request: CreateUpdateBookkeepingExpenditureDto
  ): Promise<BookkeepingExpenditureDto> {
    return this.post("/app/bookkeeping-expenditure", request);
  }

  // PUT /api/app/bookkeeping-expenditure/{id}
  async updateExpenditure(
    id: number,
    request: CreateUpdateBookkeepingExpenditureDto
  ): Promise<BookkeepingExpenditureDto> {
    return this.put(`/app/bookkeeping-expenditure/${id}`, request);
  }

  // DELETE /api/app/bookkeeping-expenditure/{id}
  async deleteExpenditure(id: number): Promise<void> {
    return this.delete(`/app/bookkeeping-expenditure/${id}`);
  }

  // GET /api/app/bookkeeping-expenditure/chart - 图表数据
  async getChartData(params?: ChartDataRequestDto): Promise<ChartJSDto> {
    return this.get("/app/bookkeeping-expenditure/chart", params);
  }

  // GET /api/app/bookkeeping-expenditure/monthly-expenditure - 月度支出
  async getMonthlyExpenditure(year?: number): Promise<MonthlyExpenditureDto> {
    return this.get("/app/bookkeeping-expenditure/monthly-expenditure", {
      year
    });
  }
}

// 导出实例
export const categoryApi = new BookkeepingCategoryApi();
export const expenditureApi = new BookkeepingExpenditureApi();

export default {
  category: categoryApi,
  expenditure: expenditureApi
};
