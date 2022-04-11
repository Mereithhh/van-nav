import { Button, Card, Form, Input, message, Spin } from "antd";
import { useCallback, useContext } from "react";
import { GlobalContext } from "../../components/GlobalContext";
import { fetchUpdateSetting, fetchUpdateUser } from "../../utils/api";
import "./index.css";
export interface SettingProps {}
export const Setting: React.FC<SettingProps> = (props) => {
  const { store, reload, loading } = useContext(GlobalContext);
  const handleUpdateUser = useCallback(
    async (values: any) => {
      try {
        await fetchUpdateUser({ ...values, id: store?.user?.id });
        message.success({ message: "修改成功!" });
      } catch (err) {
        message.warning({ message: "修改失败!" });
      } finally {
        reload();
      }
    },
    [reload, store]
  );
  const handleUpdateWebSite = useCallback(
    async (values: any) => {
      try {
        await fetchUpdateSetting(values);
        message.success({ message: "修改成功!" });
      } catch (err) {
        message.warning({ message: "修改失败!" });
      } finally {
        reload();
      }
    },
    [reload]
  );
  return (
    <div>
      <Card title={`修改用户信息`} style={{ marginBottom: 32 }}>
        <Spin spinning={loading}>
          <Form onFinish={handleUpdateUser} initialValues={store?.user ?? {}}>
            <Form.Item
              label="用户名"
              name="name"
              required
              labelCol={{ span: 4 }}
            >
              <Input placeholder="请输入新用户名"></Input>
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              required
              labelCol={{ span: 4 }}
            >
              <Input.Password placeholder="请输入新密码"></Input.Password>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
      <Card title={`修改网站信息`}>
        <Spin spinning={loading}>
          <Form
            onFinish={handleUpdateWebSite}
            initialValues={store?.setting ?? {}}
          >
            <Form.Item
              label="网站 logo"
              name="favicon"
              required
              labelCol={{ span: 4 }}
            >
              <Input placeholder="请输入网站 logo"></Input>
            </Form.Item>
            <Form.Item
              label="网站标题"
              name="title"
              required
              labelCol={{ span: 4 }}
            >
              <Input placeholder="请输入网站标题"></Input>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};
