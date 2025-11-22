<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">主应用仪表盘</h1>
    <p class="dashboard-description">欢迎使用主应用仪表盘页面</p>
    
    <!-- 添加样式测试组件 -->
    <TestComponent />
  </div>
</template>

<script setup lang="ts">
import TestComponent from '@/components/TestComponent.vue';
// 主应用仪表盘页面
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-title {
  color: #409eff;
  font-size: 24px;
  margin-bottom: 10px;
}

.dashboard-description {
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
}
</style>