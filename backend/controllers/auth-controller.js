const { validationResult } = require('express-validator');
const userService = require('../services/user-service');
const UserModel = require('../models/user-model');
const TokenModel = require('../models/token-model')
const hashService = require('../services/hash-service');
const tokenService = require('../services/token-service');
const mailService = require('../services/mail-service');
const UserDto = require('../dtos/user-dto');

class AuthController {
    async registerUser(req, res) {
        try {
            const errors = userService.checkValidation(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const { name, email, password } = req.body;

            // Check if user already exists
            let user = await UserModel
                .findOne({ email });
            if (user) {
                return res.status(409).json({ message: 'User already exists' });
            }

            // Create new user
            const hashedPassword = await hashService.hashPassword(password);
            user = new UserModel({ name, email, password: hashedPassword });
            await user.save();

            // Send verification email
            const token = tokenService.generateTokens({ userId: user._id, role: user.role });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'RealPizza Email Verification',
                html: `
              <p>Hi ${name},</p>
              <p>Thank you for registering with RealPizza</p>
              <p>Please click <a href="${process.env.CLIENT_URL}/auth/verify/${token}">here</a> to verify your email address.</p>
              <p>If you did not request this, please ignore this email.</p>
              <p>Regards,</p>
              <p>Team RealPizza</p>
            `,
            };
            mailService.sendMail(mailOptions);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    async verifyToken(req, res) {
        try {
            const token = req.params.token;
            // Verify Token

            const decoded = await tokenService.verifyToken(token);
            const userId = decoded.userId;

            console.log(decoded);
            // Update user's isVerified field
            const user = await UserModel.findByIdAndUpdate(
                userId, { isVerified: true }, { new: true }
            );
            console.log(user);
            // res.redirect('http://localhost:3000/login');

            await tokenService.storeToken(token, userId);
            res.cookie('token', token, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });

            const userDto = new UserDto(user);
            res.send(userDto);


        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
            const errors = userService.checkValidation(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Check if user exists
            const user = await UserModel.findOne({ email });
            console.log("User", user);
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Check if password is correct
            // const isMatch = await user.validatePassword(password);
            const isMatch = await hashService.validateHashedPassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Wrong Password' });
            }


            // Check if user is verified
            if (!user.isVerified) {
                return res.status(403).json({ message: 'Email not verified' });
            }

            // Generate access token
            console.log(user.role);
            const token = tokenService.generateTokens({ userId: user._id, role: user.role });
            await tokenService.storeToken(token, user._id);

            res.cookie('token', token, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });

            const userDto = new UserDto(user);
            res.send(userDto);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            // Check if the user exists
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }

            // Generate a reset token and set the expiry date
            const resetToken = Math.random().toString(36).substring(7);
            const resetTokenExpiry = new Date();
            resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);


            // Update the user with the reset token and expiry date
            await user.updateOne({ resetToken, resetTokenExpiry });
            const mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: 'Reset your password',
                text: `Click on this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`
            };
            await mailService.sendMail(mailOptions);

            res.status(200).json({ message: 'Reset link sent to your email' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async resetPassword(req, res) {
        try {
            const { resetToken } = req.params;
            const { password } = req.body;

            // Find user with the provided reset token
            const user = await UserModel.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } });

            console.log(resetToken, password);
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            const hashedPassword = await hashService.hashPassword(password);
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;
            await user.save();
            res.status(200).json({ message: 'Password reset successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    async refreshToken(req, res) {
        const { token: tokenFromCookie } = req.cookies;

        let userData;
        try {
            userData = await tokenService.verifyToken(tokenFromCookie);
        } catch (err) {
            return res.status(401).json({ message: "Invalid Token" });
        }


        try {

            const token = await tokenService.findToken(userData.userId, tokenFromCookie);


            if (!token) {
                return res.status(401).json({ message: "Invalid Token" });

            }
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });

        }

        const user = await userService.findUser({ _id: userData.userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });

        }

        const newGeneratedToken = tokenService.generateTokens({ userId: user._id, role: user.role });

        try {
            await tokenService.updateToken(userData.userId, newGeneratedToken);
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });

        }


        res.cookie('token', newGeneratedToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });

        const userDto = new UserDto(user);
        res.send(userDto);

    }

    async logout(req, res) {
        const { token } = req.cookies;
        await tokenService.removeToken(token);

        res.clearCookie('token', {
            sameSite: 'none',
            secure: true

        });
        res.send({ user: null, isAuth: false });
    }
}

module.exports = new AuthController();