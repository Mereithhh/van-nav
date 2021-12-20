import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  "splitMenus": false,
  title: 'Van Nav',
  pwa: false,
  logo: 'https://pic.mereith.com/img/male.svg',
  iconfontUrl: '',
};

export default Settings;
