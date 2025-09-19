import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, UserPlus, Home } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';


const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'tenant' as 'host' | 'tenant'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    const success = await register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
      role: formData.role
    });
    if (success) navigate('/login');
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">
            <Home className="register-logo-icon" />
          </div>
          <h2 className="register-title">Đăng ký tài khoản</h2>
          <p className="register-subtitle">Tham gia hệ thống quản lý cho thuê trọ</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Họ tên */}
          <div className="register-field">
            <label>Họ và tên *</label>
            <div className="register-input-wrapper">
              <User className="register-icon" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`register-input ${errors.fullName ? 'error' : ''}`}
                placeholder="Nhập họ và tên"
              />
            </div>
            {errors.fullName && <p className="register-error">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="register-field">
            <label>Email *</label>
            <div className="register-input-wrapper">
              <Mail className="register-icon" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`register-input ${errors.email ? 'error' : ''}`}
                placeholder="Nhập email"
              />
            </div>
            {errors.email && <p className="register-error">{errors.email}</p>}
          </div>

          {/* Số điện thoại */}
          <div className="register-field">
            <label>Số điện thoại</label>
            <div className="register-input-wrapper">
              <Phone className="register-icon" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`register-input ${errors.phone ? 'error' : ''}`}
                placeholder="Nhập số điện thoại"
              />
            </div>
            {errors.phone && <p className="register-error">{errors.phone}</p>}
          </div>

          {/* Loại tài khoản */}
          <div className="register-field">
            <label>Loại tài khoản *</label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value as 'host' | 'tenant')}
              className="register-select"
            >
              <option value="tenant">Người thuê trọ</option>
              <option value="host">Chủ trọ</option>
            </select>
          </div>

          {/* Mật khẩu */}
          <div className="register-field">
            <label>Mật khẩu *</label>
            <div className="register-input-wrapper">
              <Lock className="register-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`register-input ${errors.password ? 'error' : ''}`}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="register-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <p className="register-error">{errors.password}</p>}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="register-field">
            <label>Xác nhận mật khẩu *</label>
            <div className="register-input-wrapper">
              <Lock className="register-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`register-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Nhập lại mật khẩu"
              />
              <button
                type="button"
                className="register-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="register-error">{errors.confirmPassword}</p>}
          </div>

          {/* Nút đăng ký */}
          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? 'Đang đăng ký...' : (
              <>
                <UserPlus className="register-btn-icon" /> Đăng ký
              </>
            )}
          </button>

          {/* Link đăng nhập */}
          <p className="register-login-text">
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
