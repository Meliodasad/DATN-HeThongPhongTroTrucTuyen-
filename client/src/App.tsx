import React from 'react';
import { useRoutes } from 'react-router-dom';
import AdminLayout from './pages/layout/admin';
import Dashboard from './pages/admin/Dashboard'; // Đảm bảo đường dẫn đúng
import UserList from './pages/admin/UserList';
import Owners from './pages/admin/Owners'
const App = () => {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <AdminLayout />,
      children: [
              { path: 'users', element: <UserList /> },
               { path: 'owners', element: <Owners /> },
        {
          index: true, // khi vào /dashboard thì load Dashboard
          element: <Dashboard />,
        },
        // bạn có thể thêm các route con khác ở đây
      ],
    },
  ]);

  return routes;
};

export default App;
