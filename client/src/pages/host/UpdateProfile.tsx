// 📁 src/pages/host/UpdateProfile.tsx
// Trang cập nhật thông tin cá nhân của chủ nhà
import { useEffect, useState } from "react";
import { hostService } from "../../services/hostService";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    hostService.getProfile()
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = () => {
    setLoading(true);
    hostService.updateProfile(profile)
      .then(() => {
        alert("✅ Cập nhật thành công!");
        navigate("/host/profile");
    })
      .catch(() => alert("❌ Cập nhật thất bại!"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        🧑‍💼 Cập nhật thông tin cá nhân
      </h2>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Họ tên:</span>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Số điện thoại:</span>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Email:</span>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Ảnh đại diện (URL):</span>
          <input
            type="text"
            value={profile.avatar}
            onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </label>

        {profile.avatar && (
          <div className="flex justify-center">
            <img
              src={profile.avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-300"
            />
          </div>
        )}

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Địa chỉ:</span>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </label>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? "🔄 Đang lưu..." : "💾 Lưu thông tin"}
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
