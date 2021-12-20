import { useModel } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Form, Input, Button, message, Space, Table, Popconfirm, Modal,Select } from 'antd';
import { useCallback, useState, useMemo } from 'react';
import { addTool, removeTool } from '@/services/ant-design-pro/api';
import styles from "./index.less";

const ToolPage = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [showAddModel, setShowAddModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currUpdateId,setCurrUpdateId] = useState<number>();
  const tools = initialState?.tools;
  const catelogs = initialState?.catelogs;
  const [addForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const fetchReload = useCallback(async () => {
    setLoading(true);
    const allData = await initialState?.fetchData?.();
    if (allData) {
      await setInitialState((s) => ({ ...s, ...allData }));
    }
    setLoading(false);
  }, [initialState, setInitialState, setLoading]);
  const fetchAddTool = useCallback(
    async (values) => {
      setLoading(true);
      const r = await addTool({ ...values });
      if (r) {
        message.success(r);
        await fetchReload();
      }
      setLoading(false);
      setShowAddModel(false)
    },
    [fetchReload, setLoading,setShowAddModel],
  );
  const fetchRemoveTool = useCallback(
    async (values) => {
      setLoading(true);
      const r = await removeTool(values?.id);
      if (r) {
        message.success(r);
        await fetchReload();
      }
      setLoading(false);
    },
    [fetchReload, setLoading],
  );
  const fetchUpdateTool = useCallback(
    async (values) => {
      setLoading(true);
      const r = await addTool({ ...values });
      if (r) {
        message.success(r);
        await fetchReload();
      }
      setLoading(false);
      setShowUpdateModel(false)
    },
    [fetchReload, setLoading,setShowUpdateModel],
  );
  const CateData = useMemo(()=>{
    if (!catelogs) {
      return null;
    }
    return catelogs.map((item: any) => {
      return {
        label: item.name,
        value: item.name,
      }
    })

  },[catelogs])

  const CateFilters = useMemo(()=>{
    if (!catelogs) {
      return [];
    }
    return catelogs.map((item: any) => {
      return {
        text: item.name,
        value: item.name,
      }
    })
  },[catelogs])

  const NameFilters = useMemo(()=>{
    if(!tools) {
      return [];
    }
    // 获取所有类型
    const types = Array.from(new Set(tools.map((item:any) => (item.name))));
    return types.map((item: any) => ({
      text: item,
      value: item
    }))
  },[tools])



  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      filters: NameFilters,
      filterSearch: true,
      onFilter: (value: any, record: any) => {
        return record['name'] === value;
      },
    },
    {
      title: '分类',
      dataIndex: 'catelog',
      key: 'catelog',
      align: 'center',
      filters: CateFilters,
      onFilter: (value: any, record: any) => {
        return record['catelog'] === value;
      },
    },
    {
      title: '网址',
      dataIndex: 'url',
      key: 'url',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (record: any) => {
        return (
          <Space>
            <a
              onClick={() => {
                updateForm?.setFieldsValue(record);
                setCurrUpdateId(record.id)
                setShowUpdateModel(true);
              }}
              href="#"
            >
              修改
            </a>{' '}
            <Popconfirm
              title="确认删除该工具？"
              onConfirm={() => {
                fetchRemoveTool(record);
              }}
              okText="确认"
              cancelText="取消"
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <PageHeaderWrapper title={`工具管理`}>
      <ProCard
      className={styles.myCard}
      headerBordered
        title={null}
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
            <Button type="primary" onClick={fetchReload}>
              刷新
            </Button>
          </Space>
        }
      >
        <Table
          loading={loading}
          //@ts-ignore
          columns={columns}
          dataSource={tools}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 20,
          }}
        ></Table>
      </ProCard>
      <Modal visible={showAddModel} title={"新建工具"}

      onCancel={()=>{setShowAddModel(false)}}
      onOk={()=>{
        const values = addForm?.getFieldsValue();
        fetchAddTool(values);
      }}
      >
        <Form form={addForm} >
          <Form.Item name="name" required>
             <Input placeholder='请输入工具名称' />
          </Form.Item>
          <Form.Item name="url" required>
             <Input placeholder='请输入 url' />
          </Form.Item>
          <Form.Item name="logo" required>
             <Input placeholder='请输入 logo url' />
          </Form.Item>
          <Form.Item name="catelog" required>
             <Select options={CateData} placeholder="请选择分类"/>
          </Form.Item>
          <Form.Item name="desc" required>
             <Input placeholder='请输入描述' />
          </Form.Item>
        </Form>

      </Modal>
      <Modal visible={showUpdateModel} title={"修改工具"}
      onCancel={()=>{setShowUpdateModel(false)}}
      onOk={()=>{
        const values = updateForm?.getFieldsValue();
        values['id'] = currUpdateId;
        fetchUpdateTool(values);
      }}
      >
        <Form form={updateForm} >
          <Form.Item name="name" required>
             <Input placeholder='请输入工具名称' />
          </Form.Item>
          <Form.Item name="url" required>
             <Input placeholder='请输入 url' />
          </Form.Item>
          <Form.Item name="logo" required>
             <Input placeholder='请输入 logo url' />
          </Form.Item>
          <Form.Item name="catelog" required>
             <Select options={CateData} placeholder="请选择分类"/>
          </Form.Item>
          <Form.Item name="desc" required>
             <Input placeholder='请输入描述' />
          </Form.Item>
        </Form>

      </Modal>
    </PageHeaderWrapper>
  );
};

export default ToolPage;
