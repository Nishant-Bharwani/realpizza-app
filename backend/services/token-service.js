const jwt = require('jsonwebtoken');
const TokenModel = require('../models/token-model');
const { JWT_TOKEN_SECRET_KEY } = require('../config');

class TokenService {
    generateTokens(payload) {
        const token = jwt.sign(payload, JWT_TOKEN_SECRET_KEY, {
            expiresIn: '1d',
        });

        return token;
    }

    async verifyToken(token) {
        return jwt.verify(token, JWT_TOKEN_SECRET_KEY);
    }

    async storeToken(token, userId) {
        try {
            const doc = await TokenModel.create({
                token,
                userId,

            });
            doc.save();
        } catch (err) {
            console.log(err);
        }
    }

    async findToken(userId, token) {
        return await TokenModel.findOne({
            userId,
            token
        });
    }

    async updateToken(userId, token) {
        return await TokenModel.updateOne({
            userId
        }, {
            token
        });
    }

    async removeToken(token) {
        await TokenModel.deleteMany({ token });
    }
}

module.exports = new TokenService();