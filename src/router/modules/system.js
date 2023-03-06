import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/system',
    component: Layout,
    redirect: '/404',
    hideMenu: true,
    meta: { title: '系统目录' },
    children: [
      {
        path: '/404',
        component: createNameComponent(() => import('@/views/system/404.vue')),
        meta: { title: '404', hideTabs: true }
      },
      {
        path: '/401',
        component: createNameComponent(() => import('@/views/system/401.vue')),
        meta: { title: '401', hideTabs: true }
      },
      {
        path: '/redirect/:path(.*)',
        component: createNameComponent(() => import('@/views/system/redirect.vue')),
        meta: { title: 'redirect', hideTabs: true }
      }
    ]
  },
  {
    path: '/login',
    component: createNameComponent(() => import('@/views/system/login.vue')),
    hideMenu: true,
    meta: { title: '登入', hideTabs: true }
  },
  {
    path: '/chat',
    component: createNameComponent(() => import('@/views/main/chat_client/index.vue')),
    hideMenu: true,
    meta: { title: '測試', hideTabs: true }
  },
  {
    // 找不到路由重定向到404页面
    path: "/:pathMatch(.*)",
    component: Layout,
    redirect: "/404",
    hideMenu: true
  },
]

export default route