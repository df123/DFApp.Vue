import ApiService from "./base";
import type { PagedRequestDto, PagedResultDto } from "../types/api";
import type {
  TellStatusResultDto,
  AddDownloadRequestDto,
  AddDownloadResponseDto,
  ExternalLinkResponseDto
} from "../types/business";

// Aria2 管理 API
export class Aria2Api extends ApiService {
  constructor() {
    super("/api");
  }

  // GET /api/app/aria2 - 获取下载状态
  async getAria2Status(
    params?: PagedRequestDto & { filter?: string }
  ): Promise<PagedResultDto<TellStatusResultDto>> {
    return this.get("/app/aria2", params);
  }

  // POST /api/app/aria2 - 添加下载
  async addDownload(
    request: AddDownloadRequestDto
  ): Promise<AddDownloadResponseDto> {
    return this.post("/app/aria2", request);
  }

  // GET /api/app/aria2/{id}/external-link - 获取外部链接
  async getExternalLink(id: number): Promise<ExternalLinkResponseDto> {
    return this.get(`/app/aria2/${id}/external-link`);
  }
}

// 导出实例
export const aria2Api = new Aria2Api();
export default aria2Api;
