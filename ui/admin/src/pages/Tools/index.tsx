import {
  Button,
  Card,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Tooltip
} from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useCallback, useContext, useState } from "react";
import { GlobalContext } from "../../components/GlobalContext";
import { getFilter, getOptions, mutiSearch } from "../../utils";
import {
  fetchAddTool,
  fetchDeleteTool,
  fetchExportTools,
  fetchImportTools,
  fetchUpdateTool,
} from "../../utils/api";
import "./index.css";
export interface ToolsProps {}
export const Tools: React.FC<ToolsProps> = (props) => {
  const { store, setStore, reload, loading } = useContext(GlobalContext);
  const [showEdit, setShowEdit] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);
  const [addForm] = Form.useForm();
  const [searchString, setSearchString] = useState("");
  const [catelogName, setCatelogName] = useState("");
  const [updateForm] = Form.useForm();
  const [selectedRows, setSelectRows] = useState<any>([]);
  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await fetchDeleteTool(id);
        message.success("删除成功!");
      } catch (err) {
        message.warning("删除失败!");
      } finally {
        reload();
      }
    },
    [reload]
  );
  const handleUpdate = useCallback(
    async (record: any) => {
      setRequestLoading(true);
      try {
        await fetchUpdateTool(record);
        message.success("更新成功! Logo 将在 3 秒后刷新并加载！",3);
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
  const handleCreate = useCallback(
    async (record: any) => {
      setRequestLoading(true);
      try {
        await fetchAddTool(record);
        message.success("添加成功! Logo 将在 3 秒后刷新并加载！",3);
        setTimeout(() => {
          reload();
        }, 3000);
      } catch (err) {
        message.warning("添加失败!");
      } finally {
        setRequestLoading(false);
        setShowAddModel(false);
        reload();
      }
    },
    [reload, setShowAddModel, setRequestLoading]
  );
  const handleImport = useCallback(
    async (data: any) => {
      try {
        await fetchImportTools(data);
        message.success("导入成功!");
      } catch (err) {
        message.warning("导入失败!");
      } finally {
        reload();
      }
    },
    [reload]
  );
  const handleBulkDelete = useCallback(async () => {
    try {
      for (const each of selectedRows) {
        try {
          await fetchDeleteTool(each.id);
        } catch (err) {}
      }
      message.success("删除成功!");
    } catch (err) {
      message.success( "删除失败!" );
    } finally {
      reload();
    }
  }, [reload, selectedRows]);
  const handleBulkResetLogo = useCallback(async () => {
    try {
      for (const each of selectedRows) {
        try {
          await fetchUpdateTool({ ...each, logo: "" });
        } catch (err) {}
      }
      message.success("重置成功!");
    } catch (err) {
      message.success("重置失败!" );
    } finally {
      reload();
    }
  }, [reload, selectedRows]);
  const handleBulkCacheLogo = useCallback(async () => {
    try {
      for (const each of selectedRows) {
        try {
          await fetchUpdateTool(each);
        } catch (err) {}
      }
      message.success("重置成功!");
    } catch (err) {
      message.success("重置失败!");
    } finally {
      reload();
    }
  }, [reload, selectedRows]);
  const handleExport = useCallback(async () => {
    const data = await fetchExportTools();
    const jsr = JSON.stringify(data);
    const blob = new Blob([jsr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tools.json";
    document.documentElement.appendChild(a);
    a.click();
    document.documentElement.removeChild(a);
    message.success("导出成功！");
    reload();
  }, [reload]);
  const numberText = `当前共 ${store?.tools?.length ?? 0} 条`;
  return (
    <Card
      title={
        <Space>
          <span>{numberText}</span>
          {selectedRows.length > 0 && (
            <Popconfirm
              title="确定删除这些吗？"
              onConfirm={() => {
                handleBulkDelete();
              }}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          )}
          {selectedRows.length > 0 && (
            <Popconfirm
              title="确定重置这些的图标吗？（会自动获取网站默认的）"
              onConfirm={() => {
                handleBulkResetLogo();
              }}
            >
              <Button type="link">重置默认图标</Button>
            </Popconfirm>
          )}
          {selectedRows.length > 0 && (
            <Popconfirm
              title="确定重新缓存这些的图标吗？（会自动获取图标缓存到数据库）"
              onConfirm={() => {
                handleBulkCacheLogo();
              }}
            >
              <Button type="link">重新缓存图标</Button>
            </Popconfirm>
          )}
        </Space>
      }
      extra={
        <Space>
          <Select
            options={getOptions(store?.catelogs || [])}
            placeholder="分类筛选"
            allowClear
            onClear={() => {
              setCatelogName("");
            }}
            onChange={(name: string) => {
              setCatelogName(name);
            }}
          />
          <Input.Search
            allowClear
            onSearch={(s: string) => {
              setSearchString(s.trim());
            }}
          />
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
          <Upload
            name="tools.json"
            maxCount={1}
            accept=".json"
            fileList={[]}
            beforeUpload={(file, fileList) => {
              const reader = new FileReader();
              reader.readAsText(file);
              reader.onload = (result) => {
                let tools = result?.target?.result;
                if (tools) {
                  handleImport(JSON.parse(tools as string));
                }
              };
              return false;
            }}
          >
            <Button type="primary">导入</Button>
          </Upload>
          <Button
            type="primary"
            onClick={() => {
              handleExport();
            }}
          >
            导出
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        <Table
          dataSource={
            store?.tools?.filter((item: any) => {
              let show = false;
              // 过滤名称或描述
              if (searchString === "") {
                show = true;
              } else {
                show = mutiSearch(item.name, searchString) || mutiSearch(item.desc, searchString);
              }
              // 过滤分类
              if (!catelogName || catelogName === ""){
                show = show && true;
              } else {
                show = show && mutiSearch(item.catelog, catelogName);
              }
              return show;
            }) || []
          }
          rowKey="id"
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
              setSelectRows(selectedRows);
            },
          }}
        >
          <Table.Column title="序号" dataIndex="id" width={30} />
          <Table.Column
            title="名称"
            dataIndex="name"
            width={120}
            render={(_, record: any) => {
              return (
                <div style={{
                  display:"flex",
                  flexDirection:"row",
                  alignItems: "center"
                }}>
                  {" "}
                  {record.logo.split(".").pop().includes("svg") ? (
                    <embed
                      src={`/api/img?url=${record.logo}`}
                      width={32}
                      height={32}
                      type="image/svg+xml"
                    />
                  ) : (
                    <img
                      src={`/api/img?url=${record.logo}`}
                      width={32}
                      height={32}
                    ></img>
                  )}
                  <span style={{ marginLeft: 8 }}>{record.name}</span>
                </div>
              );
            }}
          />
          <Table.Column
            title="分类"
            dataIndex="catelog"
            width={60}
            filters={getFilter(store?.catelogs || [])}
            onFilter={(value: any, record: any) => {
              return value === record["catelog"];
            }}
          />
          <Table.Column title="网址" dataIndex="url" width={150} />
          <Table.Column 
            title={
              <span>排序 
                <Tooltip title="升序，按数字从小到大排序">
                  <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                </Tooltip>
              </span>
            }
            dataIndex="sort" 
            width={30} 
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
                    title={`确定要删除 ${record.name} 吗？`}
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
        title={"新建工具"}
        onCancel={() => {
          setShowAddModel(false);
        }}
        onOk={() => {
          const values = addForm?.getFieldsValue();
          console.log(values);
          handleCreate(values);
        }}
      >
        <Spin spinning={requestLoading}>
          <Form form={addForm}>
            <Form.Item
              name="name"
              required
              label="名称"
              rules={[{ required: true, message: "请填写名称" }]}
              labelCol={{ span: 4 }}
            >
              <Input placeholder="请输入工具名称" />
            </Form.Item>
            <Form.Item
              name="url"
              rules={[{ required: true, message: "请填写网址" }]}
              required
              label="网址"
              labelCol={{ span: 4 }}
            >
              <Input placeholder="请输入 url" />
            </Form.Item>
            <Form.Item name="logo" label="logo 网址" labelCol={{ span: 4 }}>
              <Input placeholder="请输入 logo url, 为空则自动获取" />
            </Form.Item>
            <Form.Item
              name="catelog"
              required
              label="分类"
              labelCol={{ span: 4 }}
              rules={[{ required: true, message: "请选择分类" }]}
            >
              <Select
                options={getOptions(store?.catelogs || [])}
                placeholder="请选择分类"
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "请填写描述" }]}
              name="desc"
              required
              label="描述"
              labelCol={{ span: 4 }}
            >
              <Input placeholder="请输入描述" />
            </Form.Item>
            <Form.Item 
              rules={[{ required: true, message: "请排序" }]}
              name="sort"
              initialValue={1}
              required
              label={
                <span>
                  <Tooltip title="升序，按数字从小到大排序">
                    <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                  </Tooltip>
                  &nbsp;排序 
                </span>
              } 
              labelCol={{ span: 4 }}>
              <InputNumber placeholder="请输入排序"/>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <Modal
        visible={showEdit}
        title={"修改工具"}
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
              <Input placeholder="请输入工具名称" />
            </Form.Item>
            <Form.Item name="url" required label="网址" labelCol={{ span: 4 }}>
              <Input placeholder="请输入 url" />
            </Form.Item>
            <Form.Item name="logo" label="logo 网址" labelCol={{ span: 4 }}>
              <Input placeholder="请输入 logo url, 为空则自动获取" />
            </Form.Item>
            <Form.Item
              name="catelog"
              required
              label="分类"
              labelCol={{ span: 4 }}
            >
              <Select
                options={getOptions(store?.catelogs || [])}
                placeholder="请选择分类"
              />
            </Form.Item>
            <Form.Item name="desc" required label="描述" labelCol={{ span: 4 }}>
              <Input placeholder="请输入描述" />
            </Form.Item>
            
            <Form.Item
              name="sort"
              required
              label={
                <span>
                  <Tooltip title="升序，按数字从小到大排序">
                    <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                  </Tooltip>
                  &nbsp;排序 
                </span>
              } 
              labelCol={{ span: 4 }}>
              <InputNumber placeholder="请输入排序" defaultValue={1}/>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Card>
  );
};
