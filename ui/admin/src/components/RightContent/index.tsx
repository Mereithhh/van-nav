import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState) {
    return null;
  }


  let  className = `${styles.right}`;


  return (
    <Space className={className}>
      <span
        className={styles.action}
        onClick={() => {
          window.open('https://github.com/mereithhh/van-nav');
        }}
      >
        <QuestionCircleOutlined />
      </span>
      <Avatar />
    </Space>
  );
};

export default GlobalHeaderRight;
