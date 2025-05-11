export const routes = [
      {
        path: '/permission',
        component: () => import('@/views/home/index.vue'),
        name: 'permission',
        meta: {
          hidden: false,
          title: 'Permission Administration',
          icon: 'Lock'
        },
        redirect: '/user',
        children: [
          {
            path: '/user',
            component: () => import('@/views/user-administration/index.vue'),
            name: 'user',
            meta: {
              hidden: false,
              title: 'User Administration',
              icon: 'UserFilled'
            }
          },
          {
            path: '/role',
            component: () => import('@/views/role-administration/index.vue'),
            name: 'role',
            meta: {
              hidden: false,
              title: 'Role Administration',
              icon: 'Briefcase'
            }
          },
          {
            path: '/menu',
            component: () => import('@/views/menu-administration/index.vue'),
            name: 'menu',
            meta: {
              hidden: false,
              title: 'Menu Administration',
              icon: 'Menu'
            }
          }
        ]
      },
      {
        path: '/goods',
        component: () => import('@/views/home/index.vue'),
        name: 'goods',
        meta: {
          hidden: false,
          title: 'Goods Administration',
          icon: 'GoodsFilled'
        },
        redirect: '/brand',
        children: [
          {
            path: '/brand',
            component: () => import('@/views/brand-administration/index.vue'),
            name: 'brand',
            meta: {
              hidden: false,
              title: 'Brand Administration',
              icon: 'ShoppingCart'
            }
          },
          {
            path: '/properties',
            component: () => import('@/views/properties-administration/index.vue'),
            name: 'properties',
            meta: {
              hidden: false,
              title: 'Properties Administration',
              icon: 'ChromeFilled'
            }
          },
          {
            path: '/SPU',
            component: () => import('@/views/SPU-administration/index.vue'),
            name: 'spu',
            meta: {
              hidden: false,
              title: 'SPU Administration',
              icon: 'Menu'
            }
          },
          {
            path: '/SKU',
            component: () => import('@/views/SKU-administration/index.vue'),
            name: 'sku',
            meta: {
              hidden: false,
              title: 'SKU Administration',
              icon: 'Menu'
            }
          }
        ]
      }
]

export const constantRoutes = [
  {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      name: 'login',
      meta: {
        title: 'Login',
        hidden: true
      }
    },
    {
      path: '/',
      component: () => import('@/views/home/index.vue'),
      name: 'home',
      meta: {
        hidden: false
      },
      redirect: '/top',
      children: [
        {
          path:'/top',
          component: () => import('@/views/top-page/index.vue'),
          name: 'top',
          meta: {
            hidden: false,
            title: 'Top Page',
            icon: 'HomeFilled'
          }
        }
      ]
    },
    {
      path: '/data',
      component: () => import('@/views/data-analysis/index.vue'),
      name: 'data',
      meta: {
        hidden: false,
        title: 'Data Analysis',
        icon: 'DataBoard'
      }
    },
    {
      path: '/404',
      component: () => import('@/views/404/index.vue'),
      name: '404',
      meta: {
        hidden: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      name: 'any',
      meta: {
        hidden: true
      }
    },
]