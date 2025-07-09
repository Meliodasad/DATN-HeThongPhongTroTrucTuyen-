import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import type { MenuProps } from 'antd/es/menu';
import {
  HomeFilled,
  UserOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  MessageOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const AdminSidebar = () => {
  const navigate = useNavigate();

  type MenuItem = Required<MenuProps>['items'][number];

  const items: MenuItem[] = [
    {
      key: 'dashboard',
      label: 'Bảng điều khiển',
      icon: <HomeFilled />,
    },
    {
      key: 'users',
      label: 'Người dùng',
      icon: <UserOutlined />,
    },
    {
      key: 'phong-tro',
      label: 'Chủ trọ',
      icon: <ApartmentOutlined />,
    },
    {
      key: 'rooms',
      label: 'Phòng trọ',
      icon: <FileTextOutlined />,
    },
    {
      key: 'comments',
      label: 'Bình luận',
      icon: <MessageOutlined />,
    },
    {
      key: 'statistics',
      label: 'Thống kê',
      icon: <BarChartOutlined />,
    },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    navigate(`/dashboard/${key === 'dashboard' ? '' : key}`);
  };

  return (
    <aside className="w-[250px] h-screen bg-white shadow-md border-r border-gray-200 flex flex-col">
      <div className="p-4 text-2xl font-bold text-blue-600 text-center border-b border-gray-200">
        Admin Nhà Trọ
      </div>
      <Menu
        onClick={onClick}
        defaultSelectedKeys={['dashboard']}
        mode="inline"
        className="flex-1"
        items={items}
      />
    </aside>
  );
};

export default AdminSidebar;
