import React, { useEffect, useState } from 'react';
import axios from 'axios';
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

const UserList = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/nguoi_dung');
      setUsers(res.data);
    } catch {
      alert('Không thể tải dữ liệu');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Bạn có chắc muốn xoá người dùng này?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:3000/nguoi_dung/${id}`);
      alert('Đã xoá thành công');
      fetchUsers();
    } catch {
      alert('Xoá không thành công');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', role: '' });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const { name, email, role } = form;
    if (!name || !email || !role) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      if (editingUser) {
        await axios.put(`http://localhost:3000/nguoi_dung/${editingUser.id}`, form);
        alert('Cập nhật thành công');
      } else {
        await axios.post('http://localhost:3000/nguoi_dung', {
          ...form,
          createdAt: new Date().toISOString().split('T')[0],
        });
        alert('Thêm người dùng thành công');
      }
      setOpen(false);
      fetchUsers();
    } catch {
      alert('Thao tác thất bại');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">👥 Quản lý người dùng</h2>
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Thêm người dùng</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-600">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Tên người dùng</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Vai trò</th>
              <th className="px-4 py-2 border">Ngày tạo</th>
              <th className="px-4 py-2 border text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{user.id}</td>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.role}</td>
                <td className="px-4 py-2 border">{user.createdAt}</td>
                <td className="px-4 py-2 border text-center space-x-2">
                  <button onClick={() => handleEdit(user)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Sửa</button>
                  <button onClick={() => handleDelete(user.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[400px] shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Tên người dùng</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Vai trò</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded">
                  <option value="">-- Chọn vai trò --</option>
                  <option value="Người dùng">Người dùng</option>
                  <option value="Chủ trọ">Chủ trọ</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Huỷ</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
