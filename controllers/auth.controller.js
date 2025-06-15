// controllers/auth.controller.js
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

// For demo: store reset tokens in-memory (or better store in DB)
const resetTokens = new Map();

// Importing status codes and messages for better response handling
const STATUS = require('../helpers/statusCodes');
const MSG = require('../helpers/messages');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(STATUS.BAD_REQUEST).json({
                statusCode: STATUS.BAD_REQUEST,
                message: MSG.EMAIL_ALREADY_EXISTS,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = generateToken(user._id);

        // Clean up the user object before sending
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        res.status(STATUS.CREATED).json({
            statusCode: STATUS.CREATED,
            message: MSG.SIGNUP_SUCCESS,
            data: {
                user: userData,
                token
            }
        });
    } catch (err) {
        res.status(STATUS.SERVER_ERROR).json({
            statusCode: STATUS.SERVER_ERROR,
            message: MSG.SERVER_ERROR,
            error: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(STATUS.BAD_REQUEST).json({
                statusCode: STATUS.BAD_REQUEST,
                message: MSG.INVALID_CREDENTIALS
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(STATUS.BAD_REQUEST).json({
                statusCode: STATUS.BAD_REQUEST,
                message: MSG.INVALID_CREDENTIALS
            });
        }

        const token = generateToken(user._id);

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        res.status(STATUS.SUCCESS).json({
            statusCode: STATUS.SUCCESS,
            message: MSG.LOGIN_SUCCESS,
            data: {
                user: userData,
                token
            }
        });
    } catch (err) {
        res.status(STATUS.SERVER_ERROR).json({
            statusCode: STATUS.SERVER_ERROR,
            message: MSG.SERVER_ERROR,
            error: err.message
        });
    }
};

exports.logout = async (req, res) => {
    const logoutAt = new Date().toISOString();

    res.status(STATUS.SUCCESS).json({
        statusCode: STATUS.SUCCESS,
        message: MSG.LOGOUT_SUCCESS,
        logoutAt
    });
};

exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({
                statusCode: STATUS.NOT_FOUND,
                message: MSG.USER_NOT_FOUND
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(STATUS.BAD_REQUEST).json({
                statusCode: STATUS.BAD_REQUEST,
                message: MSG.OLD_PASSWORD_INCORRECT
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(STATUS.BAD_REQUEST).json({
                statusCode: STATUS.BAD_REQUEST,
                message: MSG.SAME_PASSWORD
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(STATUS.SUCCESS).json({
            statusCode: STATUS.SUCCESS,
            message: MSG.PASSWORD_UPDATED
        });
    } catch (err) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            statusCode: STATUS.INTERNAL_SERVER_ERROR,
            message: MSG.SERVER_ERROR,
            error: err.message
        });
    }
};

//*****wait for email send functionality to be implemented*****
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({
                statusCode: STATUS.NOT_FOUND,
                message: MSG.USER_NOT_FOUND
            });
        }

        // Create reset token (usually sent by email)
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Save reset token with expiry (e.g. 1 hour)
        resetTokens.set(resetToken, { userId: user._id, expires: Date.now() + 3600000 });

        // TODO: Send this token via email in real app
        res.status(STATUS.SUCCESS).json({
            statusCode: STATUS.SUCCESS,
            message: MSG.FORGOT_PASSWORD_EMAIL_SENT,
            resetToken
        });
    } catch (err) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            statusCode: STATUS.INTERNAL_SERVER_ERROR,
            message: MSG.SERVER_ERROR,
            error: err.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!resetTokens.has(token)) {
            return res.status(STATUS.BAD_REQUEST).json({
                statusCode: STATUS.BAD_REQUEST,
                message: MSG.INVALID_TOKEN
            });
        }

        const { userId, expires } = resetTokens.get(token);
        if (Date.now() > expires) {
            resetTokens.delete(token);
            return res.status(STATUS.BAD_REQUEST).json({
                statusCode: STATUS.BAD_REQUEST,
                message: MSG.INVALID_TOKEN
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({
                statusCode: STATUS.NOT_FOUND,
                message: MSG.USER_NOT_FOUND
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        resetTokens.delete(token);

        res.status(STATUS.SUCCESS).json({
            statusCode: STATUS.SUCCESS,
            message: MSG.PASSWORD_RESET_SUCCESS
        });
    } catch (err) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            statusCode: STATUS.INTERNAL_SERVER_ERROR,
            message: MSG.SERVER_ERROR,
            error: err.message
        });
    }
};

exports.countUsers = async (req, res) => {
    try {
        const count = await commonQuery.countDocuments(User, req.query);
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.estimateTotalUsers = async (req, res) => {
    try {
        const count = await commonQuery.estimatedDocumentCount(User);
        res.json({ estimatedCount: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.checkUserExists = async (req, res) => {
    try {
        const exists = await commonQuery.exists(User, req.query);
        res.json({ exists: !!exists });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDistinctUserEmails = async (req, res) => {
    try {
        const emails = await commonQuery.distinct(User, 'email', req.query);
        res.json({ emails });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
