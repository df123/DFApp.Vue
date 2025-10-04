import ApiService from "./base";
import type { PagedRequestDto, PagedResultDto } from "../types/api";
import type {
  ConfigurationInfoDto,
  CreateUpdateConfigurationInfoDto
} from "../types/business";

// 配置管理 API
export class ConfigurationApi extends ApiService {
  constructor() {
    super("/api");
  }

  // GET /api/app/configuration-info
  async getConfigurations(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<ConfigurationInfoDto>> {
    return this.get("/app/configuration-info", params);
  }

  // POST /api/app/configuration-info
  async createConfiguration(
    request: CreateUpdateConfigurationInfoDto
  ): Promise<ConfigurationInfoDto> {
    return this.post("/app/configuration-info", request);
  }

  // PUT /api/app/configuration-info/{id}
  async updateConfiguration(
    id: number,
    request: CreateUpdateConfigurationInfoDto
  ): Promise<ConfigurationInfoDto> {
    return this.put(`/app/configuration-info/${id}`, request);
  }

  // DELETE /api/app/configuration-info/{id}
  async deleteConfiguration(id: number): Promise<void> {
    return this.delete(`/app/configuration-info/${id}`);
  }
}

// 导出实例
export const configurationApi = new ConfigurationApi();

export default configurationApi;
