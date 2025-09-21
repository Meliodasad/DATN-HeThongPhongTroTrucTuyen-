import React, { useEffect, useState } from 'react';
import { X, Calendar, DollarSign, FileText } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';
import { buildHeaders } from '../../utils/config';

// Interface cho hóa đơn
interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    amount: number;
    createdAt: string;
    status: 'pending' | 'paid' | 'overdue';
    note: string;
}

// Props cho component InvoiceListDialog
interface InvoiceListDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onPayment: (value: any) => void;
}

// Component con để hiển thị từng hóa đơn
const InvoiceItem: React.FC<{
    invoice: Invoice;
    onPayment: (value: any) => void;
}> = ({ invoice, onPayment }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'paid':
                return 'Đã thanh toán';
            case 'pending':
                return 'Chờ thanh toán';
            case 'overdue':
                return 'Quá hạn';
            default:
                return status;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                        {invoice.invoiceNumber}
                    </h3>
                    <p className="text-gray-600">{invoice.customerName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} />
                    <span>{formatCurrency(invoice.amount)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{formatDate(invoice.createdAt)}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <FileText size={16} />
                <span>{invoice.note}</span>
            </div>

            {invoice.status !== 'paid' && (
                <button
                    onClick={() => onPayment(invoice)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Thanh toán {formatCurrency(invoice.amount)}
                </button>
            )}
        </div>
    );
};

// Component chính InvoiceListDialog
export const InvoiceListDialog: React.FC<InvoiceListDialogProps> = ({
    isOpen,
    onClose,
    onPayment,
}) => {
    if (!isOpen) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };
    const [invoices, setInvoices] = useState<any>([])

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                console.warn("User not found in localStorage");
                return;
            }

            const user = JSON.parse(userStr);
            const response: any = await fetch(
                `${API_BASE_URL}/invoices/user/${user.userId}`,
                {
                    method: "GET",
                    headers: buildHeaders(),
                }
            );

            const data = await response.json();

            setInvoices(data.data);
        } catch (err) {
            console.error(err);
        } finally {
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Danh sách hóa đơn</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>


                {/* Invoice List */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {invoices.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">Không có hóa đơn nào</p>
                        </div>
                    ) : (
                        <div>
                            {invoices.map((invoice: any) => (
                                <InvoiceItem
                                    key={invoice.id}
                                    invoice={invoice}
                                    onPayment={onPayment}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
