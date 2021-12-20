import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {  message } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import styles from './index.less';


const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  useEffect(() => {
    // 已登录不要看这个页面了
    if (initialState?.user?.name) {
      history.push("/")
    }
  },[initialState])
  const fetchAllData = useCallback(async () => {
    const allData = await initialState?.fetchData?.();

    if (allData) {
      await setInitialState((s) => ({ ...s, ...allData }));
      return true;
    }
    return false

  },[setInitialState,initialState])

  const doLogin = useCallback( async (data: any) => {
    const res = await login(data);
    if (res && res.token && res.user) {
      window.localStorage.setItem("_token",res.token);
      await setInitialState((s) => ({ ...s, user: res.user }));
      const r = await fetchAllData()
      if (r) {
        return true;
        // message.success("登录成功！")
      }
      return false;
    }
  },[setInitialState,fetchAllData]);

  const handleSubmit = async (values: any) => {
    try {
      // 登录
      const r =  await doLogin(values)
      if (r) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || '/');
        return;
      }

    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          title="Van Nav Admin"
          subTitle={'Van Nav 的管理面板'}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
            <>
              <ProFormText
                name="name"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'默认用户名: admin'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'默认密码: admin'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>



        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
