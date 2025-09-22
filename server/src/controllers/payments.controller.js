const axios = require('axios');
const crypto = require('crypto');
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

const { BadRequestError } = require('../core/error.response');
const { OK } = require('../core/success.response');

const modelUser = require('../models/users.model');
const modelRechargeUser = require('../models/RechargeUser.model');

const { v4: uuidv4 } = require('uuid');

class PaymentsController {
    /**
     * Hàm khởi tạo thanh toán (MOMO, VNPAY)
     */
    async payments(req, res) {
        const { id } = req.user;
        const { typePayment, amountUser } = req.body;

        if (!typePayment || !amountUser) {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin thanh toán');
        }

        console.log(`[PAYMENT] User ${id} yêu cầu thanh toán ${amountUser} qua ${typePayment}`);

        if (typePayment === 'MOMO') {
            // ==== CONFIG MOMO TEST ====
            const partnerCode = 'MOMO';
            const accessKey = 'F8BBA842ECF85';
            const secretkey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

            const requestId = partnerCode + new Date().getTime();
            const orderId = requestId;
            const orderInfo = `nap tien ${id}`; // nội dung giao dịch thanh toán
            const redirectUrl = 'http://localhost:3000/api/check-payment-momo'; // FRONTEND callback
            const ipnUrl = 'http://localhost:3000/api/check-payment-momo'; // BACKEND callback
            const amount = amountUser;
            const requestType = 'captureWallet';
            const extraData = '';

            const rawSignature =
                `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
                `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
                `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

            // Tạo chữ ký HMAC SHA256
            const signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');

            // JSON request body
            const requestBody = {
                partnerCode,
                accessKey,
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                extraData,
                requestType,
                signature,
                lang: 'vi',
            };

            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log(`[MOMO] Response:`, response.data);

            return new OK({ message: 'Tạo thanh toán MoMo thành công', metadata: response.data }).send(res);
        }

        if (typePayment === 'VNPAY') {
            const vnpay = new VNPay({
                tmnCode: 'ULJPEWDT',
                secureSecret: '59KXW26G8YUTIUXM730VNXG1QUTC5JAX',
                vnpayHost: 'https://sandbox.vnpayment.vn',
                testMode: true,
                hashAlgorithm: 'SHA512',
                loggerFn: ignoreLogger,
            });

            const uuid = uuidv4();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const vnpayResponse = await vnpay.buildPaymentUrl({
                vnp_Amount: amountUser * 100, // ✅ VNPAY yêu cầu nhân 100
                vnp_IpAddr: req.ip || '127.0.0.1',
                vnp_TxnRef: `${id}-${uuid}`,
                vnp_OrderInfo: `nap tien ${id}`,
                vnp_OrderType: ProductCode.Other,
                vnp_ReturnUrl: `http://localhost:3000/api/check-payment-vnpay`,
                vnp_Locale: VnpLocale.VN,
                vnp_CreateDate: dateFormat(new Date()),
                vnp_ExpireDate: dateFormat(tomorrow),
            });

            console.log(`[VNPAY] Payment URL created for user ${id}`);

            return new OK({ message: 'Tạo thanh toán VNPAY thành công', metadata: vnpayResponse }).send(res);
        }
    }

    /**
     * Callback khi thanh toán MoMo xong
     */
    async checkPaymentMomo(req, res) {
        const { orderInfo, resultCode, amount } = req.query;

        console.log(`[MOMO] Callback với resultCode = ${resultCode}, amount = ${amount}`);

        if (resultCode === '0') {
            const result = orderInfo.split(' ')[2]; // userId
            const findUser = await modelUser.findOne({ _id: result });

            if (findUser) {
                findUser.balance += Number(amount);
                await findUser.save();

                // Lưu giao dịch
                await modelRechargeUser.create({
                    userId: findUser._id,
                    amount,
                    typePayment: 'MOMO',
                    status: 'success',
                    transactionId: orderInfo,
                });

                const socket = global.usersMap.get(findUser._id.toString());
                if (socket) {
                    socket.emit('new-payment', {
                        userId: findUser._id,
                        amount,
                        date: new Date(),
                        typePayment: 'MOMO',
                    });
                }

                return res.redirect(`http://localhost:5173/trang-ca-nhan?status=success&type=MOMO`);
            }
        }

        return res.redirect(`http://localhost:5173/trang-ca-nhan?status=fail&type=MOMO`);
    }

    /**
     * Callback khi thanh toán VNPay xong
     */
    async checkPaymentVnpay(req, res) {
        const { vnp_ResponseCode, vnp_OrderInfo, vnp_Amount, vnp_TransactionNo } = req.query;

        console.log(`[VNPAY] Callback với code = ${vnp_ResponseCode}, amount = ${vnp_Amount}`);

        if (vnp_ResponseCode === '00') {
            const result = vnp_OrderInfo.split(' ')[2];
            const findUser = await modelUser.findOne({ _id: result });

            if (findUser) {
                const realAmount = Number(vnp_Amount.slice(0, -2)); // VNPay trả về *100
                findUser.balance += realAmount;
                await findUser.save();

                // Lưu giao dịch
                await modelRechargeUser.create({
                    userId: findUser._id,
                    amount: realAmount,
                    typePayment: 'VNPAY',
                    status: 'success',
                    transactionId: vnp_TransactionNo,
                });

                const socket = global.usersMap.get(findUser._id.toString());
                if (socket) {
                    socket.emit('new-payment', {
                        userId: findUser._id,
                        amount: realAmount,
                        date: new Date(),
                        typePayment: 'VNPAY',
                    });
                }

                return res.redirect(`http://localhost:5173/trang-ca-nhan?status=success&type=VNPAY`);
            }
        }

        return res.redirect(`http://localhost:5173/trang-ca-nhan?status=fail&type=VNPAY`);
    }
}

module.exports = new PaymentsController();
