const jwt = require('jsonwebtoken');
const tokenService = require('../services/token-service');

const adminMiddleware = async(req, res, next) => {
    // const token = req.header('Authorization');
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decoded = await tokenService.verifyToken(token);
        req.userId = decoded.userId;
        req.role = decoded.role;
        if (req.role === 'admin') {
            next();
        } else {
            console.log("UNAAAAAA");
            res.status(401).json({ message: 'Unauthorized' });
        }

    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = adminMiddleware;