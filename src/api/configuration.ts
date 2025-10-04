import { ApiService } from "./base";
import type {
  PagedRequestDto,
  PagedResultDto,
  ConfigurationInfoDto,
  CreateUpdateConfigurationInfoDto
} from "@/types/api";

class ConfigurationApi extends ApiService {
  constructor() {
    super("/api/app/configuration-info");
  }

  /**
   * 获取配置列表
   */
  async getConfigurations(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<ConfigurationInfoDto>> {
    return this.get("", { params });
  }

  /**
   * 创建配置
   */
  async createConfiguration(
    request: CreateUpdateConfigurationInfoDto
  ): Promise<ConfigurationInfoDto> {
    return this.post("", request);
  }

  /**
   * 更新配置
   */
  async updateConfiguration(
    id: number,
    request: CreateUpdateConfigurationInfoDto
  ): Promise<ConfigurationInfoDto> {
    return this.put(`/${id}`, request);
  }

  /**
   * 删除配置
   */
  async deleteConfiguration(id: number): Promise<void> {
    return this.delete(`/${id}`);
  }
}

// 导出单例实例
export const configurationApi = new ConfigurationApi();

// 导出用于 Composition API 的 hook
export function useConfigurationApi() {
  return configurationApi;
}
