export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
      { component: './404' },
    ],
  },
  { path: '/tool', name: '工具管理', icon: 'tool', component: './Tool' },
  { path: '/catelog', name: '分类管理', icon: 'book', component: './Catelog' },
  { path: '/setting', name: '设置', icon: 'crown', component: './Setting' },
  { path: '/', redirect: '/tool' },
  { component: './404' },
];
