import { ApiService } from "./base";
import type {
  PagedRequestDto,
  PagedResultDto,
  BookkeepingCategoryDto,
  CreateUpdateBookkeepingCategoryDto,
  BookkeepingExpenditureDto,
  CreateUpdateBookkeepingExpenditureDto,
  GetExpendituresRequestDto
} from "@/types/api";

class BookkeepingCategoryApi extends ApiService {
  constructor() {
    super("/api/app/bookkeeping-category");
  }

  /**
   * 获取记账分类列表
   */
  async getCategories(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<BookkeepingCategoryDto>> {
    return this.get("", { params });
  }

  /**
   * 创建记账分类
   */
  async createCategory(
    request: CreateUpdateBookkeepingCategoryDto
  ): Promise<BookkeepingCategoryDto> {
    return this.post("", request);
  }

  /**
   * 更新记账分类
   */
  async updateCategory(
    id: number,
    request: CreateUpdateBookkeepingCategoryDto
  ): Promise<BookkeepingCategoryDto> {
    return this.put(`/${id}`, request);
  }

  /**
   * 删除记账分类
   */
  async deleteCategory(id: number): Promise<void> {
    return this.delete(`/${id}`);
  }
}

class BookkeepingExpenditureApi extends ApiService {
  constructor() {
    super("/api/app/bookkeeping-expenditure");
  }

  /**
   * 获取支出列表
   */
  async getExpenditures(
    params?: GetExpendituresRequestDto
  ): Promise<PagedResultDto<BookkeepingExpenditureDto>> {
    return this.get("", { params });
  }

  /**
   * 创建支出
   */
  async createExpenditure(
    request: CreateUpdateBookkeepingExpenditureDto
  ): Promise<BookkeepingExpenditureDto> {
    return this.post("", request);
  }

  /**
   * 更新支出
   */
  async updateExpenditure(
    id: number,
    request: CreateUpdateBookkeepingExpenditureDto
  ): Promise<BookkeepingExpenditureDto> {
    return this.put(`/${id}`, request);
  }

  /**
   * 删除支出
   */
  async deleteExpenditure(id: number): Promise<void> {
    return this.delete(`/${id}`);
  }
}

// 导出单例实例
export const bookkeepingCategoryApi = new BookkeepingCategoryApi();
export const bookkeepingExpenditureApi = new BookkeepingExpenditureApi();

// 导出用于 Composition API 的 hook
export function useBookkeepingCategoryApi() {
  return bookkeepingCategoryApi;
}

export function useBookkeepingExpenditureApi() {
  return bookkeepingExpenditureApi;
}
