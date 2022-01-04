import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { queryAllData } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { RequestConfig } from './.umi/plugin-request/request';
import {message} from "antd"

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  user?: any;
  catelogs?: any;
  tools?: any;
  setting?: any;
  fetchData?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchData = async () => {
    try {
      const data = await queryAllData();
      return data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 不管登录不登录，都获取一下。获取到了就妙了。

    const data = await fetchData();
    return {
      fetchData,
      ...data,
    };

}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.user?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.user && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [
        // <Link to="/" target="_blank">
        //     <LinkOutlined />
        //     <span>主站</span>
        //   </Link>
      ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    //   if (initialState.loading) return <PageLoading />;
    //   return children;
    // },
  };
};

const authHeaderInterceptors = (url: string, options: any) => {
  const authHeader = { Authorization: getToken() };
  return {
    url,options: {...options,interceptors: true,headers: authHeader}
  }
};
export const request: RequestConfig = {
  errorHandler: (err) => {
    console.log(err);
    message.warn("未登录")
    // message.error(err?.message)
  },
  requestInterceptors: [authHeaderInterceptors],
};


const getToken = () => {
  const token = localStorage.getItem('_token');
  if (token) {
    return token;

  }
  return "";
}
