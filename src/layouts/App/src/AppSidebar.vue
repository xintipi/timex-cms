<template>
  <a-layout-sider width="232" collapsed-width="66" :collapsed="isCollapse" class="aside-wrapper">
    <aside :class="['aside', isCollapse && 'is-collapse']">
      <div class="aside__top">
        <div class="aside__top--toggle">
          <div @click="toggleSideBar">
            <sidebar-close />
          </div>
        </div>
      </div>

      <ul class="aside__menu">
        <li v-for="navItem in navList" :key="navItem.name" class="aside__list">
          <router-link
            v-if="!navItem.children"
            :to="{ name: navItem.name }"
            :class="['aside__link', navItem.name === 'dashboard' && 'is-dashboard']"
          >
            <component :is="navItem.icon" class="aside__link--nav-icon" />
            <span class="aside__link--text fs-12">{{ navItem.label }}</span>
          </router-link>

          <div v-else class="aside__collapse">
            <a-collapse v-model:activeKey="activeKey" :bordered="false">
              <a-collapse-panel :key="navItem.name" :show-arrow="false" :force-render="true">
                <template #extra>
                  <ul>
                    <li class="aside__list" @click="headerCollapseClick">
                      <router-link
                        v-slot="{ isActive, isExactActive }"
                        :to="{ name: navItem.name }"
                        custom
                      >
                        <div
                          :class="[
                            'aside__collapse--header aside__link',
                            isActive && 'is-active',
                            isExactActive && 'router-link-exact-active',
                            navItem.name === 'dashboard' && 'is-dashboard',
                            activeKey.includes(navItem.name) && 'is-sub-nav-open',
                          ]"
                          @click="null"
                        >
                          <component :is="navItem.icon" class="aside__link--nav-icon" />
                          <span class="aside__link--text fs-12">{{ navItem.label }}</span>
                          <sidebar-arrow-down class="aside__link--arrow-icon" />
                        </div>
                      </router-link>
                    </li>
                  </ul>
                </template>
                <ul v-if="isShowChildrenNav" class="aside__sub-nav">
                  <li
                    v-for="subNavItem in navItem.children"
                    :key="subNavItem.name"
                    class="aside__list"
                  >
                    <router-link
                      :to="{
                        name: subNavItem.name,
                        query: subNavItem?.query ? subNavItem.query : {},
                      }"
                      class="aside__link"
                    >
                      <i class="aside__link--circle-icon"></i>
                      <span class="aside__text fs-12">{{ subNavItem.label }}</span>
                    </router-link>
                  </li>
                </ul>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </li>
      </ul>
    </aside>
  </a-layout-sider>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { useNavigation } from '@/hooks/useNavigation';
  import {
    SidebarArrowDown,
    SidebarAttendance,
    SidebarClose,
    SidebarDashboard,
    SidebarSetting,
  } from '@/components/Icons';

  export default defineComponent({
    name: 'AppSidebar',

    components: {
      SidebarArrowDown,
      SidebarClose,
      SidebarDashboard,
      SidebarAttendance,
      SidebarSetting,
    },

    setup(_, { emit }) {
      const { navList } = useNavigation();

      // collapse sidebar
      const isCollapse = ref(false);

      // collapse active sub menu
      const activeKey = ref<(string | number)[]>(['attendance', 'setting']);
      const preActiveKeys = ref<(string | number)[]>([]);
      const isShowChildrenNav = ref<boolean>(true);

      const toggleSideBar = () => {
        isCollapse.value = !isCollapse.value;
        emit('on-collapse-side-bar', isCollapse.value);
      };

      const headerCollapseClick = (event) => {
        isCollapse.value && event.stopPropagation();
      };

      watch(activeKey, (newVal) => {
        if (!isCollapse.value) preActiveKeys.value = newVal;
      });

      watch(isCollapse, () => {
        activeKey.value = isCollapse.value
          ? navList.value.filter((item) => item.children).map((item) => item.name)
          : preActiveKeys.value;

        // disable transition panel in first time
        isShowChildrenNav.value = false;

        setTimeout(() => {
          isShowChildrenNav.value = true;
        }, 200);
      });

      return {
        isCollapse,
        navList,
        activeKey,
        isShowChildrenNav,
        toggleSideBar,
        headerCollapseClick,
      };
    },
  });
</script>

<style lang="scss">
  @import '@/styles/shared/variables';

  $width-sidebar: 232px;
  $width-sidebar-collapse: 66px;
  $width-sub-nav-collapse: 150px;

  .aside {
    width: $width-sidebar;
    background-color: $color-primary-10;
    color: $color-grey-100;
    flex-grow: 0;
    transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    height: 100vh;
    overflow: hidden;

    &:hover {
      overflow: auto;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &__top {
      height: 80px;
    }

    &__link,
    &__top--toggle {
      display: block;
      padding: 8px 0 8px 24px;
      position: relative;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        color: $color-primary-3;
      }
    }

    &__link {
      &--arrow-icon {
        position: absolute;
        top: 50%;
        right: 0;
        margin-right: 24px;
        margin-top: -7px;
      }

      &--nav-icon {
        margin-right: 8px;
        margin-bottom: -2px;
      }

      &--circle-icon {
        display: inline-block;
        margin-right: 12px;

        &:before {
          content: '';
          display: block;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          background-color: $color-grey-100;
        }
      }

      &:hover {
        .aside__link--circle-icon:before {
          background-color: $color-primary-3;
        }
      }
    }

    &__list > :not(.is-dashboard),
    &__top--toggle {
      .aside__link--nav-icon {
        background-color: $color-primary-10;
      }
    }

    .is-active.aside__link:not(.is-dashboard, .aside__collapse--header),
    .is-active:not(.is-dashboard, .aside__collapse--header) .aside__link--nav-icon,
    .is-active:not(.is-dashboard, .aside__collapse--header) .aside__link--text,
    .router-link-exact-active,
    .router-link-exact-active > .aside__link--text {
      background-color: $color-primary-9;
      color: $color-primary-3;
      font-weight: 700;
    }

    .is-active.aside__link.aside__collapse--header {
      color: $color-primary-3;
      font-weight: 700;
    }

    &__link--circle-icon {
      display: inline-block;
      margin-right: 12px;

      &:before {
        content: '';
        display: block;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        background-color: $color-grey-100;
      }

      &:hover:before {
        background-color: $color-primary-3;
      }
    }

    &__sub-nav &__link {
      padding-left: 50px;
      color: $color-grey-100;

      &:hover {
        color: $color-primary-3;
      }
    }

    &__link--arrow-icon {
      transform: rotate(90deg);
      transition: transform 0.5s ease;
    }

    .is-sub-nav-open &__link--arrow-icon {
      transform: none;
    }

    &__top--toggle {
      svg {
        transition: transform 0.3s ease;
      }
    }
  }

  .aside__collapse {
    .ant-collapse-header {
      padding: 0;
      height: 38px;
      width: 100%;
      background-color: $color-primary-10;
    }

    .ant-collapse-extra {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      .aside__link {
        color: $color-grey-100;

        &:hover {
          color: $color-primary-3;
        }
      }
    }

    .ant-collapse,
    .ant-collapse > .ant-collapse-item {
      border: 0;
    }

    .ant-collapse-content > .ant-collapse-content-box {
      padding: 0;
    }

    .ant-collapse,
    .ant-collapse-content-box {
      background-color: $color-primary-10;
    }

    .ant-collapse-content {
      border: 0;
    }
  }

  .aside.is-collapse {
    width: $width-sidebar-collapse;
    position: relative;
    overflow: visible;

    .aside__link--text,
    .aside__link--arrow-icon,
    .aside__sub-nav {
      display: none;
    }

    .aside__list {
      position: relative;

      &:hover {
        .aside__link--text,
        .aside__sub-nav {
          display: block !important;
        }
      }
    }

    .aside__link--text,
    .aside__sub-nav {
      position: absolute;
      left: $width-sidebar-collapse;
      width: $width-sub-nav-collapse;
      border-left: 1px solid #fff;
    }

    .aside__link--text {
      top: 0;
      padding: 8px 0 8px 12px;
    }

    .aside__link:not(.router-link-exact-active) .aside__link--text {
      background-color: $color-primary-10;
    }

    .aside__sub-nav {
      top: 37px;
      background-color: $color-primary-10;
    }

    .aside__sub-nav .aside__link {
      padding-left: 12px;
    }

    .aside__top--toggle {
      svg {
        transform: scaleX(-1);
      }
    }
  }

  .aside-wrapper,
  .aside-wrapper.ant-layout-sider-collapsed {
    transition: all 0.3s ease-in-out;
  }
</style>
