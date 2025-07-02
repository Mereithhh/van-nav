import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Image,
  Switch,
  Spin,
} from 'antd';
import { DragOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  fetchGetAllSearchEngines,
  fetchAddSearchEngine,
  fetchUpdateSearchEngine,
  fetchDeleteSearchEngine,
  fetchUpdateSearchEnginesSort,
} from '../../../utils/api';

interface SearchEngine {
  id: number;
  name: string;
  baseUrl: string;
  queryParam: string;
  logo: string;
  sort: number;
  enabled: boolean;
}

const DraggableRow = ({ children, ...props }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </tr>
  );
};

const SearchEngineManager: React.FC = () => {
  const [engines, setEngines] = useState<SearchEngine[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEngine, setEditingEngine] = useState<SearchEngine | null>(null);
  const [form] = Form.useForm();

  // 加载搜索引擎数据
  const loadEngines = async () => {
    try {
      setLoading(true);
      const data = await fetchGetAllSearchEngines();
      setEngines(data);
    } catch (error) {
      message.error('加载搜索引擎失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEngines();
  }, []);

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 30,
      render: () => <DragOutlined style={{ cursor: 'move', color: '#999' }} />,
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      width: 80,
      render: (logo: string, record: SearchEngine) => (
        <Image 
          src={logo.startsWith('http') ? logo : `/api/img?url=${logo}`} 
          alt={record.name} 
          width={24} 
          height={24}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '基础URL',
      dataIndex: 'baseUrl',
    },
    {
      title: '查询参数',
      dataIndex: 'queryParam',
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      render: (enabled: boolean, record: SearchEngine) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleEnabled(record, checked)}
        />
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: SearchEngine) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleToggleEnabled = async (engine: SearchEngine, enabled: boolean) => {
    try {
      await fetchUpdateSearchEngine({ ...engine, enabled });
      message.success('更新成功');
      loadEngines();
    } catch (error) {
      message.error('更新失败');
      console.error(error);
    }
  };

  const handleEdit = (engine: SearchEngine) => {
    setEditingEngine(engine);
    form.setFieldsValue(engine);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchDeleteSearchEngine(id);
      message.success('删除成功');
      loadEngines();
    } catch (error) {
      message.error('删除失败');
      console.error(error);
    }
  };

  const handleAdd = () => {
    setEditingEngine(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingEngine) {
        await fetchUpdateSearchEngine({ ...values, id: editingEngine.id });
        message.success('修改成功');
      } else {
        await fetchAddSearchEngine({ ...values, enabled: true });
        message.success('添加成功');
      }
      setIsModalVisible(false);
      loadEngines();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const onDragEnd = async ({ active, over }: any) => {
    if (active.id !== over?.id) {
      const activeIndex = engines.findIndex((i) => i.id === active.id);
      const overIndex = engines.findIndex((i) => i.id === over?.id);
      const newItems = [...engines];
      const [reorderedItem] = newItems.splice(activeIndex, 1);
      newItems.splice(overIndex, 0, reorderedItem);

      const reorderedItems = newItems.map((item, index) => ({
        ...item,
        sort: index + 1,
      }));

      setEngines(reorderedItems);

      try {
        const updates = reorderedItems.map((item, index) => ({
          id: item.id,
          sort: index + 1,
        }));
        await fetchUpdateSearchEnginesSort(updates);
        message.success('排序已更新');
      } catch (error) {
        message.error('排序更新失败');
        console.error(error);
        // 如果失败，重新加载数据
        loadEngines();
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加搜索引擎
        </Button>
      </div>

      <Spin spinning={loading}>
        <DndContext onDragEnd={onDragEnd}>
          <SortableContext
            items={engines.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              columns={columns}
              dataSource={engines}
              rowKey="id"
              components={{
                body: {
                  row: DraggableRow,
                },
              }}
              pagination={false}
            />
          </SortableContext>
        </DndContext>
      </Spin>

      <Modal
        title={editingEngine ? '编辑搜索引擎' : '添加搜索引擎'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入搜索引擎名称' }]}
          >
            <Input placeholder="例如：百度" />
          </Form.Item>
          <Form.Item
            name="baseUrl"
            label="基础URL"
            rules={[{ required: true, message: '请输入基础URL' }]}
          >
            <Input placeholder="例如：https://www.baidu.com/s" />
          </Form.Item>
          <Form.Item
            name="queryParam"
            label="查询参数"
            rules={[{ required: true, message: '请输入查询参数' }]}
          >
            <Input placeholder="例如：wd" />
          </Form.Item>
          <Form.Item
            name="logo"
            label="Logo文件名"
            rules={[{ required: true, message: '请输入Logo文件名' }]}
          >
            <Input placeholder="例如：baidu.ico（需要先上传到public目录）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SearchEngineManager;
