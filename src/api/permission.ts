import { http } from "@/utils/http/index";

export interface PermissionDto {
  name: string;
  displayName: string;
  parentName?: string;
  isGranted: boolean;
  allowedProviders: any[];
  grantedProviders: Array<{
    providerName: string;
    providerKey: string;
  }>;
}

export interface PermissionGroupDto {
  name: string;
  displayName: string;
  displayNameKey: string;
  displayNameResource: string;
  permissions: PermissionDto[];
}

export interface PermissionsResultDto {
  entityDisplayName: string;
  groups: PermissionGroupDto[];
}

class PermissionApi {
  private baseUrl = "/api/permission-management/permissions";

  /**
   * 获取权限列表
   * @param providerName 权限提供者类型 (R: Role, U: User)
   * @param providerKey 提供者标识 (角色名或用户ID)
   */
  async getPermissions(
    providerName: string,
    providerKey: string
  ): Promise<PermissionsResultDto> {
    return http.get(this.baseUrl, {
      params: {
        providerName,
        providerKey
      }
    });
  }

  /**
   * 获取用户权限
   * @param userId 用户ID
   */
  async getUserPermissions(userId: string): Promise<PermissionsResultDto> {
    return this.getPermissions("U", userId);
  }

  /**
   * 获取角色权限
   * @param roleName 角色名
   */
  async getRolePermissions(roleName: string): Promise<PermissionsResultDto> {
    return this.getPermissions("R", roleName);
  }
}

// 导出单例实例
export const permissionApi = new PermissionApi();

// 导出用于 Composition API 的 hook
export function usePermissionApi() {
  return permissionApi;
}
