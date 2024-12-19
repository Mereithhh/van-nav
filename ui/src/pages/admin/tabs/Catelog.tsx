import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tooltip,
  Switch,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import {
  fetchAddCateLog,
  fetchDeleteCatelog,
  fetchUpdateCateLog,
} from "../../../utils/api";
import { useData } from "../hooks/useData";
export interface CatelogProps {}
export const Catelog: React.FC<CatelogProps> = (props) => {
  const { store, loading, reload } = useData();
  const [requestLoading, setRequestLoading] = useState(false);
  const [addForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [showAddModel, setShowAddModel] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await fetchDeleteCatelog(id);
        message.success("删除成分类功!");
      } catch (err) {
        message.warning("删除分类失败!");
      } finally {
        reload();
      }
    },
    [reload]
  );
  const handleCreate = useCallback(
    async (record: any) => {
      try {
        await fetchAddCateLog(record);
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

  const handleUpdate = useCallback(
    async (record: any) => {
      setRequestLoading(true);
      try {
        await fetchUpdateCateLog(record);
        message.success("更新成功! ");
        setTimeout(() => {
          reload();
        }, 3000);
      } catch (err) {
        message.warning("更新失败!");
      } finally {
        setRequestLoading(false);
        setShowEdit(false);
        reload();
      }
    },
    [reload, setShowEdit, setRequestLoading]
  );
  return (
    <Card
      title={`当前共 ${store?.catelogs?.length ?? 0} 条`}
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
        <Table dataSource={store?.catelogs || []} rowKey="id" size="small">
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
            title={
              <span>
                排序
                <Tooltip title="升序，按数字从小到大排序">
                  <QuestionCircleOutlined style={{ marginLeft: "5px" }} />
                </Tooltip>
              </span>
            }
            dataIndex="sort"
            width={150}
          />
          <Table.Column
            title={
              <span>
                隐藏
                <Tooltip title="开启后只有登录后才会展示该工具分类">
                  <QuestionCircleOutlined style={{ marginLeft: "5px" }} />
                </Tooltip>
              </span>
            }
            dataIndex={"hide"}
            width={50}
            render={(val) => {
              return Boolean(val) ? "是" : "否";
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
                  <Button
                    type="link"
                    onClick={() => {
                      updateForm.setFieldsValue(record);
                      setShowEdit(true);
                    }}
                  >
                    修改
                  </Button>
                  <Popconfirm
                    onConfirm={() => {
                      handleDelete(record.id);
                    }}
                    title={`确定要删除分类 ${record.name} 吗？`}
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
        open={showAddModel}
        title={"新建分类"}
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
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="sort"
            required
            initialValue={1}
            label={
              <span>
                <Tooltip title="升序，按数字从小到大排序">
                  <QuestionCircleOutlined style={{ marginLeft: "5px" }} />
                </Tooltip>
                &nbsp;排序
              </span>
            }
            labelCol={{ span: 4 }}
          >
            <InputNumber
              placeholder="请输入分类排序"
              type="number"
              defaultValue={1}
            />
          </Form.Item>
          <Form.Item
            name="hide"
            initialValue={false}
            required
            label={
              <span>
                <Tooltip title="开启后只有登录后才会展示该工具">
                  <QuestionCircleOutlined style={{ marginLeft: "5px" }} />
                </Tooltip>
                &nbsp;隐藏
              </span>
            }
            labelCol={{ span: 4 }}
          >
            <Switch checkedChildren="开" unCheckedChildren="关" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={showEdit}
        title={"修改分类"}
        onCancel={() => {
          setShowEdit(false);
        }}
        onOk={() => {
          const values = updateForm?.getFieldsValue();
          handleUpdate(values);
        }}
      >
        <Spin spinning={requestLoading}>
          <Form form={updateForm}>
            <Form.Item name="id" label="序号" labelCol={{ span: 4 }}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="name" required label="名称" labelCol={{ span: 4 }}>
              <Input placeholder="请输入分类名称" />
            </Form.Item>
            <Form.Item
              name="sort"
              required
              label={
                <span>
                  <Tooltip title="升序，按数字从小到大排序">
                    <QuestionCircleOutlined style={{ marginLeft: "5px" }} />
                  </Tooltip>
                  &nbsp;排序
                </span>
              }
              labelCol={{ span: 4 }}
            >
              <InputNumber placeholder="请输入分类排序" defaultValue={1} />
            </Form.Item>
            <Form.Item
              name="hide"
              required
              label={
                <span>
                  <Tooltip title="开启后只有登录后才会展示该工具">
                    <QuestionCircleOutlined style={{ marginLeft: "5px" }} />
                  </Tooltip>
                  &nbsp;隐藏
                </span>
              }
              labelCol={{ span: 4 }}
            >
              <Switch checkedChildren="开" unCheckedChildren="关" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Card>
  );
};
