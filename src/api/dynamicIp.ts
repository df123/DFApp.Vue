import { ApiService } from "./base";
import type {
  PagedRequestDto,
  PagedResultDto,
  DynamicIPDto,
  CreateUpdateDynamicIPDto
} from "@/types/api";

class DynamicIpApi extends ApiService {
  constructor() {
    super("/api/app/dynamic-ip");
  }

  /**
   * 获取动态IP列表
   */
  async getDynamicIPs(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<DynamicIPDto>> {
    return this.get("", params);
  }

  /**
   * 创建动态IP
   */
  async createDynamicIP(
    request: CreateUpdateDynamicIPDto
  ): Promise<DynamicIPDto> {
    return this.post("", request);
  }

  /**
   * 更新动态IP
   */
  async updateDynamicIP(
    id: string,
    request: CreateUpdateDynamicIPDto
  ): Promise<DynamicIPDto> {
    return this.put(`/${id}`, request);
  }

  /**
   * 删除动态IP
   */
  async deleteDynamicIP(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }
}

// 导出单例实例
export const dynamicIpApi = new DynamicIpApi();

// 导出用于 Composition API 的 hook
export function useDynamicIpApi() {
  return dynamicIpApi;
}
