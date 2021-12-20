import { useModel } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Form, Input, Button,message } from 'antd';
import { useCallback,useMemo } from 'react';
import { updateUser } from '@/services/ant-design-pro/api';

const Setting = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const user = initialState?.user;
  const [form] = Form.useForm();
  const onFinish = useCallback(async (values) => {
    if (!user?.id) {
      message.error("登录失败~！")
    }
    const r = await updateUser({...values,id: user?.id});
    if (r) {
      message.success(r);
    }
  }, [user]);

  const initVal = useMemo(()=>{
    if (!user) {
      return undefined;
    }
    return {
      name: user?.name
    };
  },[user]);
  return (
    <PageHeaderWrapper title={`你好，${user?.name}`}>
      <ProCard title={'更新用户'}>
        <Form onFinish={onFinish} form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
        initialValues={initVal}
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
    </PageHeaderWrapper>
  );
};

export default Setting;
