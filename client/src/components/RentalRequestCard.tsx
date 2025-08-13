// src/components/RentalRequestCard.tsx
// Thẻ hiển thị thông tin yêu cầu thuê phòng
import { Calendar, Phone, MessageCircle } from "lucide-react";

interface RentalRequestCardProps {
  request: {
    id: number;
    tenantName: string;
    phone: string;
    email: string;
    desiredRoomId: string;
    status: string;
    message: string;
    submittedAt: string;
    avatar: string;
  };
  onApprove: () => void;
  onReject: () => void;
}

const RentalRequestCard = ({ request, onApprove, onReject }: RentalRequestCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <img
          src={request.avatar}
          alt={request.tenantName}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{request.tenantName}</h4>
              <p className="text-sm text-gray-600">{request.desiredRoomId}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">{request.submittedAt.split(' - ')[0]}</span>
              <div className="text-xs text-gray-400">{request.submittedAt.split(' - ')[1]}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              <span>{request.phone}</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
              <span className="capitalize">{request.status}</span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 italic">"{request.message}"</p>
            </div>
          </div>

          {request.status === "chờ duyệt" && (
            <div className="flex space-x-2 mt-4">
              <button
                onClick={onApprove}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Chấp nhận
              </button>
              <button
                onClick={onReject}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Từ chối
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentalRequestCard;