<template>
  <div class="lottery-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">彩票购买</span>
          <el-button
            v-if="hasCreatePermission"
            type="primary"
            icon="Plus"
            @click="handleCreate"
          >
            添加
          </el-button>
        </div>
      </template>

      <!-- 数据表格 -->
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          stripe
          @sort-change="handleSortChange"
        >
          <el-table-column
            prop="indexNo"
            label="期号"
            sortable="custom"
            width="120"
          />
          <el-table-column
            prop="lotteryType"
            label="彩票类型"
            sortable="custom"
            width="120"
          />
          <el-table-column prop="redNumbers" label="红球号码" min-width="150">
            <template #default="scope">
              <span class="red-number">{{ scope.row.redNumbers }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="blueNumber" label="蓝球号码" min-width="100">
            <template #default="scope">
              <span class="blue-number">{{ scope.row.blueNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="groupId"
            label="组号"
            sortable="custom"
            min-width="100"
          />
          <el-table-column
            prop="creationTime"
            label="创建时间"
            sortable="custom"
            min-width="180"
          >
            <template #default="scope">
              {{ formatDateTime(scope.row.creationTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template #default="scope">
              <el-button
                v-if="hasEditPermission"
                size="small"
                type="primary"
                link
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-if="hasDeletePermission"
                size="small"
                type="danger"
                link
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 删除确认对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="400px">
      <span>确定要删除这条记录吗？</span>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button
          type="danger"
          :loading="deleteLoading"
          @click="confirmDelete"
        >
          确认删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { lotteryApi } from "@/api/lottery";
import type { PagedRequestDto, PagedResultDto } from "@/types/api";
import type { LotteryGroupDto } from "@/types/business";

// 响应式数据
const loading = ref(false);
const tableData = ref<LotteryGroupDto[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const sortField = ref("indexNo");
const sortOrder = ref("desc");

// 删除相关状态
const deleteDialogVisible = ref(false);
const deleteLoading = ref(false);
const currentDeleteId = ref<number | null>(null);

// 权限控制（这里需要根据项目实际的权限系统进行调整）
const hasCreatePermission = computed(() => true); // 替换为实际的权限检查
const hasEditPermission = computed(() => true); // 替换为实际的权限检查
const hasDeletePermission = computed(() => true); // 替换为实际的权限检查

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true;
  try {
    const params: PagedRequestDto = {
      skipCount: (currentPage.value - 1) * pageSize.value,
      maxResultCount: pageSize.value,
      sorting: `${sortField.value} ${sortOrder.value}`
    };

    const result: PagedResultDto<LotteryGroupDto> =
      await lotteryApi.getLotteryGroups(params);
    tableData.value = result.items || [];
    totalCount.value = result.totalCount || 0;
  } catch (error) {
    console.error("获取彩票数据失败:", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

// 分页处理
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  currentPage.value = 1;
  fetchTableData();
};

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
  fetchTableData();
};

// 排序处理
const handleSortChange = (sort: any) => {
  if (sort.prop) {
    sortField.value = sort.prop;
    sortOrder.value = sort.order === "ascending" ? "asc" : "desc";
    fetchTableData();
  }
};

// 操作处理
const handleCreate = () => {
  // 这里需要实现创建模态框的逻辑
  ElMessage.info("创建功能待实现");
};

const handleEdit = (row: LotteryGroupDto) => {
  // 这里需要实现编辑模态框的逻辑
  ElMessage.info(`编辑记录 ID: ${row.id}`);
};

const handleDelete = (row: LotteryGroupDto) => {
  currentDeleteId.value = row.id!;
  deleteDialogVisible.value = true;
};

const confirmDelete = async () => {
  if (!currentDeleteId.value) return;

  deleteLoading.value = true;
  try {
    await lotteryApi.deleteLottery(currentDeleteId.value);
    ElMessage.success("删除成功");
    deleteDialogVisible.value = false;
    fetchTableData();
  } catch (error) {
    console.error("删除失败:", error);
    ElMessage.error("删除失败");
  } finally {
    deleteLoading.value = false;
    currentDeleteId.value = null;
  }
};

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return "";
  return new Date(dateTime).toLocaleString("zh-CN");
};

// 生命周期
onMounted(() => {
  fetchTableData();
});
</script>

<style scoped>
.lottery-container {
  height: 100%;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.red-number {
  font-weight: bold;
  color: #f56c6c;
}

.blue-number {
  font-weight: bold;
  color: #409eff;
}
</style>
