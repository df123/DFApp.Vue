import { http } from "@/utils/http";
import type { PagedRequestDto, PagedResultDto } from "../types/api";
import type {
  LotteryDto,
  CreateUpdateLotteryDto,
  LotteryGroupDto,
  LotteryResultDto,
  CreateUpdateLotteryResultDto,
  ConstsDto,
  GenerateRandomNumbersDto,
  LotterySimulationDto,
  StatisticsDto,
  StatisticsWinRequestDto,
  StatisticsWinItemDto,
  LotteryCombinationDto
} from "../types/business";

// 彩票基础 API
export class LotteryApi {
  private baseUrl = "/api/app/lottery";

  // GET /api/app/lottery
  async getLotteries(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<LotteryDto>> {
    return http.get(this.baseUrl, { params });
  }

  // POST /api/app/lottery
  async createLottery(request: CreateUpdateLotteryDto): Promise<LotteryDto> {
    return http.post(this.baseUrl, { data: request });
  }

  // PUT /api/app/lottery/{id}
  async updateLottery(
    id: number,
    request: CreateUpdateLotteryDto
  ): Promise<LotteryDto> {
    return http.request("put", `${this.baseUrl}/${id}`, { data: request });
  }

  // DELETE /api/app/lottery/{id}
  async deleteLottery(id: number): Promise<void> {
    return http.request("delete", `${this.baseUrl}/${id}`);
  }

  // GET /api/app/lottery-grouped
  async getLotteryGroups(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<LotteryGroupDto>> {
    return http.get(`${this.baseUrl}/grouped`, { params });
  }

  // POST /api/app/lottery-grouped
  async createLotteryGroup(
    request: CreateUpdateLotteryDto
  ): Promise<LotteryGroupDto> {
    return http.post("/api/app/lottery-grouped", { data: request });
  }

  // GET /api/app/lottery/const
  async getLotteryConsts(): Promise<ConstsDto[]> {
    return http.get(`${this.baseUrl}/lottery-const`);
  }

  // GET /api/app/lottery/statistics-win
  async getStatisticsWin(
    purchasedPeriod?: string,
    winningPeriod?: string,
    lotteryType?: string
  ): Promise<StatisticsWinItemDto[]> {
    return http.get(`${this.baseUrl}/statistics-win`, {
      params: { purchasedPeriod, winningPeriod, lotteryType }
    });
  }
}

// 彩票结果 API
export class LotteryResultApi {
  private baseUrl = "/api/app/lottery-result";

  // GET /api/app/lottery-result
  async getLotteryResults(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<LotteryResultDto>> {
    return http.get(this.baseUrl, { params });
  }

  // POST /api/app/lottery-result
  async createLotteryResult(
    request: CreateUpdateLotteryResultDto
  ): Promise<LotteryResultDto> {
    return http.post(this.baseUrl, { data: request });
  }

  // PUT /api/app/lottery-result/{id}
  async updateLotteryResult(
    id: number,
    request: CreateUpdateLotteryResultDto
  ): Promise<LotteryResultDto> {
    return http.request("put", `${this.baseUrl}/${id}`, { data: request });
  }

  // DELETE /api/app/lottery-result/{id}
  async deleteLotteryResult(id: number): Promise<void> {
    return http.request("delete", `${this.baseUrl}/${id}`);
  }
}

// 彩票模拟 API
export class LotterySimulationApi {
  private baseUrl = "/api/app/lottery/simulation";

  // POST /api/app/lottery/simulation/kl8
  async generateKL8Simulation(
    request: GenerateRandomNumbersDto
  ): Promise<LotterySimulationDto> {
    return http.post(`${this.baseUrl}/kl8`, { data: request });
  }

  // GET /api/app/lottery/simulation/kl8/statistics
  async getKL8Statistics(termNumber?: number): Promise<StatisticsDto> {
    return http.get(`${this.baseUrl}/kl8/statistics`, {
      params: { termNumber }
    });
  }

  // POST /api/app/lottery/simulation/ssq
  async generateSSQSimulation(
    request: GenerateRandomNumbersDto
  ): Promise<LotterySimulationDto> {
    return http.post(`${this.baseUrl}/ssq`, { data: request });
  }

  // GET /api/app/lottery/simulation/ssq/statistics
  async getSSQStatistics(termNumber?: number): Promise<StatisticsDto> {
    return http.get(`${this.baseUrl}/ssq/statistics`, {
      params: { termNumber }
    });
  }
}

// 彩票统计 API
export class LotteryStatisticsApi {
  private baseUrl = "/api/app/lottery/statistics-win";

  // GET /api/app/lottery/statistics-win
  async getWinStatistics(
    params?: StatisticsWinRequestDto
  ): Promise<PagedResultDto<StatisticsWinItemDto>> {
    return http.get(this.baseUrl, { params });
  }
}

// 彩票组合 API
export class LotteryCombinationApi {
  private baseUrl = "/api/app/lottery-combination";

  // POST /api/app/lottery-combination
  async generateCombination(
    request: LotteryCombinationDto
  ): Promise<LotteryCombinationDto> {
    return http.post(this.baseUrl, { data: request });
  }
}

// 导出实例
export const lotteryApi = new LotteryApi();
export const lotteryResultApi = new LotteryResultApi();
export const lotterySimulationApi = new LotterySimulationApi();
export const lotteryStatisticsApi = new LotteryStatisticsApi();
export const lotteryCombinationApi = new LotteryCombinationApi();

export default {
  lottery: lotteryApi,
  result: lotteryResultApi,
  simulation: lotterySimulationApi,
  statistics: lotteryStatisticsApi,
  combination: lotteryCombinationApi
};
