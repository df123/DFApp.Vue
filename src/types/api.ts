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

// 配置管理类型
export interface ConfigurationInfoDto {
  id: number;
  moduleName: string;
  configurationName: string;
  configurationValue: string;
  remark: string;
  creationTime?: string;
  lastModificationTime?: string;
}

export interface CreateUpdateConfigurationInfoDto {
  moduleName: string;
  configurationName: string;
  configurationValue: string;
  remark?: string;
}

// 动态IP类型
export interface DynamicIPDto {
  id: string; // UUID 格式
  ip: string;
  port: string;
  creationTime?: string;
  lastModificationTime?: string;
}

export interface CreateUpdateDynamicIPDto {
  ip: string;
  port: string;
}

// 记账分类类型
export interface BookkeepingCategoryDto {
  id: number;
  category: string;
  creationTime?: string;
  lastModificationTime?: string;
}

export interface CreateUpdateBookkeepingCategoryDto {
  category: string;
}

// 记账支出类型
export interface BookkeepingExpenditureDto {
  id: number;
  expenditureDate: string; // ISO 8601 格式
  expenditure: number; // double 类型
  remark: string;
  isBelongToSelf: boolean;
  category: BookkeepingCategoryDto;
  categoryId: number;
  creationTime?: string;
  lastModificationTime?: string;
}

export interface CreateUpdateBookkeepingExpenditureDto {
  expenditureDate: string;
  expenditure: number;
  remark?: string;
  isBelongToSelf: boolean;
  categoryId: number;
}

// 支出查询参数
export interface GetExpendituresRequestDto extends PagedRequestDto {
  filter?: string;
  categoryId?: number;
  isBelongToSelf?: boolean;
}

// 图表数据 DTO
export interface ChartJSDto {
  labels: string[];
  datasets: ChartDataset[];
  total: number;
  differenceTotal: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

// 图表查询参数
export interface GetChartDataRequestDto {
  start?: string;
  end?: string;
  compareType?: number;
  numberType?: string;
  isBelongToSelf?: boolean | null;
}

// 月度支出 DTO
export interface MonthlyExpenditureDto {
  labels: string[];
  totalData: number[];
  selfData: number[];
  nonSelfData: number[];
  totalAverage: number;
  selfAverage: number;
  nonSelfAverage: number;
}
