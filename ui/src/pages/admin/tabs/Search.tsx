import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Upload,
  Image,
} from 'antd';
import { DragOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SearchEngine {
  id: string;
  name: string;
  baseUrl: string;
  queryParam: string;
  logo: string;
  order: number;
}

const defaultEngines: SearchEngine[] = [
  {
    id: '1',
    name: '百度',
    baseUrl: 'https://www.baidu.com/s',
    queryParam: 'wd',
    logo: 'https://www.baidu.com/favicon.ico',
    order: 1,
  },
  {
    id: '2',
    name: 'Google',
    baseUrl: 'https://www.google.com/search',
    queryParam: 'q',
    logo: 'https://www.google.com/favicon.ico',
    order: 2,
  },
  {
    id: '3',
    name: 'Bing',
    baseUrl: 'https://www.bing.com/search',
    queryParam: 'q',
    logo: 'https://www.bing.com/favicon.ico',
    order: 3,
  },
];

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
  const [engines, setEngines] = useState<SearchEngine[]>(defaultEngines);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEngine, setEditingEngine] = useState<SearchEngine | null>(null);
  const [form] = Form.useForm();

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
      render: (logo: string) => (
        <Image src={logo} alt="logo" width={24} height={24} />
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
      title: '查询参��',
      dataIndex: 'queryParam',
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

  const handleEdit = (engine: SearchEngine) => {
    setEditingEngine(engine);
    form.setFieldsValue(engine);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setEngines(engines.filter((engine) => engine.id !== id));
    message.success('删除成功');
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
        setEngines(
          engines.map((engine) =>
            engine.id === editingEngine.id ? { ...engine, ...values } : engine
          )
        );
        message.success('修改成功');
      } else {
        const newEngine = {
          ...values,
          id: Date.now().toString(),
          order: engines.length + 1,
        };
        setEngines([...engines, newEngine]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const onDragEnd = ({ active, over }: any) => {
    if (active.id !== over?.id) {
      const activeIndex = engines.findIndex((i) => i.id === active.id);
      const overIndex = engines.findIndex((i) => i.id === over?.id);
      const newItems = [...engines];
      const [reorderedItem] = newItems.splice(activeIndex, 1);
      newItems.splice(overIndex, 0, reorderedItem);

      const reorderedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setEngines(reorderedItems);
      message.success('排序已更新');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加搜索引擎
        </Button>
      </div>

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
          />
        </SortableContext>
      </DndContext>

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
            <Input />
          </Form.Item>
          <Form.Item
            name="baseUrl"
            label="基础URL"
            rules={[{ required: true, message: '请输入基础URL' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="queryParam"
            label="查询参数"
            rules={[{ required: true, message: '请输入查询参数' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="logo"
            label="Logo URL"
            rules={[{ required: true, message: '请输入Logo URL' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SearchEngineManager;
