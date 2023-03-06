import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/chart',
    meta: { title: '權限管理', icon: 'el-icon-pie-chart' },
    alwayShow: true,
    children: [
      {
        path: 'chart',
        component: createNameComponent(() => import('@/views/main/setting/index.vue')),
        meta: { title: '用戶管理', cache: true, roles: ['admin'] }
      }
    ]
  }
]

export default route