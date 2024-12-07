
import { Button, Card, Form, Input, Modal, message, Popconfirm, Space, Spin, Table, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { fetchAddApiToken, fetchDeleteApiToken } from '../../../utils/api';
import { useData } from '../hooks/useData';
export interface ApiTokenProps {

}
export const ApiToken: React.FC<ApiTokenProps> = (props) => {
  const [addForm] = Form.useForm();
  const [showAddModel, setShowAddModel] = useState(false);
  const { store, loading, reload } = useData();
  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await fetchDeleteApiToken(id);
        message.success("删除成功!");
      } catch (err) {
        message.warning("删除失败!");
      } finally {
        reload();
      }
    },
    [reload]
  );
  const handleCreate = useCallback(
    async (record: any) => {
      try {
        await fetchAddApiToken(record);
        message.success("添加成功!");
      } catch (err) {
        message.warning("添加失败!");
      } finally {
        setShowAddModel(false);
        reload();
      }
    },
    [reload, setShowAddModel]
  );
  return (
    <Card
      title={`当前共 ${store?.tokens?.length ?? 0} 条`}
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setShowAddModel(true);
            }}
          >
            添加
          </Button>
          <Button
            type="primary"
            onClick={() => {
              reload();
            }}
          >
            刷新
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        <Table dataSource={store?.tokens || []} rowKey="id" size="small">
          <Table.Column title="序号" dataIndex="id" width={30} />
          <Table.Column
            title="名称"
            dataIndex="name"
            width={150}
            render={(_, record: any) => {
              return (
                <div>
                  <span style={{ marginLeft: 8 }}>{record.name}</span>
                </div>
              );
            }}
          />
          <Table.Column
            title="值"
            dataIndex="value"
            width={200}
            render={(val, record: any) => {
              return (
                <div style={{ maxWidth: "300px" }}>

                  <Typography.Text copyable ellipsis={true}>
                    {val}
                  </Typography.Text>
                </div>
              );
            }}
          />
          <Table.Column
            title="操作"
            width={40}
            dataIndex="action"
            key="action"
            render={(_, record: any) => {
              return (
                <Space>
                  <Popconfirm
                    onConfirm={() => {
                      handleDelete(record.id);
                    }}
                    title={`确定要删除 Token ${record.name} 吗？`}
                  >
                    <Button type="link">删除</Button>
                  </Popconfirm>
                </Space>
              );
            }}
          />
        </Table>
      </Spin>
      <Modal
        visible={showAddModel}
        title={"新建 Token"}
        onCancel={() => {
          setShowAddModel(false);
        }}
        onOk={() => {
          const values = addForm?.getFieldsValue();
          handleCreate(values);
        }}
      >
        <Form form={addForm}>
          <Form.Item name="name" required label="名称" labelCol={{ span: 4 }}>
            <Input placeholder="请输入 API Token 名称" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
