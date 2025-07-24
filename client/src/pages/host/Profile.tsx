// 📁 src/pages/host/Profile.tsx
// Trang cập nhật thông tin cá nhân của chủ nhà
import { useEffect, useState } from "react";
import { hostService } from "../../services/hostService";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hostService.getProfile) {
      setLoading(true);
      hostService.getProfile()
        .then((res) => setProfile(res.data))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleUpdate = () => {
    setLoading(true);
    hostService.updateProfile(profile)
      .then(() => alert("Cập nhật thành công!"))
      .catch(() => alert("Cập nhật thất bại!"))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 20 }}>Cập nhật thông tin cá nhân</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label>
          Họ tên:
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </label>

        <label>
          Số điện thoại:
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </label>

        <label>
          Ảnh đại diện (URL):
          <input
            type="text"
            value={profile.avatar}
            onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
          />
        </label>

        <label>
          Địa chỉ:
          <input
            type="text"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />
        </label>

        <button onClick={handleUpdate} disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thông tin"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
