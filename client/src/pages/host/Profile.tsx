// 📁 src/pages/host/Profile.tsx
// Trang thông tin cá nhân của chủ nhà
// 📁 src/pages/host/Profile.tsx
import { useEffect, useState } from "react";
import { hostService } from "../../services/hostService";
import UpdateProfile from "./UpdateProfile"; // 👈 Import component modal
import Modal from "../../components/Modal"; // 👈 Modal bạn cần có sẵn (hoặc tạo modal riêng)

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    hostService
      .getProfile()
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Đang tải thông tin...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-indigo-700 text-center mb-6">
        Thông tin cá nhân
      </h2>

      <div className="flex justify-center mb-6">
        <img
          src={profile.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
        />
      </div>

      <div className="space-y-4 text-gray-700 text-base">
        <p><strong>👤 Họ tên:</strong> {profile.name}</p>
        <p><strong>📞 Số điện thoại:</strong> {profile.phone}</p>
        <p><strong>✉️ Email:</strong> {profile.email}</p>
        <p><strong>📍 Địa chỉ:</strong> {profile.address}</p>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          ✏️ Chỉnh sửa thông tin
        </button>
      </div>

      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <UpdateProfile closeModal={() => setOpenModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Profile;
