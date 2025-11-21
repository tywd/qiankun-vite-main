<template>
    <div class="basic-layout">
        <!-- 顶部Header -->
        <Header />

        <template v-for="tab in appTabsStore.navTabs" :key="tab.id">
            <!-- 主要内容区域 -->
            <div v-if="tab.id === appTabsStore.activeTabId && tab.app === 'main'" class="main-content-area">
                <!-- 左侧侧边栏 -->
                <Sidebar />

                <!-- 右侧内容区域 -->
                <main class="content-area">
                    <div class="breadcrumb-container">
                        <el-icon class="collapse-icon" @click="toggleSidebar">
                            <Expand v-if="menuStore.collapsed" />
                            <Fold v-else />
                        </el-icon>
                        <Breadcrumb class="breadcrumb" />
                    </div>
                    <TabsView />
                </main>
            </div>
            <!-- 微前端子应用容器 -->
            <div v-else-if="tab.id === appTabsStore.activeTabId && tab.app !== 'main'" id="subapp-container" class="main-content-area subapp-container">
                <router-view />
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
import TabsView from './TabsView.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import { useAppTabsStore } from '@/stores/appTabs.ts';
import { useMenuStore } from '@/stores/menu.ts';
import { Expand, Fold } from '@element-plus/icons-vue';
const appTabsStore = useAppTabsStore();
const menuStore = useMenuStore();
const toggleSidebar = () => {
    menuStore.toggleCollapsed();
};
</script>

<style scoped lang="scss">
.basic-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;
}

.main-content-area {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.content-area {
    flex: 1;
    background-color: #f0f2f5;
    height: 100%;
    overflow: auto;

    .breadcrumb-container {
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 10px 16px;
        border-bottom: 1px solid #f0f0f0;

        .collapse-icon {
            margin-right: 12px;
            cursor: pointer;
            font-size: 18px;
            color: #666;

            &:hover {
                color: #1890ff;
            }
        }

        .breadcrumb {
            flex: 1;
        }
    }
}

.subapp-container {
    width: 100%;
    height: 100%;
    overflow: hidden;

    // 移除样式隔离，让子应用样式正常应用
    :deep(*) {
        // 不要覆盖子应用的样式
    }
}
</style>