// 📁 src/pages/host/UpdateProfile.tsx
// Trang cập nhật thông tin cá nhân của chủ nhà
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm dòng này
import { hostService } from "../../services/hostService";

const UpdateProfile = ({ closeModal }: { closeModal?: () => void }) => {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Thêm dòng này

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
        if (closeModal) {
          closeModal();
        } else {
          navigate("/host/profile"); // Nếu không có closeModal thì chuyển hướng
        }
      })
      .catch(() => alert("❌ Cập nhật thất bại!"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-indigo-600">
        🧑‍💼 Cập nhật thông tin
      </h2>

      <div className="flex flex-col gap-4">
        <label>
          <span className="text-sm text-gray-700 font-medium">Họ tên:</span>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </label>

        <label>
          <span className="text-sm text-gray-700 font-medium">Số điện thoại:</span>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </label>

        <label>
          <span className="text-sm text-gray-700 font-medium">Email:</span>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </label>

        <label>
          <span className="text-sm text-gray-700 font-medium">Ảnh đại diện (URL):</span>
          <input
            type="text"
            value={profile.avatar}
            onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </label>

        {profile.avatar && (
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-20 h-20 mx-auto rounded-full object-cover border"
          />
        )}

        <label>
          <span className="text-sm text-gray-700 font-medium">Địa chỉ:</span>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </label>

        <div className="flex justify-between mt-4">
          {closeModal && (
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
            >
              ❌ Hủy
            </button>
          )}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "🔄 Đang lưu..." : "💾 Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
