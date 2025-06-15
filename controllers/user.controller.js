// controllers/user.controller.js
const User = require('../models/user.model');
const commonQuery = require('../helpers/commonQuery');

exports.getUsers = async (req, res) => {
    try {
        const users = await commonQuery.find(User, {
            filter: req.query,
            sort: { createdAt: -1 },
            limit: 10
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await commonQuery.findById(User, req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const user = await commonQuery.create(User, req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await commonQuery.updateById(User, req.params.id, req.body);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await commonQuery.deleteById(User, req.params.id);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
