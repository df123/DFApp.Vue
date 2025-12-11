import { http } from "@/utils/http";

// RSS获取请求DTO
export interface RssFetchRequestDto {
  url?: string;
  maxItems?: number;
}

// RSS条目DTO
export interface RssItemDto {
  title: string;
  link: string;
  description: string;
  publishDate?: string;
  author: string;
  category: string;
  extensions: Record<string, string>;
}

// RSS获取响应DTO
export interface RssFetchResponseDto {
  success: boolean;
  message: string;
  items: RssItemDto[];
  totalCount: number;
  requestUrl: string;
  statusCode: number;
  responseTime: number;
  rawContent: string;
}

// RSS获取 API
export class RssFetchApi {
  private baseUrl = "/api/app/rss-fetch";

  // POST /api/app/rss-fetch/fetch-rss-feed
  async fetchRssFeed(
    request: RssFetchRequestDto
  ): Promise<RssFetchResponseDto> {
    return http.post(`${this.baseUrl}/fetch-rss-feed`, { data: request });
  }

  // POST /api/app/rss-fetch/test-rss-feed-connection
  async testRssFeedConnection(url: string): Promise<RssFetchResponseDto> {
    return http.post(`${this.baseUrl}/test-rss-feed-connection`, {
      params: { url }
    });
  }
}

// 导出实例
export const rssFetchApi = new RssFetchApi();
