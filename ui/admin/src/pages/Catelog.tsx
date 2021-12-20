import { useModel } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Form, Input, Button, message, Space, Table, Popconfirm, Modal } from 'antd';
import { useCallback, useState, useMemo } from 'react';
import { addCatelog, removeCatelog } from '@/services/ant-design-pro/api';
import styles from './index.less';

const CatelogPage = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [showAddModel, setShowAddModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const catelogs = initialState?.catelogs;
  const [addForm] = Form.useForm();
  const fetchReload = useCallback(async () => {
    setLoading(true);
    const allData = await initialState?.fetchData?.();
    if (allData) {
      await setInitialState((s) => ({ ...s, ...allData }));
    }
    setLoading(false);
  }, [initialState, setInitialState, setLoading]);
  const fetchAddCatelog = useCallback(
    async (values) => {
      setLoading(true);
      const r = await addCatelog({ ...values });
      if (r) {
        message.success(r);
        await fetchReload();
      }
      setLoading(false);
      setShowAddModel(false);
    },
    [fetchReload, setLoading, setShowAddModel],
  );
  const fetchRemoveCatelog = useCallback(
    async (values) => {
      setLoading(true);
      const r = await removeCatelog(values?.id);
      if (r) {
        message.success(r);
        await fetchReload();
      }
      setLoading(false);
    },
    [fetchReload, setLoading],
  );

  const CateFilters = useMemo(() => {
    if (!catelogs) {
      return [];
    }
    return catelogs.map((item: any) => {
      return {
        text: item.name,
        value: item.name,
      };
    });
  }, [catelogs]);

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
      filters: CateFilters,
      filterSearch: true,
      onFilter: (value: any, record: any) => {
        return record['name'] === value;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (record: any) => {
        return (
          <Space>
            <Popconfirm
              title="确认删除该分类？"
              onConfirm={() => {
                fetchRemoveCatelog(record);
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
    <PageHeaderWrapper title={`分类管理`}>
      <ProCard
        className={styles.myCard}
        headerBordered
        title={`当前共 ${catelogs?.length || 0} 个分类`}
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
          dataSource={catelogs}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 20,
          }}
        ></Table>
      </ProCard>
      <Modal
        visible={showAddModel}
        title={'新建分类'}
        onCancel={() => {
          setShowAddModel(false);
        }}
        onOk={() => {
          const values = addForm?.getFieldsValue();
          fetchAddCatelog(values);
        }}
      >
        <Form form={addForm}>
          <Form.Item name="name" required>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default CatelogPage;
