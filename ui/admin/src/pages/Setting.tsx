import { useModel } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Form, Input, Button,message } from 'antd';
import { useCallback,useMemo,useState } from 'react';
import { updateUser,updateSetting } from '@/services/ant-design-pro/api';

const Setting = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const user = initialState?.user;
  const setting = initialState?.setting;
  const [loading,setLoading] = useState(false);
  const [userForm] = Form.useForm();
  const [settingForm] = Form.useForm();
  const onFinishUpdateUser = useCallback(async (values) => {
    setLoading(true)
    if (!user?.id) {
      message.error("未登录,无法更新~！")
      return
    }
    const r = await updateUser({...values,id: user?.id});
    if (r) {
      message.success(r);
    }
    setLoading(false)

  }, [user,setLoading]);

  const onFinishUpdateSetting = useCallback(async (values) => {
    setLoading(true)
    const r = await updateSetting(values);
    if (r) {
      message.success(r);
    }
    setLoading(false)

  }, [setting,setLoading]);

  const initUserVal = useMemo(()=>{
    if (!user) {
      return undefined;
    }
    return {
      name: user?.name
    };
  },[user]);

  const initSettingVal = useMemo(()=>{
    if (!setting) {
      return undefined;
    }
    return {
      favicon: setting?.favicon,
      title: setting?.title,
    };
  },[setting]);



  return (
    <PageHeaderWrapper title={`你好，${user?.name}`}>
      <ProCard title={'修改用户信息'} loading={loading} headerBordered>
        <Form onFinish={onFinishUpdateUser} form={userForm}
        initialValues={initUserVal}

        >
          <Form.Item label="用户名" name="name" required>
            <Input placeholder="请输入新用户名"></Input>
          </Form.Item>
          <Form.Item label="密码" name="password" required>
            <Input.Password placeholder="请输入新密码"></Input.Password>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </ProCard>
      <ProCard title={'修改网站配置'} style={{marginTop: 8}} loading={loading} headerBordered>
        <Form onFinish={onFinishUpdateSetting} form={settingForm}
        initialValues={initSettingVal}
        >
          <Form.Item label="网站 logo" name="favicon" required>
            <Input placeholder="请输入网站 logo"></Input>
          </Form.Item>
          <Form.Item label="网站标题" name="title" required>
            <Input placeholder="请输入网站标题"></Input>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </ProCard>
    </PageHeaderWrapper>
  );
};

export default Setting;
