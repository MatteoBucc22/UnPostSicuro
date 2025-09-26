"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeRegistration = exports.userExists = void 0;
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
//# sourceMappingURL=users.controller.js.map