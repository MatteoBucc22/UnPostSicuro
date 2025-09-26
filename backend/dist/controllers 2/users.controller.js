"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userExists = exports.addUser = exports.getUsers = void 0;
const supabaseClient_1 = require("../database/supabaseClient");
const getUsers = async (req, res) => {
    const { data, error } = await supabaseClient_1.supabase.from('users').select('*');
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.getUsers = getUsers;
const addUser = async (req, res) => {
    try {
        const { email, name, surname, dob, gender, phone, city, providerId } = req.body;
        const { data, error } = await supabaseClient_1.supabase.from('users').upsert([{
                id: providerId || undefined,
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
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.addUser = addUser;
const userExists = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .select('id')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116')
            return res.status(500).json(false);
        res.json(!!data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json(false);
    }
};
exports.userExists = userExists;
//# sourceMappingURL=users.controller.js.map