// Chi tiết phòng
// ../client/src/pages/host/RoomDetail.tsx
import { X } from "lucide-react";

interface Props {
  room: any;
  onClose: () => void;
}

export default function RoomDetailModal({ room, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 relative shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <img src={room.image} alt="Phòng" className="w-full md:w-1/2 h-64 object-cover rounded-lg" />

          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold">{room.code}</h2>
            <p className="text-gray-600">{room.description}</p>
            <p><strong>Giá:</strong> {room.price.toLocaleString()}đ/tháng</p>
            <p><strong>Diện tích:</strong> {room.area} m²</p>
            <p><strong>Vị trí:</strong> {room.location}</p>
            <p><strong>Tiền cọc:</strong> {room.deposit}</p>
            <p><strong>Điện nước:</strong> {room.electricity}đ/kWh</p>

            <div className="mt-4">
              <h3 className="font-semibold">Tiện nghi</h3>
              <ul className="grid grid-cols-2 gap-1 list-disc list-inside text-gray-700">
                {room.utilities?.split(",").map((u: string, idx: number) => (
                  <li key={idx}>{u.trim()}</li>
                ))}
              </ul>
            </div>

            {room.tenant && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center gap-3">
                <img src={room.tenant.avatar} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">{room.tenant.name}</p>
                  <p className="text-sm text-gray-500">{room.tenant.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
