import ApiService from "./base";
import type { PagedRequestDto, PagedResultDto } from "../types/api";
import type { DynamicIPDto, CreateUpdateDynamicIPDto } from "../types/business";

// 动态IP API
export class DynamicIpApi extends ApiService {
  constructor() {
    super("/api");
  }

  // GET /api/app/dynamic-ip
  async getDynamicIPs(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<DynamicIPDto>> {
    return this.get("/app/dynamic-ip", params);
  }

  // POST /api/app/dynamic-ip
  async createDynamicIP(
    request: CreateUpdateDynamicIPDto
  ): Promise<DynamicIPDto> {
    return this.post("/app/dynamic-ip", request);
  }

  // PUT /api/app/dynamic-ip/{id}
  async updateDynamicIP(
    id: string,
    request: CreateUpdateDynamicIPDto
  ): Promise<DynamicIPDto> {
    return this.put(`/app/dynamic-ip/${id}`, request);
  }

  // DELETE /api/app/dynamic-ip/{id}
  async deleteDynamicIP(id: string): Promise<void> {
    return this.delete(`/app/dynamic-ip/${id}`);
  }
}

// 导出实例
export const dynamicIpApi = new DynamicIpApi();

export default dynamicIpApi;
