// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/signup', async (req, res) => {
    try {
        await authController.signup(req, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        await authController.login(req, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        await authController.logout(req, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/update-password', auth, async (req, res) => {
    try {
        await authController.updatePassword(req, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        await authController.forgotPassword(req, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        await authController.resetPassword(req, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
