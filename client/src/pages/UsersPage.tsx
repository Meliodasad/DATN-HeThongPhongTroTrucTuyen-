import React, { useState, useEffect, useMemo } from 'react';
import UserManagement from './admin/user/UserManagement';

const UsersPage: React.FC = () => {
  return <UserManagement />;
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: { 'Admin': 0, 'Chủ trọ': 0, 'Người dùng': 0 }
  });
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserType['role'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserType['status'] | 'all'>('all');

  const { success, error } = useToastContext();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        userService.getUsers(),
        userService.getUserStats()
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSubmitUser = async (userData: UserFormData) => {
    try {
      setModalLoading(true);
      
      if (editingUser) {
        await userService.updateUser(editingUser.id, userData);
        success('Thành công', 'Cập nhật người dùng thành công');
      } else {
        await userService.createUser(userData);
        success('Thành công', 'Thêm người dùng thành công');
      }
      
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      error('Lỗi', 'Không thể thực hiện thao tác');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      await userService.deleteUser(id);
      success('Thành công', 'Xóa người dùng thành công');
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể xóa người dùng');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await userService.toggleUserStatus(id);
      success('Thành công', 'Cập nhật trạng thái thành công');
      await loadData();
    } catch (err) {
      console.error(err);
      error('Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

  return (
    <>
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddUser={handleAddUser}
      />

      <UserTable
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        loading={loading}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitUser}
        user={editingUser}
        loading={modalLoading}
      />
    </>
  );
};

export default UsersPage;