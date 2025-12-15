import { http } from "@/utils/http";
import type { PagedRequestDto, PagedResultDto } from "../types/api";
import type {
  TellStatusResultDto,
  AddDownloadRequestDto,
  AddDownloadResponseDto
} from "../types/business";

class Aria2Api {
  private baseUrl = "/api/app/aria2";

  /**
   * 获取下载状态列表
   */
  async getAria2Status(
    params?: PagedRequestDto & { filter?: string }
  ): Promise<PagedResultDto<TellStatusResultDto>> {
    return http.get(this.baseUrl, { params });
  }

  /**
   * 获取单个外部链接
   */
  async getExternalLink(id: number): Promise<string> {
    return http.get(`${this.baseUrl}/${id}/external-link`);
  }

  /**
   * 获取所有外部链接
   * @param videoOnly 是否只获取视频文件链接
   */
  async getAllExternalLinks(videoOnly: boolean = true): Promise<string[]> {
    return http.get(`${this.baseUrl}/external-links`, {
      params: { videoOnly }
    });
  }

  /**
   * 删除单个记录
   */
  async delete(id: number): Promise<void> {
    return http.request("delete", `${this.baseUrl}/${id}`);
  }

  /**
   * 删除所有记录
   */
  async deleteAll(): Promise<void> {
    return http.request("delete", `${this.baseUrl}/all`);
  }

  /**
   * 清空下载目录
   */
  async clearDownloadDirectory(): Promise<void> {
    return http.post(`${this.baseUrl}/clear-download-directory`);
  }

  /**
   * 添加下载任务
   */
  async addDownload(
    request: AddDownloadRequestDto
  ): Promise<AddDownloadResponseDto> {
    return http.post(`${this.baseUrl}/add-download`, { data: request });
  }
}

// 导出单例实例
export const aria2Api = new Aria2Api();

// 导出用于 Composition API 的 hook
export function useAria2Api() {
  return aria2Api;
}

export default aria2Api;
