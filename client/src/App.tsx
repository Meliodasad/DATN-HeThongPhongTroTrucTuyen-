import React from "react";
import { useRoutes } from "react-router-dom";
import AdminLayout from "./pages/layout/admin";
import Dashboard from "./pages/admin/Dashboard"; // Đảm bảo đường dẫn đúng
import UserList from "./pages/admin/UserList";
import PhongTroList from "./pages/admin/PhongTroList";
import PhongTroAdd from "./pages/admin/PhongTroAdd";
import PhongTroEdit from "./pages/admin/PhongTroEdit";

const App = () => {
  const routes = useRoutes([
    {
      path: "/dashboard",
      element: <AdminLayout />,
      children: [
        { path: "users", element: <UserList /> },
        { path: "phong-tro", element: <PhongTroList /> },
        { path: "phong-tro/add", element: <PhongTroAdd /> },
        { path: "phong-tro/edit/:id", element: <PhongTroEdit /> },

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
