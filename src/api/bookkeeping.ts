import { http } from "@/utils/http";
import type {
  PagedRequestDto,
  PagedResultDto,
  BookkeepingCategoryDto,
  CreateUpdateBookkeepingCategoryDto,
  BookkeepingExpenditureDto,
  CreateUpdateBookkeepingExpenditureDto,
  GetExpendituresRequestDto
} from "@/types/api";

class BookkeepingCategoryApi {
  private baseUrl = "/api/app/bookkeeping-category";

  /**
   * 获取记账分类列表
   */
  async getCategories(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<BookkeepingCategoryDto>> {
    return http.get(this.baseUrl, { params });
  }

  /**
   * 创建记账分类
   */
  async createCategory(
    request: CreateUpdateBookkeepingCategoryDto
  ): Promise<BookkeepingCategoryDto> {
    return http.post(this.baseUrl, { data: request });
  }

  /**
   * 更新记账分类
   */
  async updateCategory(
    id: number,
    request: CreateUpdateBookkeepingCategoryDto
  ): Promise<BookkeepingCategoryDto> {
    return http.request("put", `${this.baseUrl}/${id}`, { data: request });
  }

  /**
   * 删除记账分类
   */
  async deleteCategory(id: number): Promise<void> {
    return http.request("delete", `${this.baseUrl}/${id}`);
  }
}

class BookkeepingExpenditureApi {
  private baseUrl = "/api/app/bookkeeping-expenditure";

  /**
   * 获取支出列表
   */
  async getExpenditures(
    params?: GetExpendituresRequestDto
  ): Promise<PagedResultDto<BookkeepingExpenditureDto>> {
    return http.get(this.baseUrl, { params });
  }

  /**
   * 创建支出
   */
  async createExpenditure(
    request: CreateUpdateBookkeepingExpenditureDto
  ): Promise<BookkeepingExpenditureDto> {
    return http.post(this.baseUrl, { data: request, withCredentials: false });
  }

  /**
   * 更新支出
   */
  async updateExpenditure(
    id: number,
    request: CreateUpdateBookkeepingExpenditureDto
  ): Promise<BookkeepingExpenditureDto> {
    return http.request("put", `${this.baseUrl}/${id}`, { data: request });
  }

  /**
   * 删除支出
   */
  async deleteExpenditure(id: number): Promise<void> {
    return http.request("delete", `${this.baseUrl}/${id}`);
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
