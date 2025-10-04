import ApiService from "./base";
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
export class LotteryApi extends ApiService {
  constructor() {
    super("/api");
  }

  // GET /api/app/lottery
  async getLotteries(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<LotteryDto>> {
    return this.get("/app/lottery", params);
  }

  // POST /api/app/lottery
  async createLottery(request: CreateUpdateLotteryDto): Promise<LotteryDto> {
    return this.post("/app/lottery", request);
  }

  // PUT /api/app/lottery/{id}
  async updateLottery(
    id: number,
    request: CreateUpdateLotteryDto
  ): Promise<LotteryDto> {
    return this.put(`/app/lottery/${id}`, request);
  }

  // DELETE /api/app/lottery/{id}
  async deleteLottery(id: number): Promise<void> {
    return this.delete(`/app/lottery/${id}`);
  }

  // GET /api/app/lottery-grouped
  async getLotteryGroups(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<LotteryGroupDto>> {
    return this.get("/app/lottery-grouped", params);
  }

  // POST /api/app/lottery-grouped
  async createLotteryGroup(
    request: CreateUpdateLotteryDto
  ): Promise<LotteryGroupDto> {
    return this.post("/app/lottery-grouped", request);
  }

  // GET /api/app/lottery/consts
  async getLotteryConsts(): Promise<ConstsDto> {
    return this.get("/app/lottery/consts");
  }
}

// 彩票结果 API
export class LotteryResultApi extends ApiService {
  constructor() {
    super("/api");
  }

  // GET /api/app/lottery-result
  async getLotteryResults(
    params?: PagedRequestDto
  ): Promise<PagedResultDto<LotteryResultDto>> {
    return this.get("/app/lottery-result", params);
  }

  // POST /api/app/lottery-result
  async createLotteryResult(
    request: CreateUpdateLotteryResultDto
  ): Promise<LotteryResultDto> {
    return this.post("/app/lottery-result", request);
  }

  // PUT /api/app/lottery-result/{id}
  async updateLotteryResult(
    id: number,
    request: CreateUpdateLotteryResultDto
  ): Promise<LotteryResultDto> {
    return this.put(`/app/lottery-result/${id}`, request);
  }

  // DELETE /api/app/lottery-result/{id}
  async deleteLotteryResult(id: number): Promise<void> {
    return this.delete(`/app/lottery-result/${id}`);
  }
}

// 彩票模拟 API
export class LotterySimulationApi extends ApiService {
  constructor() {
    super("/api");
  }

  // POST /api/app/lottery/simulation/kl8
  async generateKL8Simulation(
    request: GenerateRandomNumbersDto
  ): Promise<LotterySimulationDto> {
    return this.post("/app/lottery/simulation/kl8", request);
  }

  // GET /api/app/lottery/simulation/kl8/statistics
  async getKL8Statistics(termNumber?: number): Promise<StatisticsDto> {
    return this.get("/app/lottery/simulation/kl8/statistics", { termNumber });
  }

  // POST /api/app/lottery/simulation/ssq
  async generateSSQSimulation(
    request: GenerateRandomNumbersDto
  ): Promise<LotterySimulationDto> {
    return this.post("/app/lottery/simulation/ssq", request);
  }

  // GET /api/app/lottery/simulation/ssq/statistics
  async getSSQStatistics(termNumber?: number): Promise<StatisticsDto> {
    return this.get("/app/lottery/simulation/ssq/statistics", { termNumber });
  }
}

// 彩票统计 API
export class LotteryStatisticsApi extends ApiService {
  constructor() {
    super("/api");
  }

  // GET /api/app/lottery/statistics-win
  async getWinStatistics(
    params?: StatisticsWinRequestDto
  ): Promise<PagedResultDto<StatisticsWinItemDto>> {
    return this.get("/app/lottery/statistics-win", params);
  }
}

// 彩票组合 API
export class LotteryCombinationApi extends ApiService {
  constructor() {
    super("/api");
  }

  // POST /api/app/lottery-combination
  async generateCombination(
    request: LotteryCombinationDto
  ): Promise<LotteryCombinationDto> {
    return this.post("/app/lottery-combination", request);
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
