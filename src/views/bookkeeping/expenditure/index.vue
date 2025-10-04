<template>
  <div class="expenditure-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">支出管理</span>
          <el-button
            v-permission="['DFApp.Bookkeeping.Expenditure.Create']"
            type="primary"
            @click="handleCreate"
          >
            <el-icon><Plus /></el-icon>
            新增支出
          </el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.filter"
            placeholder="请输入关键词"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="searchForm.categoryId"
            placeholder="请选择分类"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.category"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="归属">
          <el-select
            v-model="searchForm.isBelongToSelf"
            placeholder="请选择归属"
            clearable
            style="width: 120px"
          >
            <el-option label="个人" :value="true" />
            <el-option label="家庭" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <pure-table
        ref="tableRef"
        :loading="loading"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        @page-size-change="handleSizeChange"
        @page-current-change="handleCurrentChange"
      >
        <template #operation="{ row }">
          <el-button
            v-permission="['DFApp.Bookkeeping.Expenditure.Edit']"
            size="small"
            type="primary"
            link
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="['DFApp.Bookkeeping.Expenditure.Delete']"
            size="small"
            type="danger"
            link
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </pure-table>

      <!-- 统计信息 -->
      <div class="statistics">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="本页合计">
            <span class="amount">￥{{ pageTotal.toFixed(2) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="总计">
            <span class="amount">￥{{ total.toFixed(2) }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="支出日期" prop="expenditureDate">
          <el-date-picker
            v-model="formData.expenditureDate"
            type="date"
            placeholder="请选择支出日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="支出金额" prop="expenditure">
          <el-input-number
            v-model="formData.expenditure"
            placeholder="请输入支出金额"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select
            v-model="formData.categoryId"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.category"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="归属" prop="isBelongToSelf">
          <el-radio-group v-model="formData.isBelongToSelf">
            <el-radio :label="true">个人</el-radio>
            <el-radio :label="false">家庭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注信息"
            type="textarea"
            :rows="2"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules
} from "element-plus";
import { Plus, Search, Refresh } from "@element-plus/icons-vue";
import {
  useBookkeepingExpenditureApi,
  useBookkeepingCategoryApi
} from "@/api/bookkeeping";
import type {
  BookkeepingExpenditureDto,
  CreateUpdateBookkeepingExpenditureDto,
  BookkeepingCategoryDto
} from "@/types/api";

// API 服务
const expenditureApi = useBookkeepingExpenditureApi();
const categoryApi = useBookkeepingCategoryApi();

// 响应式数据
const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const tableRef = ref();
const formRef = ref<FormInstance>();

// 搜索表单
const searchForm = reactive({
  filter: "",
  categoryId: undefined as number | undefined,
  isBelongToSelf: undefined as boolean | undefined
});

// 分页数据
const pagination = reactive({
  pageSize: 10,
  currentPage: 1,
  total: 0
});

// 表格数据
const tableData = ref<BookkeepingExpenditureDto[]>([]);

// 分类数据
const categories = ref<BookkeepingCategoryDto[]>([]);

// 统计信息
const pageTotal = ref(0);
const total = ref(0);

// 表单数据
const formData = reactive<CreateUpdateBookkeepingExpenditureDto>({
  expenditureDate: "",
  expenditure: 0,
  remark: "",
  isBelongToSelf: true,
  categoryId: 0
});

// 当前编辑的ID
const currentEditId = ref<number | null>(null);

// 计算属性
const dialogTitle = computed(() =>
  currentEditId.value ? "编辑支出" : "新增支出"
);

// 表单验证规则
const formRules: FormRules = {
  expenditureDate: [
    { required: true, message: "请选择支出日期", trigger: "change" }
  ],
  expenditure: [
    { required: true, message: "请输入支出金额", trigger: "blur" },
    { type: "number", min: 0.01, message: "支出金额必须大于0", trigger: "blur" }
  ],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }],
  isBelongToSelf: [{ required: true, message: "请选择归属", trigger: "change" }]
};

// 表格列配置
const columns = ref([
  {
    label: "支出日期",
    prop: "expenditureDate",
    width: 120,
    formatter: (row: BookkeepingExpenditureDto) => {
      return row.expenditureDate
        ? new Date(row.expenditureDate).toLocaleDateString()
        : "-";
    }
  },
  {
    label: "支出金额",
    prop: "expenditure",
    width: 120,
    formatter: (row: BookkeepingExpenditureDto) => {
      return `￥${row.expenditure.toFixed(2)}`;
    }
  },
  {
    label: "归属",
    prop: "isBelongToSelf",
    width: 80,
    formatter: (row: BookkeepingExpenditureDto) => {
      return row.isBelongToSelf ? "个人" : "家庭";
    }
  },
  {
    label: "分类",
    prop: "category.category",
    minWidth: 120
  },
  {
    label: "备注",
    prop: "remark",
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    label: "创建时间",
    prop: "creationTime",
    width: 180,
    formatter: (row: BookkeepingExpenditureDto) => {
      return row.creationTime
        ? new Date(row.creationTime).toLocaleString()
        : "-";
    }
  },
  {
    label: "操作",
    slot: "operation",
    fixed: "right",
    width: 120
  }
]);

// 方法
const loadCategories = async () => {
  try {
    const result = await categoryApi.getCategories({ maxResultCount: 1000 });
    categories.value = result.items;
  } catch (error) {
    console.error("加载分类数据失败:", error);
    ElMessage.error("加载分类数据失败");
  }
};

const loadTableData = async () => {
  loading.value = true;
  try {
    const params = {
      skipCount: (pagination.currentPage - 1) * pagination.pageSize,
      maxResultCount: pagination.pageSize,
      filter: searchForm.filter || undefined,
      categoryId: searchForm.categoryId,
      isBelongToSelf: searchForm.isBelongToSelf
    };

    const result = await expenditureApi.getExpenditures(params);
    tableData.value = result.items;
    pagination.total = result.totalCount;

    // 计算统计信息
    calculateStatistics();
  } catch (error) {
    console.error("加载支出数据失败:", error);
    ElMessage.error("加载支出数据失败");
  } finally {
    loading.value = false;
  }
};

const calculateStatistics = () => {
  pageTotal.value = tableData.value.reduce(
    (sum, item) => sum + item.expenditure,
    0
  );
  // 注意：这里只计算了当前页的总和，实际项目中可能需要从API获取总和的准确值
  total.value = pageTotal.value; // 这里简化处理，实际应该从API获取
};

const handleSearch = () => {
  pagination.currentPage = 1;
  loadTableData();
};

const handleReset = () => {
  searchForm.filter = "";
  searchForm.categoryId = undefined;
  searchForm.isBelongToSelf = undefined;
  pagination.currentPage = 1;
  loadTableData();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.currentPage = 1;
  loadTableData();
};

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page;
  loadTableData();
};

const handleCreate = () => {
  currentEditId.value = null;
  Object.assign(formData, {
    expenditureDate: new Date().toISOString().split("T")[0],
    expenditure: 0,
    remark: "",
    isBelongToSelf: true,
    categoryId: categories.value[0]?.id || 0
  });
  dialogVisible.value = true;
};

const handleEdit = (row: BookkeepingExpenditureDto) => {
  currentEditId.value = row.id;
  Object.assign(formData, {
    expenditureDate: row.expenditureDate,
    expenditure: row.expenditure,
    remark: row.remark || "",
    isBelongToSelf: row.isBelongToSelf,
    categoryId: row.categoryId
  });
  dialogVisible.value = true;
};

const handleDelete = async (row: BookkeepingExpenditureDto) => {
  try {
    await ElMessageBox.confirm(`确定要删除支出记录吗？`, "删除确认", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    await expenditureApi.deleteExpenditure(row.id);
    ElMessage.success("删除成功");
    loadTableData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除支出记录失败:", error);
      ElMessage.error("删除支出记录失败");
    }
  }
};

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.clearValidate();
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  const valid = await formRef.value.validate();
  if (!valid) return;

  submitting.value = true;
  try {
    if (currentEditId.value) {
      await expenditureApi.updateExpenditure(currentEditId.value, formData);
      ElMessage.success("更新成功");
    } else {
      await expenditureApi.createExpenditure(formData);
      ElMessage.success("创建成功");
    }

    dialogVisible.value = false;
    loadTableData();
  } catch (error) {
    console.error("保存支出记录失败:", error);
    ElMessage.error("保存支出记录失败");
  } finally {
    submitting.value = false;
  }
};

// 生命周期
onMounted(() => {
  loadCategories();
  loadTableData();
});
</script>

<style scoped>
.expenditure-container {
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
}

.statistics {
  padding: 16px;
  margin-top: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.amount {
  font-weight: bold;
  color: #e6a23c;
}
</style>
