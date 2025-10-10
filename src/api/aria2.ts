import { http } from "@/utils/http";
import type { PagedRequestDto, PagedResultDto } from "../types/api";
import type {
  TellStatusResultDto,
  AddDownloadRequestDto,
  AddDownloadResponseDto,
  ExternalLinkResponseDto
} from "../types/business";

class Aria2Api {
  private baseUrl = "/api/app/aria2";

  /**
   * 获取下载状态
   */
  async getAria2Status(
    params?: PagedRequestDto & { filter?: string }
  ): Promise<PagedResultDto<TellStatusResultDto>> {
    return http.get(this.baseUrl, { params });
  }

  /**
   * 添加下载
   */
  async addDownload(
    request: AddDownloadRequestDto
  ): Promise<AddDownloadResponseDto> {
    return http.post(this.baseUrl, { data: request });
  }

  /**
   * 获取外部链接
   */
  async getExternalLink(id: number): Promise<ExternalLinkResponseDto> {
    return http.get(`${this.baseUrl}/${id}/external-link`);
  }
}

// 导出单例实例
export const aria2Api = new Aria2Api();

// 导出用于 Composition API 的 hook
export function useAria2Api() {
  return aria2Api;
}

export default aria2Api;
