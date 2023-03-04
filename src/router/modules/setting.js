import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/admins-setting',
    meta: { title: '系統設定', icon: 'el-icon-setting' },
    alwayShow: true,
    children: [
      {
        path: 'admins-setting',
        component: createNameComponent(() => import('@/views/main/setting/index.vue')),
        meta: { title: '用戶管理', cache: true, roles: ['admin'] }
      }
    ]
  }
]

export default route