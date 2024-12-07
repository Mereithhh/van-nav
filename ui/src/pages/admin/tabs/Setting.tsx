import { Button, Card, Form, Input, message, Select, Spin, Switch } from "antd";
import { useCallback, useEffect } from "react";
import { fetchUpdateSetting, fetchUpdateUser } from "../../../utils/api";
import { useData } from "../hooks/useData";
export interface SettingProps { }
export const Setting: React.FC<SettingProps> = (props) => {
  const { store, loading, reload } = useData();
  const [userForm] = Form.useForm();
  const [settingForm] = Form.useForm();
  useEffect(() => {
    userForm.setFieldsValue(store?.user ?? {})
    settingForm.setFieldsValue(store?.setting ?? {})
  }, [store])
  const handleUpdateUser = useCallback(
    async (values: any) => {
      try {
        await fetchUpdateUser({ ...values, id: store?.user?.id });
        message.success("修改成功!");
      } catch (err) {
        message.warning("修改失败!");
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
        message.success("修改成功!");
      } catch (err) {
        message.warning("修改失败!");
      } finally {
        reload();
      }
    },
    [reload]
  );
  return (
    <div className="overflow-auto">
      <Card title={`修改用户信息`} style={{ marginBottom: 32 }}>
        <Spin spinning={loading}>
          <Form onFinish={handleUpdateUser} initialValues={store?.user ?? {}} form={userForm}>
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
              <Input.Password placeholder="请输入新密码" ></Input.Password>
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
            labelCol={{ span: 6 }}
            form={settingForm}
          >
            <Form.Item
              label="网站 logo"
              name="favicon"
              tooltip="输入 logo 的 url，仅支持 png 或 svg 格式"
              required
              rules={[{ required: true, message: "请输入网站 logo 链接" }]}

            >
              <Input placeholder="请输入网站 logo"></Input>
            </Form.Item>
            <Form.Item
              label="网站标题"
              name="title"
              required
              rules={[{ required: true, message: "请输入网站 title" }]}


            >
              <Input placeholder="请输入网站标题"></Input>
            </Form.Item>
            <Form.Item
              label="公信部备案"
              name="govRecord"
            >
              <Input placeholder="请输入网站备案信息"></Input>
            </Form.Item>


            <Form.Item label="默认跳转方式" name="jumpTargetBlank" rules={[{ required: true, message: "这是必填项" }]}
              tooltip="选择点击卡片后默认的跳转方式"
            >
              <Select options={[
                {
                  label: "原地跳转",
                  value: false,
                },
                {
                  label: "新标签页",
                  value: true,
                },
              ]}>

              </Select>

            </Form.Item>
            <Form.Item
              label="logo 192x192"
              name="logo192"
              rules={[{ required: true, message: "请输入 192x192 大小的 logo 链接" }]}

              tooltip="192x192 大小的 logo，用于实现可安装的 web 应用"

            >
              <Input placeholder="192x192 大小的 logo 链接"></Input>
            </Form.Item>
            <Form.Item
              label="logo 512x512"
              name="logo512"
              rules={[{ required: true, message: "请输入 512x512 大小的 logo 链接" }]}

              tooltip="512x512 大小的 logo，用于实现可安装的 web 应用"

            >
              <Input placeholder="512x512 大小的 logo 链接"></Input>
            </Form.Item>
            <Form.Item label="隐藏管理员后台卡片" name="hideAdmin" tooltip="默认展示，开启后将在前台隐藏管理员卡片" >
              <Switch defaultChecked={Boolean(store?.setting?.hideAdmin)} />
            </Form.Item>
            <Form.Item label="隐藏 Github 按钮" name="hideGithub" tooltip="默认展示，开启后将在前台 Github 按钮" >
              <Switch defaultChecked={Boolean(store?.setting?.hideGithub)} />
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
