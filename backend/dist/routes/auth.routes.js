"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabaseClient_1 = require("../database/supabaseClient");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, surname, dob, gender, phone, city } = req.body;
        const { data: authData, error: authError } = await supabaseClient_1.supabase.auth.signUp({ email, password });
        if (authError)
            return res.status(400).json({ error: authError.message });
        if (!authData.user?.id)
            return res.status(500).json({ error: 'ID utente mancante' });
        const { data: userData, error: dbError } = await supabaseClient_1.supabase.from('users').insert([{
                id: authData.user.id,
                email,
                name,
                surname,
                dob,
                gender,
                phone,
                city
            }]);
        if (dbError)
            return res.status(500).json({ error: dbError.message });
        res.json({ message: 'Utente registrato con successo', user: userData });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore interno del server' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map