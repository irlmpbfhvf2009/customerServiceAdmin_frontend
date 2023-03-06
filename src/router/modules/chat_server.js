import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/chat_server',
    component: Layout,
    redirect: '/customerService',
    meta: { title: 'chat_server', icon: 'el-icon-chat-dot-round' },
    children: [
        {
          path: 'customerService',
          component: createNameComponent(() => import('@/views/main/chat_server/index.vue')),
          meta: { title: '客戶訊息', icon: 'el-icon-chat-dot-round', hideClose: true }
        }
      ]
  }
]

export default route