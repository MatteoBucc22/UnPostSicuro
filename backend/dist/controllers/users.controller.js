"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserProfile = exports.completeRegistration = exports.userExists = void 0;
const supabaseClient_1 = require("../database/supabaseClient");
const userExists = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .select('id')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116')
            return res.status(500).json({ error: error.message });
        res.json(!!data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.userExists = userExists;
const completeRegistration = async (req, res) => {
    try {
        const { email, name, surname, dob, gender, phone, city, providerId } = req.body;
        if (!providerId) {
            return res.status(400).json({ error: 'ID utente mancante' });
        }
        const { data, error } = await supabaseClient_1.supabase.from('users').insert([{
                id: providerId,
                email,
                name,
                surname,
                dob,
                gender,
                phone,
                city
            }]);
        if (error)
            return res.status(500).json({ error: error.message });
        res.json({ message: 'Utente completato con successo', data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.completeRegistration = completeRegistration;
const getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            return res.status(500).json({ error: error.message });
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            return res.status(500).json({ error: error.message });
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=users.controller.js.map