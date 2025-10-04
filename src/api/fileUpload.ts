import ApiService from "./base";
import type { PagedRequestDto, PagedResultDto } from "../types/api";
import type {
  FileUploadInfoDto,
  CreateUpdateFileUploadInfoDto,
  CustomFileTypeDto
} from "../types/business";

// 文件上传 API
export class FileUploadApi extends ApiService {
  constructor() {
    super("/api");
  }

  // GET /api/app/file-upload-info
  async getFileUploadInfos(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<FileUploadInfoDto>> {
    return this.get("/app/file-upload-info", params);
  }

  // POST /api/app/file-upload-info
  async createFileUploadInfo(
    request: CreateUpdateFileUploadInfoDto
  ): Promise<FileUploadInfoDto> {
    return this.post("/app/file-upload-info", request);
  }

  // PUT /api/app/file-upload-info/{id}
  async updateFileUploadInfo(
    id: number,
    request: CreateUpdateFileUploadInfoDto
  ): Promise<FileUploadInfoDto> {
    return this.put(`/app/file-upload-info/${id}`, request);
  }

  // DELETE /api/app/file-upload-info/{id}
  async deleteFileUploadInfo(id: number): Promise<void> {
    return this.delete(`/app/file-upload-info/${id}`);
  }

  // GET /api/app/file-upload-info/configuration-value
  async getCustomFileTypeConfig(
    configurationName?: string
  ): Promise<CustomFileTypeDto> {
    return this.get("/app/file-upload-info/configuration-value", {
      configurationName
    });
  }

  // 文件上传辅助方法 (使用 FormData)
  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<FileUploadInfoDto> {
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent: any) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      }
    };

    return this.post("/app/file-upload", formData, config);
  }
}

// 导出实例
export const fileUploadApi = new FileUploadApi();

export default fileUploadApi;
