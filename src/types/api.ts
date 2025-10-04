// ABP 标准分页参数
export interface PagedRequestDto {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

// ABP 标准分页响应
export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
}

// ABP 应用配置响应
export interface ApplicationConfigurationDto {
  localization: Record<string, any>;
  auth: Record<string, any>;
  setting: Record<string, any>;
  currentUser: Record<string, any>;
  features: Record<string, any>;
  globalFeatures: Record<string, any>;
  multiTenancy: Record<string, any>;
  currentTenant: Record<string, any>;
  timing: Record<string, any>;
  clock: Record<string, any>;
  objectExtensions: Record<string, any>;
}

// API 响应包装（通用）
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
