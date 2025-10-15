<template>
  <div>
    <p>处理认证回调中...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { handleAuthCallback } from "@/utils/oidc";
import { setToken } from "@/utils/auth";
import { permissionApi } from "@/api/permission";
import type { PermissionDto, PermissionGroupDto } from "@/api/permission";

const router = useRouter();

// 处理权限数据，提取权限名称
const extractPermissionNames = (groups: PermissionGroupDto[]): string[] => {
  const permissions: string[] = [];

  groups.forEach(group => {
    group.permissions.forEach((permission: PermissionDto) => {
      if (permission.isGranted) {
        permissions.push(permission.name);
      }
    });
  });

  return permissions;
};

onMounted(async () => {
  const user = await handleAuthCallback();
  if (user) {
    // 认证成功，设置用户信息
    try {
      // 从用户信息中提取必要的数据
      let userData = {
        accessToken: user.access_token,
        expires: new Date(user.expires_at! * 1000), // 转换为Date对象
        refreshToken: user.refresh_token || "",
        username: user.profile?.name || user.profile?.preferred_username || "",
        nickname: user.profile?.nickname || user.profile?.name || "",
        avatar: user.profile?.picture || "",
        roles: Array.isArray(user.profile?.role) ? user.profile.role : [],
        permissions: Array.isArray(user.profile?.permission)
          ? user.profile.permission
          : []
      };

      // 获取用户ID，通常在sub字段中
      const userId = user.profile?.sub;
      // 获取用户角色
      const userRoles = Array.isArray(user.profile?.role)
        ? user.profile.role
        : [];

      if (userId) {
        try {
          // 存储所有权限的集合
          const allPermissions = new Set<string>();

          // 1. 获取用户直接权限
          try {
            const userPermissionResult =
              await permissionApi.getUserPermissions(userId);
            const userPermissions = extractPermissionNames(
              userPermissionResult.groups
            );
            userPermissions.forEach(permission =>
              allPermissions.add(permission)
            );
          } catch (userPermissionError) {
            console.error("获取用户直接权限失败:", userPermissionError);
          }

          // 2. 获取用户组（角色）权限
          if (userRoles.length > 0) {
            // 并行获取所有角色的权限
            const rolePermissionPromises = userRoles.map(
              async (roleName: string) => {
                try {
                  const rolePermissionResult =
                    await permissionApi.getRolePermissions(roleName);
                  return extractPermissionNames(rolePermissionResult.groups);
                } catch (rolePermissionError) {
                  console.error(
                    `获取角色 ${roleName} 权限失败:`,
                    rolePermissionError
                  );
                  return [];
                }
              }
            );

            const rolePermissionsArrays = await Promise.all(
              rolePermissionPromises
            );

            // 合并所有角色权限
            rolePermissionsArrays.forEach(rolePermissions => {
              rolePermissions.forEach(permission =>
                allPermissions.add(permission)
              );
            });
          }

          // 将Set转换为数组并更新用户数据
          userData.permissions = Array.from(allPermissions);
        } catch (permissionError) {
          console.error("获取权限过程中发生错误:", permissionError);
          // 如果获取权限失败，继续使用原有的权限（如果有）
        }
      } else {
        console.warn("无法获取用户ID，跳过权限获取");
      }

      // 设置用户信息和token
      setToken(userData);
    } catch (error) {
      console.error("设置用户信息失败:", error);
    }

    // 重定向到首页
    router.push("/");
  } else {
    // 认证失败，重定向到登录页
    router.push("/login");
  }
});
</script>
