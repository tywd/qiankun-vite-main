<template>
  <div class="main-app-test-container">
    <h1 class="main-app-test-title">主应用 CSS 测试组件</h1>
    <p class="main-app-test-description">这是一个用于测试主应用样式隔离是否正常的组件</p>
  </div>
</template>

<script setup lang="ts">
// 这是一个测试组件，用于验证主应用样式隔离是否正常工作
</script>

<style scoped>
.main-app-test-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.main-app-test-title {
  color: #409eff;
  font-size: 24px;
  margin-bottom: 10px;
}

.main-app-test-description {
  color: #666;
  font-size: 16px;
}
</style>