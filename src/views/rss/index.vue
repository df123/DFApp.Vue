<template>
  <div class="rss-fetch-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">RSS Feed 获取</span>
        </div>
      </template>

      <!-- 快速操作区域 -->
      <div class="quick-actions">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-button
              type="primary"
              :loading="fetchLoading"
              style="width: 100%"
              @click="fetchRssFeed"
            >
              获取RSS内容
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              type="success"
              :loading="testLoading"
              style="width: 100%"
              @click="testRssConnection"
            >
              测试RSS连接
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-input
              v-model="defaultUrl"
              placeholder="请输入RSS Feed URL"
              clearable
              @clear="clearUrl"
            >
              <template #prepend>默认URL</template>
              <template #append>
                <el-button @click="setDefaultUrl">应用</el-button>
              </template>
            </el-input>
          </el-col>
        </el-row>
      </div>

      <!-- 下载选项 -->
      <div class="download-options" style="margin-bottom: 20px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-checkbox v-model="videoOnly">
              只下载视频文件（仅支持.torrent文件）
            </el-checkbox>
            <el-tooltip
              content="启用后，下载.torrent文件时只选择视频文件（如.mp4, .mkv等）"
              placement="top"
            >
              <el-icon style="margin-left: 8px">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>

      <!-- 自定义查询表单 -->
      <el-divider content-position="left">自定义查询</el-divider>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="custom-form"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="RSS Feed URL" prop="url">
              <el-input
                v-model="formData.url"
                placeholder="请输入RSS Feed URL，例如：https://sukebei.nyaa.si/?page=rss"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最大条目数" prop="maxItems">
              <el-input-number
                v-model="formData.maxItems"
                :min="1"
                :max="1000"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: center">
            <el-button
              type="primary"
              :loading="customLoading"
              style="width: 200px; margin-top: 30px"
              @click="fetchCustomRss"
            >
              开始获取
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 结果展示区域 -->
      <el-divider content-position="left">获取结果</el-divider>
      <div class="result-container">
        <el-table
          v-loading="resultLoading"
          :data="resultList"
          style="width: 100%"
          stripe
        >
          <el-table-column prop="time" label="时间" width="180" />
          <el-table-column prop="type" label="操作类型" width="120" />
          <el-table-column
            prop="url"
            label="URL"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column prop="success" label="是否成功" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.success ? 'success' : 'danger'">
                {{ scope.row.success ? "成功" : "失败" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="message"
            label="消息"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column prop="itemCount" label="条目数" width="100" />
          <el-table-column
            prop="responseTime"
            label="响应时间(ms)"
            width="120"
          />
          <el-table-column prop="statusCode" label="HTTP状态码" width="120" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                link
                @click="showDetail(scope.row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="currentDetail.type + ' - 详情'"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="请求时间">
            {{ currentDetail.time }}
          </el-descriptions-item>
          <el-descriptions-item label="操作类型">
            {{ currentDetail.type }}
          </el-descriptions-item>
          <el-descriptions-item label="URL">
            {{ currentDetail.url }}
          </el-descriptions-item>
          <el-descriptions-item label="是否成功">
            <el-tag :type="currentDetail.success ? 'success' : 'danger'">
              {{ currentDetail.success ? "成功" : "失败" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="消息">
            {{ currentDetail.message }}
          </el-descriptions-item>
          <el-descriptions-item label="条目数">
            {{ currentDetail.itemCount }}
          </el-descriptions-item>
          <el-descriptions-item label="响应时间">
            {{ currentDetail.responseTime }}ms
          </el-descriptions-item>
          <el-descriptions-item label="HTTP状态码">
            {{ currentDetail.statusCode }}
          </el-descriptions-item>
          <el-descriptions-item label="请求URL" :span="2">
            <el-input
              v-model="currentDetail.requestUrl"
              readonly
              type="textarea"
              :rows="2"
            />
          </el-descriptions-item>
        </el-descriptions>

        <div
          v-if="currentDetail.items && currentDetail.items.length > 0"
          class="items-preview"
        >
          <h4>RSS条目列表 (共 {{ currentDetail.itemCount }} 条)</h4>
          <el-table :data="currentDetail.items" stripe style="width: 100%">
            <el-table-column
              prop="title"
              label="标题"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column prop="link" label="链接" width="160">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click="openLink(scope.row.link)"
                >
                  打开
                </el-button>
                <el-button
                  link
                  type="success"
                  @click="downloadToAria2(scope.row.link, videoOnly)"
                >
                  下载
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="publishDate" label="发布日期" width="180" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="category" label="分类" width="120" />
            <el-table-column label="描述" min-width="200" show-overflow-tooltip>
              <template #default="scope">
                <div class="description-cell" v-html="scope.row.description" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { rssFetchApi } from "@/api/rssFetch";
import { aria2Api } from "@/api/aria2";
import type {
  RssFetchRequestDto,
  RssFetchResponseDto,
  RssItemDto
} from "@/api/rssFetch";
import type { AddDownloadRequestDto } from "@/types/business";

// 默认URL
const defaultUrl = ref("https://sukebei.nyaa.si/?page=rss");

// 表单相关
const formRef = ref<FormInstance>();
const formData = reactive<RssFetchRequestDto>({
  url: defaultUrl.value,
  maxItems: 50
});

const formRules: FormRules = {
  url: [
    { required: true, message: "请输入RSS Feed URL", trigger: "blur" },
    { type: "url", message: "请输入有效的URL", trigger: "blur" }
  ]
};

// 加载状态
const fetchLoading = ref(false);
const testLoading = ref(false);
const customLoading = ref(false);
const resultLoading = ref(false);

// 结果数据
const resultList = ref<any[]>([]);

// 详情对话框
const detailDialogVisible = ref(false);
const currentDetail = ref<any>({});

// 视频下载选项
const videoOnly = ref(false);

// 获取RSS Feed
const fetchRssFeed = async () => {
  fetchLoading.value = true;
  try {
    const request: RssFetchRequestDto = {
      url: defaultUrl.value,
      maxItems: 50
    };
    const result = await rssFetchApi.fetchRssFeed(request);
    addResult("获取RSS内容", defaultUrl.value, result);
    ElMessage.success("RSS内容获取完成");
  } catch (error) {
    console.error("获取RSS内容失败:", error);
    ElMessage.error("获取RSS内容失败");
  } finally {
    fetchLoading.value = false;
  }
};

// 测试RSS连接
const testRssConnection = async () => {
  testLoading.value = true;
  try {
    const result = await rssFetchApi.testRssFeedConnection(defaultUrl.value);
    addResult("测试RSS连接", defaultUrl.value, result);
    ElMessage.success("RSS连接测试完成");
  } catch (error) {
    console.error("测试RSS连接失败:", error);
    ElMessage.error("测试RSS连接失败");
  } finally {
    testLoading.value = false;
  }
};

// 自定义获取
const fetchCustomRss = async () => {
  if (!formRef.value) return;

  const valid = await formRef.value.validate();
  if (!valid) return;

  customLoading.value = true;
  try {
    const result = await rssFetchApi.fetchRssFeed(formData);
    addResult("自定义获取", formData.url || "", result);
    ElMessage.success("自定义获取完成");
  } catch (error) {
    console.error("自定义获取失败:", error);
    ElMessage.error("自定义获取失败");
  } finally {
    customLoading.value = false;
  }
};

// 设置默认URL
const setDefaultUrl = () => {
  formData.url = defaultUrl.value;
  ElMessage.success("已应用默认URL到表单");
};

// 清空URL
const clearUrl = () => {
  defaultUrl.value = "";
};

// 添加结果到列表
const addResult = (type: string, url: string, result: RssFetchResponseDto) => {
  const resultItem = {
    time: new Date().toLocaleString(),
    type,
    url,
    success: result.success,
    message: result.message,
    itemCount: result.items.length,
    responseTime: result.responseTime,
    statusCode: result.statusCode,
    requestUrl: result.requestUrl,
    items: result.items,
    rawContent: result.rawContent
  };

  resultList.value.unshift(resultItem);

  // 限制结果列表长度
  if (resultList.value.length > 50) {
    resultList.value = resultList.value.slice(0, 50);
  }
};

// 显示详情
const showDetail = (row: any) => {
  currentDetail.value = { ...row };
  detailDialogVisible.value = true;
};

// 打开链接
const openLink = (url: string) => {
  window.open(url, "_blank");
};

// 添加到aria2下载
const downloadToAria2 = async (url: string, videoOnly: boolean = false) => {
  try {
    const request: AddDownloadRequestDto = {
      urls: [url],
      savePath: undefined, // 可选：可以添加保存路径配置
      videoOnly: videoOnly
    };
    await aria2Api.addDownload(request);
    ElMessage.success("已添加到下载队列");
  } catch (error) {
    console.error("添加到下载队列失败:", error);
    ElMessage.error("添加到下载队列失败");
  }
};

// 生命周期
onMounted(() => {
  // 可以加载历史记录等
});
</script>

<style scoped>
.rss-fetch-container {
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

.quick-actions {
  margin-bottom: 20px;
}

.custom-form {
  margin-bottom: 20px;
}

.result-container {
  margin-top: 20px;
}

.detail-content {
  max-height: 70vh;
  overflow-y: auto;
}

.items-preview {
  margin-top: 20px;
}

.items-preview h4 {
  margin-bottom: 10px;
  color: #303133;
}

.description-cell {
  max-height: 100px;
  overflow-y: auto;
  word-break: break-all;
}
</style>
