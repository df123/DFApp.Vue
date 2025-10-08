import type { PagedRequestDto } from "./api";

// Aria2 模块类型

// Aria2 状态响应 (基于实际 Schema)
export interface TellStatusResultDto {
  id: number;
  gid: string;
  status: string;
  totalLength: string;
  completedLength: string;
  uploadLength: string;
  downloadSpeed: string;
  uploadSpeed: string;
  errorCode: string;
  errorMessage: string;
  files: Array<{
    path: string;
    length: string;
    completedLength: string;
  }>;
}

// 添加下载请求
export interface AddDownloadRequestDto {
  urls: string[];
  savePath?: string;
}

// 添加下载响应
export interface AddDownloadResponseDto {
  id: string;
}

// 外部链接响应
export interface ExternalLinkResponseDto {
  link: string;
}

// 记账模块类型

// 记账分类 DTO
export interface BookkeepingCategoryDto {
  id: number;
  category: string;
}

export interface CreateUpdateBookkeepingCategoryDto {
  category: string;
}

// 记账支出 DTO
export interface BookkeepingExpenditureDto {
  id: number;
  expenditureDate: string; // ISO 8601 格式
  expenditure: number; // double 类型
  remark: string;
  isBelongToSelf: boolean;
  category: BookkeepingCategoryDto;
  categoryId: number;
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

// 图表数据类型 (基于实际 Schema)
export interface ChartJSDto {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
  }>;
  total: number;
  compareTotal: number;
  differenceTotal: number;
}

// 图表查询参数
export interface ChartDataRequestDto {
  start?: string; // ISO 8601 日期时间
  end?: string;
  compareType?: CompareType; // 枚举: 0,1,2,3
  numberType?: NumberType; // 枚举: 0,1
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

// 枚举类型
export enum CompareType {
  None = 0,
  PreviousPeriod = 1,
  SamePeriodLastYear = 2,
  Custom = 3
}

export enum NumberType {
  Amount = 0,
  Count = 1
}

// 配置管理类型
export interface ConfigurationInfoDto {
  id: number;
  moduleName: string;
  configurationName: string;
  configurationValue: string;
  remark: string;
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
}

export interface CreateUpdateDynamicIPDto {
  ip: string;
  port: string;
}

// 文件上传类型
export interface FileUploadInfoDto {
  id: number;
  fileName: string;
  path: string;
  sha1: string;
  fileSize: number;
}

export interface CreateUpdateFileUploadInfoDto {
  fileName: string;
  path: string;
  sha1: string;
  fileSize: number;
}

export interface CustomFileTypeDto {
  configurationName: string;
  configurationValue: string;
}

// 彩票模块类型

// 基础彩票 DTO
export interface LotteryDto {
  id: number;
  indexNo: number;
  number: string;
  colorType: string;
  lotteryType: string;
  groupId: number;
}

export interface CreateUpdateLotteryDto {
  indexNo: number;
  number: string;
  colorType: string;
  lotteryType: string;
  groupId: number;
}

// 彩票组 DTO
export interface LotteryGroupDto {
  id: number;
  indexNo: number;
  lotteryType: string;
  groupId: number;
  redNumbers: string;
  blueNumber: string;
}

// 彩票结果 DTO
export interface LotteryResultDto {
  id: number;
  name: string;
  code: string;
  detailsLink: string;
  videoLink: string;
  date: string;
  week: string;
  red: string;
  blue: string;
  blue2: string;
  sales: string;
  poolMoney: string;
  content: string;
  addMoney: string;
  addMoney2: string;
  msg: string;
  z2Add: string;
  m2Add: string;
  creationTime?: string;
  prizegrades: Array<{
    type: number;
    typeNum: string;
    typeMoney: string;
  }>;
}

export interface CreateUpdateLotteryResultDto {
  name: string;
  code: string;
  detailsLink?: string;
  videoLink?: string;
  date: string;
  week: string;
  red: string;
  blue: string;
  blue2?: string;
  sales?: string;
  poolMoney?: string;
  content?: string;
  addMoney?: string;
  addMoney2?: string;
  msg?: string;
  z2Add?: string;
  m2Add?: string;
  prizegrades?: Array<{
    type: number;
    typeNum: string;
    typeMoney: string;
  }>;
}

// 彩票组合 DTO
export interface LotteryCombinationDto {
  [key: string]: any;
}

// 彩票常量 DTO
export interface ConstsDto {
  lotteryTypeEng: string;
  lotteryType: string;
}

// 彩票模拟相关类型
export interface GenerateRandomNumbersDto {
  [key: string]: any;
}

export interface LotterySimulationDto {
  [key: string]: any;
}

export interface StatisticsDto {
  [key: string]: any;
}

// 中奖统计查询参数
export interface StatisticsWinRequestDto extends PagedRequestDto {
  purchasedPeriod?: string;
  winningPeriod?: string;
  lotteryType?: string;
}

export interface StatisticsWinItemDto {
  code: string;
  buyAmount: number;
  winAmount: number;
}

// Telegram 模块类型

// TG 登录状态响应
export interface TGLoginStatusDto {
  status: string;
}

// TG 配置响应
export interface TGConfigDto {
  config: string;
}

// TG 聊天响应 (403 Forbidden)
export interface TGChatsDto {
  [key: string]: any;
}

// 日志模块类型
export interface LogEntryDto {
  message: string;
  timestamp: string; // ISO 8601 格式
}

export interface GetLogsRequestDto {
  level?: string;
  startTime?: string;
  endTime?: string;
  keyword?: string;
}
