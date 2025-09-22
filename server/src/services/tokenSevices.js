const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const modelApiKey = require('../models/apiKey.model');
const { BadUserRequestError } = require('../core/error.response');
const jwtDecode = require('jwt-decode'); // ❌ không destructure, lib này export default

require('dotenv').config();

/**
 * Tạo mới public/private key cho user và lưu vào DB
 */
const createApiKey = async (userId) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });

    const privateKeyString = privateKey.export({ type: 'pkcs8', format: 'pem' });
    const publicKeyString = publicKey.export({ type: 'spki', format: 'pem' });

    const newApiKey = new modelApiKey({
        userId,
        publicKey: publicKeyString,
        privateKey: privateKeyString,
        createdAt: new Date(),
    });

    console.log(`[API_KEY] Tạo API key cho user ${userId}`);

    return await newApiKey.save();
};

/**
 * Tạo access token với thời gian sống ngắn
 */
const createToken = async (payload) => {
    const findApiKey = await modelApiKey.findOne({ userId: payload.id.toString() });

    if (!findApiKey?.privateKey) {
        throw new Error(`Private key not found for user ${payload.id}`);
    }

    return jwt.sign(payload, findApiKey.privateKey, {
        algorithm: 'RS256',
        expiresIn: '15m',
        issuer: 'my-app',
    });
};

/**
 * Tạo refresh token (dài hạn hơn)
 */
const createRefreshToken = async (payload) => {
    const findApiKey = await modelApiKey.findOne({ userId: payload.id.toString() });

    if (!findApiKey?.privateKey) {
        throw new Error(`Private key not found for user ${payload.id}`);
    }

    return jwt.sign(payload, findApiKey.privateKey, {
        algorithm: 'RS256',
        expiresIn: '7d',
        issuer: 'my-app',
    });
};

/**
 * Xác minh token (cả access/refresh)
 */
const verifyToken = async (token) => {
    try {
        const { id } = jwtDecode(token); // chỉ giải mã để lấy userId
        const findApiKey = await modelApiKey.findOne({ userId: id });

        if (!findApiKey) {
            console.warn(`[JWT] Không tìm thấy API key cho user ${id}`);
            throw new BadUserRequestError('Vui lòng đăng nhập lại');
        }

        return jwt.verify(token, findApiKey.publicKey, {
            algorithms: ['RS256'],
        });
    } catch (error) {
        console.error('[JWT] Verify thất bại:', error.message);
        throw new BadUserRequestError('Vui lòng đăng nhập lại');
    }
};

module.exports = {
    createApiKey,
    createToken,
    createRefreshToken,
    verifyToken,
};
